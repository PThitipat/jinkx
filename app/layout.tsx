import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JinkX | Roblox Script Hub & Automation Tools",
  description:
    "JinkX is an advanced Roblox script hub offering powerful Lua executors, automation tools, and game enhancements — safe, fast, and easy to use.",
  keywords: [
    "JinkX",
    "Roblox script hub",
    "Roblox executor",
    "Roblox cheats",
    "Lua executor",
    "Roblox automation",
    "JinkX script",
    "Roblox mod tools",
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
