import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice UI Builder",
  description: "A minimal open-source demo where voice becomes validated JSON UI and motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
