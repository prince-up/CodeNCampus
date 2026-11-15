import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeNCampus — School Operating System",
  description:
    "Enterprise Multi-Tenant School Management Platform by Codazk Technologies Private Limited",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-slate-50">{children}</body>
    </html>
  );
}
