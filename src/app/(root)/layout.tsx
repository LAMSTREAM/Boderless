import type { Metadata } from 'next'
import React from "react";
import { Inter } from 'next/font/google'
import {ClerkProvider} from "@clerk/nextjs";

import '../globals.css'

import Topbar from "@/src/components/shared/Topbar";
import Bottombar from "@/src/components/shared/Bottombar";
import LeftSidebar from "@/src/components/shared/LeftSidebar";
import RightSidebar from "@/src/components/shared/RightSidebar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `Borderless`,
  description: `Make the world connection borderless`,
  viewport: { width: "device-width", initialScale: 1 },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en-US">
        <body className={`${inter.className}`}>
        <Topbar />

        <main className={`flex flex-row`}>
          <LeftSidebar />
          <section className={`main-container`}>
            <div className={`w-full max-w-4xl`}>
              {children}
            </div>
          </section>
          <RightSidebar />
        </main>

        <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
