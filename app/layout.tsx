import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "AI老年人照护方案生成系统",
  description:
    "面向护理专业学生的AI辅助教学系统，通过智能生成个性化照护方案，帮助学生理解跨学科护理计划的制定逻辑，实现自主学习与能力提升。",
  generator: "kimi",
  keywords: ["老年护理", "照护方案", "AI辅助教学", "护理教育", "养老照护"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSans.variable} ${notoSerif.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
