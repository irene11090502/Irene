import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Growth Dashboard · 个人成长工作台",
  description:
    "Notion 极简风的个人成长工作台 —— 周计划、待办、学习、阅读、工作、情绪、日记、例假与体重记录、成长统计，数据本地保存。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
