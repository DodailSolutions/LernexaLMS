import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lernexa LMS - Professional Learning Management System",
  description:
    "A complete, modern and scalable Learning Management System and course marketplace built with Next.js, TypeScript, MySQL and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
