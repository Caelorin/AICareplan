import { BookOpen, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30 print:hidden">
      {/* 底部装饰渐变线 */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
              <GraduationCap className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-semibold text-foreground">
                AI老年人照护方案生成系统
              </span>
              <span className="text-[11px] tracking-wide text-muted-foreground">
                养老专业教学平台 · 仅供教学参考
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <BookOpen className="h-3.5 w-3.5" />
            <p>
              本系统生成的照护方案仅作教学参考，实际护理请遵医嘱
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
