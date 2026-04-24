"use client";

import { useMemo } from "react";
import type { SVGProps } from "react";
import type { AssessmentResult } from "@/lib/types/care-plan";
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_CATEGORIES,
} from "@/lib/constants/assessment-questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Brain,
  Eye,
  Heart,
  UtensilsCrossed,
  Users,
  Stethoscope,
  CheckCircle2,
  ListChecks,
} from "lucide-react";

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<SVGProps<SVGSVGElement>>
> = {
  adl: Activity,
  cognitive: Brain,
  sensory: Eye,
  physical: Heart,
  nutrition: UtensilsCrossed,
  social: Users,
  special: Stethoscope,
};

const CATEGORY_COLORS: Record<string, string> = {
  adl: "var(--edu-info)",
  cognitive: "var(--edu-tip)",
  sensory: "var(--edu-warn)",
  physical: "var(--destructive)",
  nutrition: "var(--edu-success)",
  social: "var(--accent)",
  special: "var(--primary)",
};

interface AssessmentQuestionnaireProps {
  value: AssessmentResult;
  onChange: (value: AssessmentResult) => void;
}

export function AssessmentQuestionnaire({
  value,
  onChange,
}: AssessmentQuestionnaireProps) {
  const updateAnswer = (questionId: string, answer: string | string[]) => {
    onChange({ ...value, [questionId]: answer });
  };

  const handleSingleSelect = (questionId: string, answer: string) => {
    updateAnswer(questionId, answer);
  };

  const handleMultiSelect = (
    questionId: string,
    optionValue: string,
    checked: boolean
  ) => {
    const current = (value[questionId] as string[]) || [];
    let newValue: string[];

    if (checked) {
      // 如果选择了"无"类选项，清除其他选项
      if (optionValue === "none" || optionValue.includes("none")) {
        newValue = [optionValue];
      } else {
        // 如果选择了其他选项，移除"无"类选项
        newValue = [...current.filter((v) => v !== "none"), optionValue];
      }
    } else {
      newValue = current.filter((v) => v !== optionValue);
    }

    updateAnswer(questionId, newValue);
  };

  const progress = useMemo(() => {
    const answered = Object.keys(value).filter((key) => {
      const answer = value[key];
      if (Array.isArray(answer)) return answer.length > 0;
      return !!answer;
    }).length;
    return Math.round((answered / ASSESSMENT_QUESTIONS.length) * 100);
  }, [value]);

  const answeredCount = useMemo(() => {
    return Object.keys(value).filter((key) => {
      const answer = value[key];
      if (Array.isArray(answer)) return answer.length > 0;
      return !!answer;
    }).length;
  }, [value]);

  return (
    <div className="space-y-5">
      {/* 进度指示 - 强化视觉 */}
      <Card className="overflow-hidden border-primary/15">
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/40" style={{ width: `${progress}%`, transition: 'width 0.5s ease' }} />
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">评估完成进度</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-primary">{progress}%</span>
              <span className="text-xs text-muted-foreground">
                ({answeredCount} / {ASSESSMENT_QUESTIONS.length} 项)
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          {progress >= 50 && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs" style={{ color: 'var(--edu-success)' }}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              已满足最低要求，可以生成照护方案
            </p>
          )}
          {progress > 0 && progress < 50 && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              还需完成至少 {Math.ceil(ASSESSMENT_QUESTIONS.length * 0.5) - answeredCount} 项才能生成方案
            </p>
          )}
        </CardContent>
      </Card>

      {/* 按类别分组的问卷 */}
      {ASSESSMENT_CATEGORIES.map((category, catIndex) => {
        const CategoryIcon = CATEGORY_ICONS[category.id] || Activity;
        const categoryColor = CATEGORY_COLORS[category.id] || "var(--primary)";
        const categoryQuestions = ASSESSMENT_QUESTIONS.filter(
          (q) => q.category === category.id
        );

        // 计算该分类的完成数
        const categoryAnswered = categoryQuestions.filter((q) => {
          const answer = value[q.id];
          if (Array.isArray(answer)) return answer.length > 0;
          return !!answer;
        }).length;

        return (
          <Card key={category.id} className="edu-card overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2.5 text-base">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: `color-mix(in oklch, ${categoryColor} 12%, transparent)` }}
                >
                  <CategoryIcon className="h-4 w-4" style={{ color: categoryColor }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold">{category.name}</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {categoryAnswered}/{categoryQuestions.length} 项已完成
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {categoryAnswered === categoryQuestions.length && categoryQuestions.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: 'var(--edu-success-bg)', color: 'var(--edu-success)' }}>
                      <CheckCircle2 className="h-3 w-3" />
                      已完成
                    </span>
                  )}
                  <span className="text-xs font-normal text-muted-foreground">
                    {categoryQuestions.length} 项评估
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryQuestions.map((question, index) => {
                const isAnswered = (() => {
                  const answer = value[question.id];
                  if (Array.isArray(answer)) return answer.length > 0;
                  return !!answer;
                })();

                return (
                  <div
                    key={question.id}
                    className={`question-card ${isAnswered ? 'border-[var(--edu-success)]/30 bg-[var(--edu-success-bg)]/30' : ''}`}
                  >
                    <div className="mb-4 flex items-start gap-2.5">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{
                          background: isAnswered ? 'var(--edu-success-bg)' : `color-mix(in oklch, ${categoryColor} 12%, transparent)`,
                          color: isAnswered ? 'var(--edu-success)' : categoryColor,
                        }}
                      >
                        {isAnswered ? '✓' : index + 1}
                      </span>
                      <span className="text-sm font-medium leading-6">
                        {question.question}
                        {question.type === "multiple" && (
                          <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                            可多选
                          </span>
                        )}
                      </span>
                    </div>

                    {question.type === "single" ? (
                      <RadioGroup
                        value={(value[question.id] as string) || ""}
                        onValueChange={(v) => handleSingleSelect(question.id, v)}
                        className="ml-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
                      >
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            htmlFor={`${question.id}-${option.value}`}
                            className={`option-item ${(value[question.id] as string) === option.value ? 'option-item--selected' : ''}`}
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`${question.id}-${option.value}`}
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="ml-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {question.options.map((option) => {
                          const currentValues =
                            (value[question.id] as string[]) || [];
                          const isChecked = currentValues.includes(option.value);

                          return (
                            <label
                              key={option.value}
                              htmlFor={`${question.id}-${option.value}`}
                              className={`option-item ${isChecked ? 'option-item--selected' : ''}`}
                            >
                              <Checkbox
                                id={`${question.id}-${option.value}`}
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  handleMultiSelect(
                                    question.id,
                                    option.value,
                                    !!checked
                                  )
                                }
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
