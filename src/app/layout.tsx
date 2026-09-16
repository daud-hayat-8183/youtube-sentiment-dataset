import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CommentLens — Turn YouTube Conversations into Data",
  description: "Generate clean, machine-learning-ready datasets from public YouTube comments, replies, engagement and video data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans selection:bg-blue-200 selection:text-blue-900">
        <div className="bg-orb orb-blue" />
        <div className="bg-orb orb-violet" />
        <div className="bg-orb orb-mint" />
        <div className="bg-orb orb-peach" />
        
        {children}
      </body>
    </html>
  );
}
