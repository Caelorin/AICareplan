"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CarePlan } from "@/lib/types/care-plan";
import { getCarePlans, deleteCarePlan } from "@/lib/utils/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Eye,
  Trash2,
  Calendar,
  User,
  ClipboardList,
  GraduationCap,
  FolderOpen,
  BookOpen,
} from "lucide-react";

export default function CarePlansPage() {
  const [plans, setPlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const data = getCarePlans();
    setPlans(data);
    setLoading(false);
  }, []);

  const handleDelete = () => {
    if (deleteId) {
      deleteCarePlan(deleteId);
      setPlans((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">加载中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      {/* 页面标题 */}
      <div className="page-header animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                <FolderOpen className="h-3.5 w-3.5" />
                Module 02 · 方案管理
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight lg:text-4xl">
              照护方案列表
            </h1>
            <p className="mt-3 text-[15px] text-muted-foreground">
              查看和管理已生成的老年人照护方案
            </p>
          </div>
          <Button asChild size="lg" className="shadow-md shadow-primary/15">
            <Link href="/assessment">
              <Plus className="mr-2 h-4 w-4" />
              新建评估
            </Link>
          </Button>
        </div>
      </div>

      <div className="animate-fade-in-up animate-fade-in-up-delay-1">
        {plans.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/8 to-accent/8">
                <BookOpen className="h-10 w-10 text-primary/50" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">暂无照护方案</h3>
              <p className="mb-8 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                还没有生成任何照护方案，通过需求评估为老人创建第一份个性化照护计划吧
              </p>
              <Button asChild size="lg">
                <Link href="/assessment">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  开始需求评估
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="edu-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/[0.03] to-transparent">
              <CardTitle className="flex items-center gap-2.5 text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <span className="text-[15px] font-semibold">照护方案记录</span>
                <Badge variant="secondary" className="ml-auto font-serif">
                  共 {plans.length} 条
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[150px] pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">老人姓名</TableHead>
                    <TableHead className="w-[80px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">年龄</TableHead>
                    <TableHead className="w-[80px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">性别</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">主要诊断</TableHead>
                    <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">护理项目</TableHead>
                    <TableHead className="w-[180px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">创建时间</TableHead>
                    <TableHead className="w-[140px] text-right pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan, index) => (
                    <TableRow
                      key={plan.id}
                      className="group transition-colors hover:bg-primary/[0.02]"
                    >
                      <TableCell className="pl-6 font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/8 text-xs font-bold text-primary">
                            {plan.elderInfo.name.charAt(0)}
                          </div>
                          {plan.elderInfo.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{plan.elderInfo.age} 岁</TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.elderInfo.gender === "male" ? "男" : "女"}
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-1 text-sm">
                          {plan.elderInfo.diagnosis || (
                            <span className="text-muted-foreground/50">未填写</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-serif font-medium">
                          {plan.carePlanItems.length} 项
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(plan.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="outline" size="sm" asChild className="shadow-none">
                            <Link href={`/care-plans/${plan.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              查看
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive/60 hover:text-destructive hover:bg-destructive/8"
                            onClick={() => setDeleteId(plan.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              确认删除照护方案？
            </AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销，删除后数据将无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
