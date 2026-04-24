import type { ElderInfo, AssessmentResult } from "@/lib/types/care-plan";
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_CATEGORIES,
} from "@/lib/constants/assessment-questions";
import { CARE_CATEGORIES } from "@/lib/constants/care-categories";

function formatElderInfo(info: ElderInfo): string {
  const bmi = info.weight / Math.pow(info.height / 100, 2);
  const bmiStatus =
    bmi < 18.5
      ? "偏瘦"
      : bmi < 24
        ? "正常"
        : bmi < 28
          ? "超重"
          : "肥胖";

  return `
- 姓名/代号：${info.name}
- 年龄：${info.age}岁
- 性别：${info.gender === "male" ? "男" : "女"}
- 身高/体重：${info.height}cm / ${info.weight}kg（BMI: ${bmi.toFixed(1)}，${bmiStatus}）
- 主要诊断：${info.diagnosis || "无"}
- 既往病史：${info.medicalHistory || "无"}
- 过敏史：${info.allergies || "无"}
- 当前用药：${info.medications || "无"}
- 主要照护者：${info.primaryCaregiver || "未指定"}
- 居住环境：${info.livingEnvironment === "alone" ? "独居" : info.livingEnvironment === "with_family" ? "与家人同住" : "养老机构"}
`;
}

function formatAssessmentResult(result: AssessmentResult): string {
  const lines: string[] = [];

  for (const category of ASSESSMENT_CATEGORIES) {
    const categoryQuestions = ASSESSMENT_QUESTIONS.filter(
      (q) => q.category === category.id
    );

    lines.push(`\n### ${category.name}`);

    for (const question of categoryQuestions) {
      const answer = result[question.id];
      if (!answer) continue;

      let answerText: string;
      if (Array.isArray(answer)) {
        const labels = answer.map((v) => {
          const option = question.options.find((o) => o.value === v);
          return option?.label || v;
        });
        answerText = labels.join("、");
      } else {
        const option = question.options.find((o) => o.value === answer);
        answerText = option?.label || answer;
      }

      lines.push(`- ${question.question}：${answerText}`);
    }
  }

  return lines.join("\n");
}

function formatCareCategories(): string {
  return CARE_CATEGORIES.map(
    (cat) => `\n**${cat.name}**\n${cat.items.map((item) => `- ${item}`).join("\n")}`
  ).join("\n");
}

export function buildPrompt(
  elderInfo: ElderInfo,
  assessmentResult: AssessmentResult
): string {
  return `你是一位资深的老年护理专家，拥有跨学科护理知识和丰富的临床经验。请根据以下老人的评估信息，为每个适用的照护项目制定详细、个性化的护理方案。

## 老人基本信息
${formatElderInfo(elderInfo)}

## 多维度评估结果
${formatAssessmentResult(assessmentResult)}

## 需要制定方案的照护项目分类
${formatCareCategories()}

---

## 输出要求

请根据该老人的具体情况，为每个**适用**的照护项目制定详细方案。对于不适用的项目可以简要说明原因或跳过。

请严格按照以下JSON格式输出，确保可以被程序解析：

\`\`\`json
{
  "carePlanItems": [
    {
      "category": "照护类别名称",
      "title": "具体照护项目名称",
      "goal": "该项护理的具体目标",
      "measures": [
        "具体措施1",
        "具体措施2",
        "具体措施3"
      ],
      "rationale": "为什么针对该老人情况采取这些措施的护理学依据",
      "precautions": "需要特别注意的风险或细节",
      "evaluationFrequency": "建议多久评估一次效果"
    }
  ]
}
\`\`\`

## 方案制定原则

1. **个性化** - 所有建议必须针对该老人的具体评估结果
2. **可操作性** - 护理人员能够按照措施执行
3. **循证依据** - 基于护理学证据和最佳实践
4. **教学价值** - 帮助养老专业学生理解照护决策的逻辑
5. **安全优先** - 充分考虑潜在风险

请现在开始制定照护方案。`;
}

export function parseAIResponse(response: string): {
  carePlanItems: Array<{
    category: string;
    title: string;
    goal: string;
    measures: string[];
    rationale: string;
    precautions: string;
    evaluationFrequency: string;
  }>;
} | null {
  try {
    // 尝试提取JSON块
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // 尝试直接解析
    const directMatch = response.match(/\{[\s\S]*"carePlanItems"[\s\S]*\}/);
    if (directMatch) {
      return JSON.parse(directMatch[0]);
    }

    return null;
  } catch {
    return null;
  }
}
