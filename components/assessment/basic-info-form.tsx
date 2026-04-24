"use client";

import type { ElderInfo } from "@/lib/types/care-plan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Heart, Pill, Home } from "lucide-react";

interface BasicInfoFormProps {
  value: Partial<ElderInfo>;
  onChange: (value: Partial<ElderInfo>) => void;
}

export function BasicInfoForm({ value, onChange }: BasicInfoFormProps) {
  const updateField = <K extends keyof ElderInfo>(
    field: K,
    fieldValue: ElderInfo[K]
  ) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-5">
      {/* 基本身份信息 */}
      <Card className="edu-card overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/[0.03] to-transparent">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-[15px] font-semibold">基本身份信息</span>
              <span className="ml-2 text-xs font-normal text-muted-foreground">必填</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">姓名/代号</Label>
            <Input
              id="name"
              placeholder="如：张奶奶"
              value={value.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              className="transition-all focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-xs font-medium text-muted-foreground">年龄（岁）</Label>
            <Input
              id="age"
              type="number"
              placeholder="如：78"
              value={value.age || ""}
              onChange={(e) => updateField("age", parseInt(e.target.value) || 0)}
              className="transition-all focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">性别</Label>
            <RadioGroup
              value={value.gender}
              onValueChange={(v) =>
                updateField("gender", v as "male" | "female")
              }
              className="flex gap-3 pt-1"
            >
              <label
                htmlFor="male"
                className="option-item flex-1 justify-center py-2"
                data-selected={value.gender === "male" || undefined}
              >
                <RadioGroupItem value="male" id="male" />
                <span className="text-sm">男</span>
              </label>
              <label
                htmlFor="female"
                className="option-item flex-1 justify-center py-2"
                data-selected={value.gender === "female" || undefined}
              >
                <RadioGroupItem value="female" id="female" />
                <span className="text-sm">女</span>
              </label>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="height" className="text-xs font-medium text-muted-foreground">身高（cm）</Label>
              <Input
                id="height"
                type="number"
                placeholder="160"
                value={value.height || ""}
                onChange={(e) =>
                  updateField("height", parseInt(e.target.value) || 0)
                }
                className="transition-all focus:shadow-sm focus:shadow-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight" className="text-xs font-medium text-muted-foreground">体重（kg）</Label>
              <Input
                id="weight"
                type="number"
                placeholder="55"
                value={value.weight || ""}
                onChange={(e) =>
                  updateField("weight", parseInt(e.target.value) || 0)
                }
                className="transition-all focus:shadow-sm focus:shadow-primary/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 健康状况 */}
      <Card className="edu-card overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-destructive/[0.03] to-transparent">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <Heart className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-[15px] font-semibold">健康状况</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="diagnosis" className="text-xs font-medium text-muted-foreground">主要诊断/当前疾病</Label>
            <Textarea
              id="diagnosis"
              placeholder="如：高血压、2型糖尿病、轻度认知障碍"
              value={value.diagnosis || ""}
              onChange={(e) => updateField("diagnosis", e.target.value)}
              rows={3}
              className="resize-none transition-all focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="medicalHistory" className="text-xs font-medium text-muted-foreground">既往病史</Label>
            <Textarea
              id="medicalHistory"
              placeholder="如：2018年脑梗塞、2020年髋关节置换术"
              value={value.medicalHistory || ""}
              onChange={(e) => updateField("medicalHistory", e.target.value)}
              rows={3}
              className="resize-none transition-all focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 用药与过敏 */}
      <Card className="edu-card overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-accent/[0.06] to-transparent">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
              <Pill className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-[15px] font-semibold">用药与过敏信息</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="medications" className="text-xs font-medium text-muted-foreground">当前服用药物</Label>
            <Textarea
              id="medications"
              placeholder="如：阿司匹林100mg每日一次、二甲双胍500mg每日两次"
              value={value.medications || ""}
              onChange={(e) => updateField("medications", e.target.value)}
              rows={3}
              className="resize-none transition-all focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="allergies" className="text-xs font-medium text-muted-foreground">过敏史</Label>
            <Textarea
              id="allergies"
              placeholder="如：青霉素过敏、海鲜过敏"
              value={value.allergies || ""}
              onChange={(e) => updateField("allergies", e.target.value)}
              rows={3}
              className="resize-none transition-all focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 照护环境 */}
      <Card className="edu-card overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-[var(--edu-success)]/[0.04] to-transparent">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--edu-success-bg)' }}>
              <Home className="h-4 w-4" style={{ color: 'var(--edu-success)' }} />
            </div>
            <span className="text-[15px] font-semibold">照护环境</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="primaryCaregiver" className="text-xs font-medium text-muted-foreground">主要照护者</Label>
            <Input
              id="primaryCaregiver"
              placeholder="如：女儿、专职护工"
              value={value.primaryCaregiver || ""}
              onChange={(e) => updateField("primaryCaregiver", e.target.value)}
              className="transition-all focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">居住环境</Label>
            <RadioGroup
              value={value.livingEnvironment}
              onValueChange={(v) =>
                updateField(
                  "livingEnvironment",
                  v as "alone" | "with_family" | "institution"
                )
              }
              className="flex flex-wrap gap-3 pt-1"
            >
              <label htmlFor="alone" className="option-item">
                <RadioGroupItem value="alone" id="alone" />
                <span className="text-sm">独居</span>
              </label>
              <label htmlFor="with_family" className="option-item">
                <RadioGroupItem value="with_family" id="with_family" />
                <span className="text-sm">与家人同住</span>
              </label>
              <label htmlFor="institution" className="option-item">
                <RadioGroupItem value="institution" id="institution" />
                <span className="text-sm">养老机构</span>
              </label>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
