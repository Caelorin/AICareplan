"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { CarePlan } from "@/lib/types/care-plan";
import { getCarePlanById } from "@/lib/utils/storage";
import { CARE_CATEGORIES } from "@/lib/constants/care-categories";
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_CATEGORIES,
} from "@/lib/constants/assessment-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Heart,
  Lightbulb,
  Printer,
  ShieldAlert,
  Stethoscope,
  Target,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  adl: Activity,
  cognitive: Brain,
  sensory: Eye,
  physical: Heart,
  nutrition: UtensilsCrossed,
  social: Users,
  special: Stethoscope,
};

type AssessmentDisplayItem = {
  question: string;
  answer: string;
  category: string;
};

type GroupedCareItems = {
  id: string;
  name: string;
  items: CarePlan["carePlanItems"];
};

function getBmiStatus(bmi: number) {
  if (bmi < 18.5) return "偏瘦";
  if (bmi < 24) return "正常";
  if (bmi < 28) return "超重";
  return "肥胖";
}

function formatLivingEnvironment(
  livingEnvironment: CarePlan["elderInfo"]["livingEnvironment"]
) {
  if (livingEnvironment === "alone") return "独居";
  if (livingEnvironment === "with_family") return "与家人同住";
  return "养老机构";
}

function CarePlanPrintDocument({
  plan,
  groupedItems,
  summaryFields,
  detailFields,
  assessmentGroups,
  formatDate,
}: {
  plan: CarePlan;
  groupedItems: GroupedCareItems[];
  summaryFields: Array<{ label: string; value: string; extra?: string }>;
  detailFields: Array<{ label: string; value: string }>;
  assessmentGroups: Array<{
    id: string;
    name: string;
    questions: AssessmentDisplayItem[];
  }>;
  formatDate: (dateString: string) => string;
}) {
  return (
    <article className="print-only care-plan-print">
      <header className="print-hero">
        <div>
          <p className="print-kicker">老年照护方案</p>
          <h1 className="print-title">{plan.elderInfo.name} 的个性化照护方案</h1>
          <p className="print-meta">
            生成时间：{formatDate(plan.createdAt)} · 方案编号：{plan.id}
          </p>
        </div>
        <div className="print-metrics">
          <div className="print-metric">
            <span className="print-metric-label">护理类别</span>
            <strong className="print-metric-value">{groupedItems.length}</strong>
          </div>
          <div className="print-metric">
            <span className="print-metric-label">护理措施</span>
            <strong className="print-metric-value">
              {plan.carePlanItems.length}
            </strong>
          </div>
        </div>
      </header>

      <section className="print-section avoid-break">
        <div className="print-section-heading">
          <h2 className="print-section-title">一、老人基本信息</h2>
          <p className="print-section-subtitle">
            用于快速识别对象、病情背景与照护环境。
          </p>
        </div>

        <div className="print-grid print-grid-3">
          {summaryFields.map((item) => (
            <div key={item.label} className="print-field">
              <p className="print-field-label">{item.label}</p>
              <p className="print-field-value">
                {item.value}
                {item.extra ? (
                  <span className="print-field-extra">（{item.extra}）</span>
                ) : null}
              </p>
            </div>
          ))}
        </div>

        <div className="print-grid print-grid-2">
          {detailFields.map((item) => (
            <div key={item.label} className="print-field">
              <p className="print-field-label">{item.label}</p>
              <p className="print-field-value print-field-value--multiline">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <h2 className="print-section-title">二、评估详情</h2>
          <p className="print-section-subtitle">
            评估结果按维度归档，便于课堂讲解和复盘护理决策。
          </p>
        </div>

        {assessmentGroups.map((group, groupIndex) => (
          <section key={group.id} className="print-group avoid-break">
            <div className="print-group-header">
              <h3 className="print-group-title">
                {String(groupIndex + 1).padStart(2, "0")} {group.name}
              </h3>
              <span className="print-group-badge">{group.questions.length} 项</span>
            </div>

            <div className="print-grid print-grid-2">
              {group.questions.map((item, index) => (
                <div key={`${group.id}-${index}`} className="print-field">
                  <p className="print-field-label">{item.question}</p>
                  <p className="print-field-value print-field-value--multiline">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <h2 className="print-section-title">三、照护方案</h2>
          <p className="print-section-subtitle">
            护理目标、措施、依据与注意事项已完整展开，打印时不会遗漏折叠内容。
          </p>
        </div>

        {groupedItems.map((group, groupIndex) => (
          <section key={group.id} className="print-group">
            <div className="print-group-header">
              <h3 className="print-group-title">
                {String(groupIndex + 1).padStart(2, "0")} {group.name}
              </h3>
              <span className="print-group-badge">{group.items.length} 项</span>
            </div>

            {group.items.map((item, index) => (
              <article key={`${group.id}-${index}`} className="print-plan-item avoid-break">
                <div className="print-plan-item-header">
                  <span className="print-plan-item-index">{index + 1}</span>
                  <h4 className="print-plan-item-title">{item.title}</h4>
                </div>

                <div className="print-plan-block">
                  <p className="print-plan-block-label">护理目标</p>
                  <p className="print-plan-block-text">{item.goal}</p>
                </div>

                <div className="print-plan-block">
                  <p className="print-plan-block-label">具体措施</p>
                  <ul className="print-plan-list">
                    {item.measures.map((measure, measureIndex) => (
                      <li key={measureIndex}>{measure}</li>
                    ))}
                  </ul>
                </div>

                <div className="print-plan-block">
                  <p className="print-plan-block-label">护理依据</p>
                  <p className="print-plan-block-text">{item.rationale}</p>
                </div>

                <div className="print-plan-block">
                  <p className="print-plan-block-label">注意事项</p>
                  <p className="print-plan-block-text">{item.precautions}</p>
                </div>

                <div className="print-plan-block print-plan-block--inline">
                  <p className="print-plan-block-label">评估频率</p>
                  <p className="print-plan-block-text">{item.evaluationFrequency}</p>
                </div>
              </article>
            ))}
          </section>
        ))}
      </section>

      <footer className="print-footer">
        本方案用于教学、讨论与照护计划整理。正式临床或机构执行前，请结合实际评估结果复核。
      </footer>
    </article>
  );
}

export default function CarePlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<CarePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const data = getCarePlanById(params.id as string);
      setPlan(data);
      setLoading(false);
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAssessmentDisplay = (questionId: string, answer: string | string[]) => {
    const question = ASSESSMENT_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return null;

    let answerText: string;
    if (Array.isArray(answer)) {
      const labels = answer.map((value) => {
        const option = question.options.find((item) => item.value === value);
        return option?.label || value;
      });
      answerText = labels.join("、");
    } else {
      const option = question.options.find((item) => item.value === answer);
      answerText = option?.label || answer;
    }

    return {
      question: question.question,
      answer: answerText,
      category: question.category,
    };
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">加载方案中...</span>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container py-8">
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
              <FileText className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-semibold">方案不存在</h3>
            <p className="mb-8 text-sm text-muted-foreground">
              未找到该照护方案，可能已被删除
            </p>
            <Button asChild>
              <Link href="/care-plans">返回方案列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bmi = plan.elderInfo.weight / Math.pow(plan.elderInfo.height / 100, 2);
  const genderLabel = plan.elderInfo.gender === "male" ? "男" : "女";
  const bmiStatus = getBmiStatus(bmi);
  const livingEnvironmentLabel = formatLivingEnvironment(
    plan.elderInfo.livingEnvironment
  );

  const groupedItems: GroupedCareItems[] = CARE_CATEGORIES.map((category) => ({
    ...category,
    items: plan.carePlanItems.filter((item) => item.category === category.name),
  })).filter((group) => group.items.length > 0);

  const summaryFields = [
    { label: "姓名/代号", value: plan.elderInfo.name },
    { label: "年龄", value: `${plan.elderInfo.age} 岁` },
    { label: "性别", value: genderLabel },
    { label: "身高", value: `${plan.elderInfo.height} cm` },
    { label: "体重", value: `${plan.elderInfo.weight} kg` },
    { label: "BMI", value: bmi.toFixed(1), extra: bmiStatus },
  ];

  const detailFields = [
    { label: "主要诊断", value: plan.elderInfo.diagnosis || "未填写" },
    { label: "既往病史", value: plan.elderInfo.medicalHistory || "未填写" },
    { label: "当前用药", value: plan.elderInfo.medications || "未填写" },
    { label: "过敏史", value: plan.elderInfo.allergies || "未填写" },
    { label: "主要照护者", value: plan.elderInfo.primaryCaregiver || "未指定" },
    { label: "居住环境", value: livingEnvironmentLabel },
  ];

  const assessmentGroups = ASSESSMENT_CATEGORIES.map((category) => ({
    ...category,
    questions: Object.entries(plan.assessmentResult)
      .map(([key, value]) => getAssessmentDisplay(key, value))
      .filter(
        (item): item is AssessmentDisplayItem =>
          item !== null && item.category === category.id
      ),
  })).filter((group) => group.questions.length > 0);

  return (
    <div className="container py-8 lg:py-12 print:py-4">
      <div className="screen-only">
        <div className="mb-6 flex items-center justify-between print:hidden animate-fade-in-up">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2 shadow-none">
            <Printer className="h-4 w-4" />
            打印方案
          </Button>
        </div>

        <div className="page-header animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <FileText className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-0.5 text-xs font-medium text-primary">
                  <GraduationCap className="h-3 w-3" />
                  照护方案
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight lg:text-3xl">
                {plan.elderInfo.name} 的照护方案
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(plan.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5" />
                  共 {plan.carePlanItems.length} 项护理措施
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {groupedItems.length} 个护理类别
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up animate-fade-in-up-delay-1">
          <Tabs defaultValue="plan" className="space-y-6">
            <TabsList className="print:hidden h-11">
              <TabsTrigger value="plan" className="gap-2">
                <FileText className="h-3.5 w-3.5" />
                照护方案
              </TabsTrigger>
              <TabsTrigger value="info" className="gap-2">
                <User className="h-3.5 w-3.5" />
                基本信息
              </TabsTrigger>
              <TabsTrigger value="assessment" className="gap-2">
                <ClipboardList className="h-3.5 w-3.5" />
                评估详情
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="space-y-5">
              {groupedItems.map((group, groupIndex) => (
                <Card key={group.id} className="edu-card overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/[0.03] to-transparent">
                    <CardTitle className="flex items-center gap-2.5 text-base">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <span className="font-serif text-sm font-bold text-primary">
                          {String(groupIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[15px] font-semibold">{group.name}</span>
                      <Badge variant="secondary" className="ml-auto font-serif">
                        {group.items.length} 项
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Accordion type="multiple" className="space-y-2">
                      {group.items.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`${group.id}-${index}`}
                          className="rounded-lg border bg-background px-4 data-[state=open]:bg-muted/20"
                        >
                          <AccordionTrigger className="py-3.5 hover:no-underline">
                            <span className="flex items-center gap-2.5 text-left font-medium">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                {index + 1}
                              </span>
                              {item.title}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3 pb-4">
                            <div className="knowledge-box knowledge-box--info">
                              <div
                                className="mb-1.5 flex items-center gap-2 text-sm font-semibold"
                                style={{ color: "var(--edu-info)" }}
                              >
                                <Target className="h-4 w-4" />
                                护理目标
                              </div>
                              <p className="text-sm leading-relaxed">{item.goal}</p>
                            </div>

                            <div className="knowledge-box knowledge-box--success">
                              <div
                                className="mb-2 flex items-center gap-2 text-sm font-semibold"
                                style={{ color: "var(--edu-success)" }}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                具体措施
                              </div>
                              <ul className="space-y-1.5 text-sm">
                                {item.measures.map((measure, measureIndex) => (
                                  <li
                                    key={measureIndex}
                                    className="flex items-start gap-2.5 leading-relaxed"
                                  >
                                    <span
                                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                      style={{ background: "var(--edu-success)" }}
                                    />
                                    <span>{measure}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="knowledge-box knowledge-box--tip">
                              <div
                                className="mb-1.5 flex items-center gap-2 text-sm font-semibold"
                                style={{ color: "var(--edu-tip)" }}
                              >
                                <Lightbulb className="h-4 w-4" />
                                护理依据
                                <span className="rounded bg-background/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                  教学知识点
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{item.rationale}</p>
                            </div>

                            <div className="knowledge-box knowledge-box--warn">
                              <div
                                className="mb-1.5 flex items-center gap-2 text-sm font-semibold"
                                style={{ color: "var(--edu-warn)" }}
                              >
                                <ShieldAlert className="h-4 w-4" />
                                注意事项
                              </div>
                              <p className="text-sm leading-relaxed">
                                {item.precautions}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">评估频率：</span>
                              {item.evaluationFrequency}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="info">
              <Card className="edu-card overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/[0.03] to-transparent">
                  <CardTitle className="flex items-center gap-2.5 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[15px] font-semibold">老人基本信息</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {summaryFields.map((item) => (
                      <div key={item.label} className="rounded-lg border bg-muted/20 p-3.5">
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="font-serif text-base font-semibold">
                          {item.value}
                          {item.extra && (
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              （{item.extra}）
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="grid gap-5 lg:grid-cols-2">
                    {detailFields.map((item) => (
                      <div key={item.label} className="rounded-lg border bg-muted/20 p-3.5">
                        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-5">
              {assessmentGroups.map((group) => {
                const CategoryIcon = CATEGORY_ICONS[group.id] || Activity;

                return (
                  <Card key={group.id} className="edu-card overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/[0.03] to-transparent">
                      <CardTitle className="flex items-center gap-2.5 text-base">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <CategoryIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-[15px] font-semibold">{group.name}</span>
                        <Badge variant="secondary" className="ml-auto font-serif text-xs">
                          {group.questions.length} 项
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {group.questions.map((item, index) => (
                          <div
                            key={index}
                            className="rounded-lg border bg-muted/20 p-3.5 transition-colors hover:bg-muted/30"
                          >
                            <p className="mb-1.5 text-xs font-medium leading-relaxed text-muted-foreground">
                              {item.question}
                            </p>
                            <p className="text-sm font-semibold">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CarePlanPrintDocument
        plan={plan}
        groupedItems={groupedItems}
        summaryFields={summaryFields}
        detailFields={detailFields}
        assessmentGroups={assessmentGroups}
        formatDate={formatDate}
      />
    </div>
  );
}
