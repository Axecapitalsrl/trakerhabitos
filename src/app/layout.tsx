import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";
import { PWARegister } from "@/components/PWARegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hábitos Tracker — Construí hábitos que se mantienen",
  description:
    "Una app simple y sin fricción para trackear tu día a día y ver tu progreso real.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Hábitos Tracker",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1613" },
  ],
};

// Evita el parpadeo de tema: aplica data-theme antes de pintar.
const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='system';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        variables: {
          colorPrimary: "#16c172",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        },
      }}
    >
      <html
        lang="es"
        data-theme="system"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="flex min-h-full flex-col">
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          {children}
          <PWARegister />
        </body>
      </html>
    </ClerkProvider>
  );
}
