"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ElderInfo,
  AssessmentResult,
  CarePlan,
  CarePlanItem,
} from "@/lib/types/care-plan";
import { BasicInfoForm } from "@/components/assessment/basic-info-form";
import { AssessmentQuestionnaire } from "@/components/assessment/assessment-questionnaire";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateId } from "@/lib/utils/storage";
import { saveCarePlan } from "@/lib/utils/storage";
import { parseAIResponse } from "@/lib/utils/prompt-builder";
import { ASSESSMENT_QUESTIONS } from "@/lib/constants/assessment-questions";
import { PRESET_CASES } from "@/lib/constants/preset-data";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  FileInput,
  RotateCcw,
  GraduationCap,
  BookOpen,
} from "lucide-react";

type GeneratePlanStreamStage =
  | "started"
  | "created"
  | "generating"
  | "completed";

type GeneratePlanStreamHandlers = {
  onStatus?: (stage: GeneratePlanStreamStage) => void;
  onDelta?: (delta: string) => void;
  onHeartbeat?: () => void;
};

type GenerationUiStage =
  | "idle"
  | "connecting"
  | "analyzing"
  | "writing"
  | "finalizing"
  | "parsing";

const GENERATION_STAGE_ORDER: GenerationUiStage[] = [
  "connecting",
  "analyzing",
  "writing",
  "finalizing",
];

const GENERATION_STAGE_LABELS: Record<GenerationUiStage, string> = {
  idle: "等待开始",
  connecting: "提交请求",
  analyzing: "分析评估",
  writing: "生成方案",
  finalizing: "整理保存",
  parsing: "整理保存",
};

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

async function readGeneratePlanStream(
  stream: ReadableStream<Uint8Array>,
  handlers: GeneratePlanStreamHandlers
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

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
      case "status":
        if (
          payload &&
          typeof payload === "object" &&
          typeof (payload as { stage?: unknown }).stage === "string"
        ) {
          handlers.onStatus?.(
            (payload as { stage: GeneratePlanStreamStage }).stage
          );
        }
        break;

      case "delta":
        if (
          payload &&
          typeof payload === "object" &&
          typeof (payload as { delta?: unknown }).delta === "string"
        ) {
          const delta = (payload as { delta: string }).delta;
          fullText += delta;
          handlers.onDelta?.(delta);
        }
        break;

      case "heartbeat":
        handlers.onHeartbeat?.();
        break;

      case "complete":
        if (
          payload &&
          typeof payload === "object" &&
          typeof (payload as { content?: unknown }).content === "string"
        ) {
          fullText = (payload as { content: string }).content;
        }
        break;

      case "error":
        if (
          payload &&
          typeof payload === "object" &&
          typeof (payload as { error?: unknown }).error === "string"
        ) {
          throw new Error((payload as { error: string }).error);
        }
        throw new Error("生成照护方案失败");

      default:
        break;
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
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

    return fullText;
  } finally {
    reader.releaseLock();
  }
}

export default function AssessmentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [elderInfo, setElderInfo] = useState<Partial<ElderInfo>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult>(
    {}
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatusText, setGenerationStatusText] = useState(
    "准备开始生成..."
  );
  const [generationStage, setGenerationStage] =
    useState<GenerationUiStage>("idle");
  const [generationElapsedSeconds, setGenerationElapsedSeconds] = useState(0);
  const [lastGenerationActivityAt, setLastGenerationActivityAt] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedPlanId, setGeneratedPlanId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const timer = window.setInterval(() => {
      setGenerationElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isGenerating]);

  // 加载预设案例
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_CASES.find((p) => p.id === presetId);
    if (preset) {
      setElderInfo(preset.elderInfo);
      setAssessmentResult(preset.assessmentResult);
      setSelectedPreset(presetId);
    }
  };

  // 清空表单
  const handleClearForm = () => {
    setElderInfo({});
    setAssessmentResult({});
    setSelectedPreset("");
  };

  // 验证基本信息
  const isBasicInfoValid = () => {
    return (
      elderInfo.name &&
      elderInfo.age &&
      elderInfo.gender &&
      elderInfo.height &&
      elderInfo.weight
    );
  };

  // 计算评估完成度
  const getAssessmentProgress = () => {
    const answered = Object.keys(assessmentResult).filter((key) => {
      const answer = assessmentResult[key];
      if (Array.isArray(answer)) return answer.length > 0;
      return !!answer;
    }).length;
    return Math.round((answered / ASSESSMENT_QUESTIONS.length) * 100);
  };

  // 生成照护方案
  const handleGenerate = async () => {
    if (!isBasicInfoValid()) {
      setError("请先完善老人基本信息");
      setActiveTab("basic");
      return;
    }

    const progress = getAssessmentProgress();
    if (progress < 50) {
      setError("请至少完成 50% 的评估项目");
      setActiveTab("assessment");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setGenerationStage("connecting");
    setGenerationElapsedSeconds(0);
    setLastGenerationActivityAt(Date.now());
    setGenerationStatusText("正在提交评估数据...");

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elderInfo: elderInfo as ElderInfo,
          assessmentResult,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        if (contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.error || data.details || "请求失败");
        }

        const errorText = await response.text();
        throw new Error(errorText || "请求失败");
      }

      let aiText = "";

      if (contentType.includes("text/event-stream")) {
        if (!response.body) {
          throw new Error("服务器未返回流式响应");
        }

        aiText = await readGeneratePlanStream(response.body, {
          onStatus: (stage) => {
            setLastGenerationActivityAt(Date.now());
            switch (stage) {
              case "started":
                setGenerationProgress(8);
                setGenerationStage("connecting");
                setGenerationStatusText("已提交生成请求，正在连接模型...");
                break;
              case "created":
                setGenerationProgress(18);
                setGenerationStage("analyzing");
                setGenerationStatusText("模型已接收请求，开始分析评估结果...");
                break;
              case "generating":
                setGenerationProgress((prev) => Math.max(prev, 30));
                setGenerationStage("writing");
                setGenerationStatusText("正在生成照护方案正文...");
                break;
              case "completed":
                setGenerationProgress(95);
                setGenerationStage("finalizing");
                setGenerationStatusText("模型输出完成，正在整理方案...");
                break;
              default:
                break;
            }
          },
          onDelta: (delta) => {
            setLastGenerationActivityAt(Date.now());
            setGenerationProgress((prev) =>
              Math.min(prev + Math.max(1, Math.ceil(delta.length / 400)), 90)
            );
            setGenerationStage("writing");
            setGenerationStatusText("正在生成照护方案正文...");
          },
          onHeartbeat: () => {
            setLastGenerationActivityAt(Date.now());
          },
        });
      } else {
        const data = await response.json();
        aiText = data.content;
      }

      setGenerationProgress(100);
      setGenerationStage("parsing");
      setGenerationStatusText("方案生成完成，正在解析结构化结果...");

      if (!aiText) {
        throw new Error("AI 未返回有效响应");
      }

      // 解析 AI 响应
      const parsed = parseAIResponse(aiText);

      if (!parsed || !parsed.carePlanItems) {
        throw new Error("AI 响应格式解析失败");
      }

      // 创建照护方案
      const planId = generateId();
      const carePlan: CarePlan = {
        id: planId,
        createdAt: new Date().toISOString(),
        elderInfo: {
          ...(elderInfo as ElderInfo),
          id: generateId(),
        },
        assessmentResult,
        carePlanItems: parsed.carePlanItems as CarePlanItem[],
        rawAIResponse: aiText,
      };

      // 保存到本地存储
      saveCarePlan(carePlan);
      setGeneratedPlanId(planId);
      setShowSuccessDialog(true);
    } catch (err) {
      setGenerationStage("idle");
      setError(err instanceof Error ? err.message : "生成照护方案失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPlan = () => {
    if (generatedPlanId) {
      router.push(`/care-plans/${generatedPlanId}`);
    }
  };

  const handleNewAssessment = () => {
    setShowSuccessDialog(false);
    setElderInfo({});
    setAssessmentResult({});
    setActiveTab("basic");
    setGeneratedPlanId(null);
    setSelectedPreset("");
  };

  const generationSilentSeconds = lastGenerationActivityAt
    ? Math.max(0, Math.floor((Date.now() - lastGenerationActivityAt) / 1000))
    : 0;
  const generationElapsedText = formatElapsed(generationElapsedSeconds);
  const generationLiveStatus =
    generationSilentSeconds <= 3
      ? "AI正在生成方案，请等待约30秒"
      : generationSilentSeconds <= 8
        ? "模型仍在处理中，当前阶段可能需要更久"
        : "暂时没有新文本返回，但任务仍在继续";
  const generationLiveHint =
    generationElapsedSeconds < 15
      ? "这一步通常需要 20 到 60 秒，系统会持续刷新状态。"
      : generationSilentSeconds <= 5
        ? "刚刚收到模型活动，说明任务还在正常推进。"
        : "长文本生成会出现短暂停顿，这不是死机，模型还在工作。";
  const generationStageIndex = Math.max(
    GENERATION_STAGE_ORDER.indexOf(generationStage),
    generationStage === "parsing" ? GENERATION_STAGE_ORDER.length - 1 : 0
  );

  return (
    <div className="container max-w-6xl py-8 lg:py-12">
      {/* 页面标题区域 - 教学风格 */}
      <div className="page-header animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <GraduationCap className="h-3.5 w-3.5" />
            Module 01 · 评估模块
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight lg:text-4xl">
          老人需求评估
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          请填写老人的基本信息并完成多维度健康评估，系统将基于评估结果生成个性化照护方案。
        </p>
      </div>

      {/* 预设案例快速加载 - 教学提示风格 */}
      <div className="knowledge-box knowledge-box--tip mb-6 animate-fade-in-up animate-fade-in-up-delay-1">
        <div className="flex items-center gap-2 mb-3">
          <FileInput className="h-4 w-4" style={{ color: 'var(--edu-tip)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--edu-tip)' }}>
            快速加载预设案例
          </span>
          <span className="ml-1 rounded bg-background/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            教学演示
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedPreset} onValueChange={handleLoadPreset}>
            <SelectTrigger className="w-80 bg-background/60">
              <SelectValue placeholder="选择一个预设案例..." />
            </SelectTrigger>
            <SelectContent>
              {PRESET_CASES.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  <div className="flex flex-col items-start">
                    <span>{preset.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {preset.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearForm}
            disabled={!elderInfo.name && Object.keys(assessmentResult).length === 0}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            清空表单
          </Button>
        </div>
        {selectedPreset && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--edu-success)]" />
            已加载预设案例数据，您可以直接生成方案或修改后生成
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 animate-fade-in-up">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="animate-fade-in-up animate-fade-in-up-delay-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2 h-12">
            <TabsTrigger value="basic" className="gap-2 text-sm">
              <span className={`step-indicator ${activeTab === 'basic' ? 'step-indicator--active' : 'step-indicator--inactive'} !w-6 !h-6 text-xs`}>
                1
              </span>
              基本信息
              {isBasicInfoValid() && (
                <CheckCircle2 className="h-4 w-4 text-[var(--edu-success)]" />
              )}
            </TabsTrigger>
            <TabsTrigger value="assessment" className="gap-2 text-sm">
              <span className={`step-indicator ${activeTab === 'assessment' ? 'step-indicator--active' : 'step-indicator--inactive'} !w-6 !h-6 text-xs`}>
                2
              </span>
              健康评估
              {getAssessmentProgress() > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {getAssessmentProgress()}%
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <BasicInfoForm value={elderInfo} onChange={setElderInfo} />

            <div className="flex justify-end">
              <Button
                onClick={() => setActiveTab("assessment")}
                disabled={!isBasicInfoValid()}
                size="lg"
              >
                下一步：健康评估
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <AssessmentQuestionnaire
              value={assessmentResult}
              onChange={setAssessmentResult}
            />

            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回基本信息
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || getAssessmentProgress() < 50}
                size="lg"
                className="min-w-44 shadow-md shadow-primary/15"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在生成方案...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    生成照护方案
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 生成进度对话框 */}
      <Dialog open={isGenerating} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary animate-gentle-pulse" />
              </div>
              正在生成照护方案
            </DialogTitle>
            <DialogDescription>
              这一步通常需要一点时间。页面会持续显示实时状态，请不要关闭。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-xl border border-primary/10 bg-muted/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--edu-success)] opacity-70" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--edu-success)]" />
                  </span>
                  <p className="text-sm font-medium">{generationLiveStatus}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-primary">
                  已耗时 {generationElapsedText}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {generationLiveHint}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>阶段推进</span>
                <span>{GENERATION_STAGE_LABELS[generationStage]}</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {GENERATION_STAGE_ORDER.map((stageKey, index) => {
                const isDone = index < generationStageIndex;
                const isActive = index === generationStageIndex;

                return (
                  <div
                    key={stageKey}
                    className={[
                      "rounded-lg border px-3 py-2 transition-colors",
                      isDone
                        ? "border-[var(--edu-success)]/35 bg-[var(--edu-success-bg)]/50 text-[var(--edu-success)]"
                        : isActive
                          ? "border-primary/25 bg-primary/8 text-foreground"
                          : "border-border bg-background/70 text-muted-foreground",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                          isDone
                            ? "bg-[var(--edu-success)]/14"
                            : isActive
                              ? "bg-primary/12 text-primary"
                              : "bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        {isDone ? "✓" : index + 1}
                      </span>
                      <span>{GENERATION_STAGE_LABELS[stageKey]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-border/80 bg-background/80 px-3 py-2">
              <p className="text-sm font-medium text-foreground">当前系统提示</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {generationStatusText}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 生成成功对话框 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="animate-check-pop flex h-8 w-8 items-center justify-center rounded-full bg-[var(--edu-success-bg)]">
                <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--edu-success)' }} />
              </div>
              照护方案生成成功
            </DialogTitle>
            <DialogDescription>
              已为 <span className="font-medium text-foreground">{elderInfo.name}</span> 生成个性化照护方案，您可以立即查看或开始新的评估
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleNewAssessment}>
              新建评估
            </Button>
            <Button onClick={handleViewPlan} className="flex-1 shadow-sm">
              <BookOpen className="mr-2 h-4 w-4" />
              查看照护方案
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
