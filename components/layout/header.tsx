"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, ClipboardList, Home, BookOpen } from "lucide-react";

const navigation = [
  { name: "首页", href: "/", icon: Home },
  { name: "需求评估", href: "/assessment", icon: ClipboardList },
  { name: "照护方案", href: "/care-plans", icon: FileText },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 print:hidden">
      {/* 顶部学术装饰条 - 渐变色带 */}
      <div className="h-[3px] bg-gradient-to-r from-primary via-accent/80 to-primary/60" />

      <div className="container flex h-16 items-center lg:h-[72px]">
        <div className="mr-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-[16px] font-bold tracking-wide text-foreground">
                AI老年人照护方案生成系统
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                Elderly Care Plan · Teaching Assistant
              </span>
            </div>
          </Link>
        </div>

        <nav className="ml-auto flex items-center gap-0.5">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-[13px] left-3 right-3 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
