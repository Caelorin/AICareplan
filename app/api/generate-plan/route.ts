import type { ElderInfo, AssessmentResult } from "@/lib/types/care-plan";
import { buildPrompt } from "@/lib/utils/prompt-builder";

const ARK_RESPONSES_URL = "https://ark.cn-beijing.volces.com/api/v3/responses";
const STREAM_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

function encodeSseMessage(event: string, payload: unknown) {
  return new TextEncoder().encode(
    `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`
  );
}

function extractResponseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const source =
    "response" in payload &&
    payload.response &&
    typeof payload.response === "object"
      ? (payload.response as Record<string, unknown>)
      : (payload as Record<string, unknown>);

  const output = Array.isArray(source.output) ? source.output : [];
  const parts: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const outputItem = item as Record<string, unknown>;

    if (typeof outputItem.text === "string") {
      parts.push(outputItem.text);
    }

    const content = Array.isArray(outputItem.content) ? outputItem.content : [];
    for (const contentPart of content) {
      if (!contentPart || typeof contentPart !== "object") {
        continue;
      }

      const part = contentPart as Record<string, unknown>;
      if (typeof part.text === "string") {
        parts.push(part.text);
      }
    }
  }

  return parts.join("");
}

function extractErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "模型响应异常";
  }

  const record = payload as Record<string, unknown>;

  if (
    "error" in record &&
    record.error &&
    typeof record.error === "object" &&
    typeof (record.error as Record<string, unknown>).message === "string"
  ) {
    return (record.error as Record<string, unknown>).message as string;
  }

  if (typeof record.message === "string") {
    return record.message;
  }

  if (typeof record.status === "string") {
    return `模型状态异常: ${record.status}`;
  }

  return "模型响应异常";
}

export async function POST(request: Request) {
  console.log("[kimi] API route called");

  try {
    const body = await request.json();
    console.log(
      "[kimi] Request body received:",
      JSON.stringify(body).substring(0, 200)
    );

    const { elderInfo, assessmentResult } = body as {
      elderInfo: ElderInfo;
      assessmentResult: AssessmentResult;
    };

    if (!elderInfo || !assessmentResult) {
      console.log("[kimi] Missing required data");
      return new Response(
        JSON.stringify({ error: "缺少必要的评估数据" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(elderInfo, assessmentResult);
    console.log("[kimi] Prompt built, length:", prompt.length);

    const apiKey = process.env.DOUBAO_API_KEY;
    const modelId =
      process.env.DOUBAO_MODEL_ID || "doubao-1-5-pro-256k-250115";

    console.log("[kimi] Using model:", modelId);
    console.log("[kimi] API key present:", !!apiKey);

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "未配置豆包API密钥，请在设置中添加 DOUBAO_API_KEY 环境变量",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const startTime = Date.now();
    const singleInput = `你是一位专业的老年护理专家，拥有丰富的跨学科护理经验。你的任务是根据老人的评估信息制定个性化、可操作、有循证依据的照护方案。请用专业但易懂的语言，帮助护理专业学生理解护理决策的逻辑。请严格按照要求的JSON格式输出。\n\n${prompt}`;

    console.log("[kimi] Sending streaming request to AI...");

    const response = await fetch(ARK_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: modelId,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: singleInput,
              },
            ],
          },
        ],
        stream: true,
        thinking: { type: "disabled" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[kimi] API responded with status:",
        response.status,
        errorText
      );
      return new Response(
        JSON.stringify({
          error: "生成照护方案失败",
          details: `API error (${response.status}): ${errorText}`,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!response.body) {
      console.error("[kimi] Ark response body is empty");
      return new Response(
        JSON.stringify({ error: "模型未返回流式数据" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const upstreamReader = response.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = "";
        let fullText = "";

        const sendEvent = (event: string, payload: unknown) => {
          controller.enqueue(encodeSseMessage(event, payload));
        };

        const processEvent = (rawEvent: string) => {
          const lines = rawEvent.split("\n");
          let eventName = "message";
          const dataLines: string[] = [];

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trimStart());
            }
          }

          const dataText = dataLines.join("\n");
          if (!dataText || dataText === "[DONE]") {
            return;
          }

          let payload: unknown = dataText;
          try {
            payload = JSON.parse(dataText);
          } catch {
            payload = dataText;
          }

          switch (eventName) {
            case "response.created":
              sendEvent("status", { stage: "created" });
              break;

            case "response.in_progress":
              sendEvent("status", { stage: "generating" });
              break;

            case "response.output_text.delta":
              if (
                payload &&
                typeof payload === "object" &&
                typeof (payload as { delta?: unknown }).delta === "string"
              ) {
                const delta = (payload as { delta: string }).delta;
                fullText += delta;
                sendEvent("delta", { delta });
              }
              break;

            case "response.output_text.done":
              if (
                !fullText &&
                payload &&
                typeof payload === "object" &&
                typeof (payload as { text?: unknown }).text === "string"
              ) {
                const text = (payload as { text: string }).text;
                fullText = text;
                sendEvent("delta", { delta: text });
              }
              break;

            case "response.completed": {
              const completedText = extractResponseText(payload);
              if (completedText && completedText.length > fullText.length) {
                const delta = completedText.slice(fullText.length);
                fullText = completedText;
                if (delta) {
                  sendEvent("delta", { delta });
                }
              }
              sendEvent("status", { stage: "completed" });
              break;
            }

            case "response.failed":
            case "response.incomplete":
            case "error":
              throw new Error(extractErrorMessage(payload));

            default:
              break;
          }
        };

        sendEvent("status", { stage: "started" });

        try {
          while (true) {
            const { done, value } = await upstreamReader.read();
            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });

            let boundaryIndex = buffer.indexOf("\n\n");
            while (boundaryIndex !== -1) {
              const rawEvent = buffer.slice(0, boundaryIndex).replace(/\r/g, "");
              buffer = buffer.slice(boundaryIndex + 2);

              if (rawEvent.trim()) {
                processEvent(rawEvent);
              }

              boundaryIndex = buffer.indexOf("\n\n");
            }
          }

          buffer += decoder.decode();
          if (buffer.trim()) {
            processEvent(buffer.replace(/\r/g, ""));
          }

          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          console.log(
            `[kimi] Streaming AI response completed in ${elapsed}s, length: ${fullText.length}`
          );

          sendEvent("complete", { content: fullText });
          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "流式生成失败";
          console.error("[kimi] Stream processing failed:", error);
          sendEvent("error", { error: errorMessage });
          controller.close();
        } finally {
          await upstreamReader.cancel().catch(() => undefined);
        }
      },

      async cancel() {
        await upstreamReader.cancel().catch(() => undefined);
      },
    });

    return new Response(stream, { headers: STREAM_HEADERS });
  } catch (error) {
    console.error("[kimi] 生成照护方案失败:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return new Response(
      JSON.stringify({
        error: "生成照护方案失败",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
