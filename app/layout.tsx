import type React from "react"
import "@/styles/globals.css"
import { Kanit } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

const kanit = Kanit({ 
  subsets: ["latin", "thai"],
  weight: "300"
})

export const metadata: Metadata = {
  title: "JinkX | Roblox Script Hub & Automation Tools",
  description:
    "JinkX is an advanced Roblox script hub offering powerful Lua executors, automation tools, and game enhancements — safe, fast, and easy to use.",
  keywords: [
    // 🔹 แบรนด์หลัก
    "JinkX",
    "JinkX Executor",
    "JinkX Roblox",
    "JinkX Script Hub",
    "JinkX Lua Executor",
    "JinkX Automation Tool",
    "JinkX Script Download",
    "JinkX Exploit",
    "JinkX Hub Roblox",
    "JinkX Platform",

    // 🔹 คำค้น Roblox ทั่วไป
    "Roblox script hub",
    "Roblox executor",
    "Roblox exploit",
    "Roblox mod tools",
    "Roblox automation",
    "Roblox Lua executor",
    "Roblox script executor",
    "Roblox script downloader",
    "Roblox enhancement tool",
    "Roblox utility tool",
    "Roblox executor free",
    "Roblox executor safe",
    "Roblox hack tool",
    "Roblox injection tool",
    "Roblox bypass executor",

    // 🔹 หมวด Lua / Developer
    "Lua executor",
    "Lua script hub",
    "Lua Roblox automation",
    "Lua Roblox exploit",
    "Roblox Lua mod",
    "Roblox Lua API",
    "Roblox Lua environment",
    "Roblox Lua scripting tool",

    // 🔹 หมวดเกม / ฟีเจอร์ยอดนิยม
    "Blox Fruits script",
    "King Legacy script",
    "Anime Adventures script",
    "Blade Ball script",
    "Pet Simulator 99 script",
    "Brookhaven script",
    "Da Hood script",
    "Doors script",
    "Combat Warriors script",
    "Tower Defense script",
    "MM2 script",
    "Arsenal script",
    "Roblox autofarm script",
    "Roblox GUI script",
    "Roblox speed hack",
    "Roblox ESP script",

    // 🔹 หมวดปลอดภัย / คุณภาพ
    "best Roblox executor 2025",
    "free Roblox script hub 2025",
    "safe Roblox executor",
    "undetected Roblox executor",
    "Roblox anti-ban tool",
    "Roblox stable script hub",
    "fast Roblox executor",
    "lightweight Roblox exploit",

    // 🔹 หมวดภาษา/ประเทศเป้าหมาย
    "Roblox executor US",
    "Roblox script hub France",
    "Roblox script MY",
    "Roblox exploit international",
    "Roblox script site global",
    "Roblox tool English",
    "Roblox script hub download free",
    "Roblox script hub mobile",
    "Roblox executor PC Android",
    "Roblox executor iOS"
  ],
  authors: [{ name: "JinkX Team" }],
  creator: "JinkX",
  openGraph: {
    title: "JinkX – Roblox Script Hub & Automation Tools",
    description:
      "Boost your Roblox experience with JinkX — advanced Lua executors and automation tools built for speed and safety.",
    url: "https://jinkx.pro/",
    siteName: "JinkX",
    images: [
      {
        url: "https://img5.pic.in.th/file/secure-sv1/LimitedEdition-Catergory.webp", // 👈 ใส่ภาพโปรโมตของเว็บ (1200x630)
        width: 1200,
        height: 630,
        alt: "JinkX Script Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JinkX | Roblox Script Hub & Executor",
    description:
      "Explore JinkX — the ultimate Roblox Lua executor and automation hub. Fast, safe, and free.",
    creator: "@JinkXOfficial", // 👈 ถ้ามี Twitter ใส่ได้เลย
    images: ["https://jinkx.pro/og-image.png"],
  },
  metadataBase: new URL("https://jinkx.pro"),
  alternates: {
    canonical: "https://jinkx.pro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Monetag */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="177335"
          async
          data-cfasync="false"
        ></script>

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "JinkX",
              url: "https://jinkx.pro",
              logo: "https://jinkx.pro/logo.png",
              sameAs: [
                "https://twitter.com/JinkXOfficial",
                "https://discord.gg/JinkX",
              ],
              description:
                "JinkX provides advanced Roblox Lua executors and automation tools for developers and gamers worldwide.",
            }),
          }}
        />
      </head>
      <body className={kanit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />

          {/* Global footer */}
          <footer className="w-full border-t border-white/10 bg-background/60 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6 flex items-center justify-center gap-2 text-sm text-white/70">
              <span>© 2025</span>
              <span>|</span>
              <a
                href="https://discord.gg/JinkX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors font-medium"
              >
                JinkX
              </a>
              <span>|</span>
              <span>All rights reserved</span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
