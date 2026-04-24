import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  FileText,
  Brain,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "多维度评估",
    description:
      "涵盖日常生活活动能力、认知精神状态、身体健康指标等 35 项专业评估项目，全方位了解老人需求。",
  },
  {
    icon: Brain,
    title: "AI智能分析",
    description:
      "基于豆包AI大模型，结合评估结果智能生成个性化照护方案，提供专业的护理决策依据。",
  },
  {
    icon: FileText,
    title: "标准化照护项目",
    description:
      "参考国际顶尖养老机构护理标准，涵盖日常生活、医疗护理、心理支持、安全管理等六大类。",
  },
  {
    icon: GraduationCap,
    title: "教学导向设计",
    description:
      "每项护理建议都包含护理依据和注意事项，帮助学生理解护理决策的专业逻辑。",
  },
];

const workflow = [
  {
    step: "I",
    title: "填写基本信息",
    description: "输入老人的基本身份信息、健康状况、用药情况等关键信息。",
  },
  {
    step: "II",
    title: "完成健康评估",
    description: "通过 35 项多维度评估问卷，全面了解老人的身体和心理状态。",
  },
  {
    step: "III",
    title: "AI生成方案",
    description: "AI 分析评估结果，自动生成针对性的个性化照护方案。",
  },
  {
    step: "IV",
    title: "学习与对比",
    description: "查看详细的护理措施和依据，与自己的判断进行对比学习。",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - 学术期刊封面风格 */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 to-background">
        <div className="paper-texture absolute inset-0 opacity-40" />
        <div className="container relative py-20 lg:py-28">
          <div className="mx-auto max-w-4xl">
            {/* 顶部标识 */}
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-accent" />
              <span className="section-label !m-0 before:hidden">
                护理教学 · Teaching Aid
              </span>
              <div className="h-px w-12 bg-accent" />
            </div>

            {/* 主标题 */}
            <h1 className="mb-6 text-center font-serif text-4xl font-bold tracking-tight text-balance lg:text-5xl">
              AI 老年人照护方案生成系统
            </h1>

            {/* 英文副标题 */}
            <p className="mb-8 text-center font-serif text-lg italic text-muted-foreground text-balance">
              An Intelligent Teaching Assistant for Geriatric Care Planning
            </p>

            {/* 装饰分隔 */}
            <div className="mx-auto mb-8 flex max-w-sm items-center justify-center">
              <div className="h-px flex-1 bg-border" />
              <span className="mx-3 font-serif text-accent">§</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* 摘要描述 */}
            <p className="mx-auto mb-10 max-w-2xl text-center leading-relaxed text-muted-foreground text-balance">
              面向护理专业学生的智能辅助学习平台，通过 AI
              生成的个性化照护方案进行自主学习，理解跨学科护理计划的制定逻辑，培养专业护理思维。
            </p>

            {/* 行动按钮 */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-48">
                <Link href="/assessment">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  开始需求评估
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-48">
                <Link href="/care-plans">
                  <FileText className="mr-2 h-5 w-5" />
                  查看照护方案
                </Link>
              </Button>
            </div>

            {/* 统计信息 */}
            <div className="mt-16 grid grid-cols-3 gap-4 border-t border-border pt-8">
              <div className="text-center">
                <div className="font-serif text-3xl font-bold text-primary">35+</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  评估项目
                </div>
              </div>
              <div className="text-center">
                <div className="font-serif text-3xl font-bold text-primary">6</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  护理类别
                </div>
              </div>
              <div className="text-center">
                <div className="font-serif text-3xl font-bold text-primary">AI</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  智能驱动
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-14 text-center">
            <div className="section-label mb-3 justify-center">
              Chapter I · 第一章
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-balance">
              系统功能特点
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              基于专业护理学知识和 AI 技术，为护理教学提供科学、系统的辅助工具
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-primary/50 opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/8 ring-1 ring-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-serif text-sm font-medium text-accent">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="border-y border-border bg-muted/40 py-20">
        <div className="container">
          <div className="mb-14 text-center">
            <div className="section-label mb-3 justify-center">
              Chapter II · 第二章
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-balance">
              使用流程
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              简单四步，快速生成专业的个性化照护方案
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map((item, index) => (
                <div
                  key={item.step}
                  className="relative flex flex-col rounded-md border border-border bg-card p-6"
                >
                  {index < workflow.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-border lg:block" />
                  )}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary font-serif text-base font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="mb-2 font-serif text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-14 text-center">
            <div className="section-label mb-3 justify-center">
              Chapter III · 第三章
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-balance">
              教学价值与应用场景
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                本系统专为护理专业教学设计，通过 AI
                辅助学习的方式，帮助学生更好地理解和掌握老年护理知识，同时减轻教师的教学负担。
              </p>

              <div className="space-y-4">
                {[
                  "学生可自主进行评估练习，与 AI 方案对比学习",
                  "理解护理决策的专业依据和逻辑推理过程",
                  "减少教师重复性评改工作，聚焦个性化指导",
                  "标准化的评估流程，培养系统性护理思维",
                ].map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-4 border-l-2 border-accent/40 bg-muted/30 py-3 pl-4"
                  >
                    <span className="font-serif text-sm font-medium text-accent shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="relative overflow-hidden border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <CardContent className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Target Users
                    </div>
                    <h3 className="font-serif text-xl font-semibold">适用人群</h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "护理专业在校学生",
                    "老年护理方向学习者",
                    "护理专业教师",
                    "养老护理从业人员",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-accent" />
              <BookOpen className="h-5 w-5 text-accent" />
              <div className="h-px w-10 bg-accent" />
            </div>
            <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-balance">
              开始您的第一次评估
            </h2>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              体验 AI 辅助照护方案生成，提升护理专业能力
            </p>
            <Button asChild size="lg">
              <Link href="/assessment">
                立即开始
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
