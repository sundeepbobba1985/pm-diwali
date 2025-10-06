import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Pecan Meadow Community Diwali Celebration 2025",
  description:
    "Join Pecan Meadow Community for the celebration of Diwali 2025 with traditional rituals, cultural programs, and community festivities",
  title: "5th Annual Diwali Celebration 2025 | Pecan Meadow Community",
  description:
    "Join us for the 5th Annual Diwali Celebration at Little Elm Beach Park! Experience traditional ceremonies, cultural performances, food, fireworks, and family fun. Free entry and parking. October 20-22, 2025.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
