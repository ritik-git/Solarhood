import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Solarhood – Your Roof, Your Choice, Our Expertise",
  description:
    "Compare top-tier solar brands like Waaree, Adani, and Tata. We handle the selection, financing, and certified installation—so you just enjoy the savings.",
  keywords: "solar panels, solar installation, Waaree, Adani Solar, Tata Power Solar, solar marketplace India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
