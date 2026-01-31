import React from "react"
import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "@/components/ui/sonner"
import './globals.css'

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'AI Counsellor - Your Study Abroad Guide',
  description: 'Get personalized university recommendations, application guidance, and AI-powered counselling for your study abroad journey. Discover your perfect university with AI Counsellor.',
  generator: 'v0.app',
  keywords: ['study abroad', 'university', 'AI counsellor', 'applications', 'guidance'],
  openGraph: {
    title: 'AI Counsellor - Your Study Abroad Guide',
    description: 'Get personalized university recommendations and AI-powered counselling',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/logo.png',
      }
    ],
    apple: '/logo.png',
  },
}

import CopilotKitWrapper from "@/components/CopilotKitWrapper"

import AuthGuard from "@/components/AuthGuard"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <CopilotKitWrapper>
            <AuthGuard>
              {children}
            </AuthGuard>
          </CopilotKitWrapper>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
