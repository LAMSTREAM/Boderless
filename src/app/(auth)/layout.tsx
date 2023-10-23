import type {Metadata} from "next";
import React from "react";
import {ClerkProvider} from "@clerk/nextjs";
import {Inter} from "next/font/google";

import "../globals.css"

const inter = Inter({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: `Borderless`,
  description: `Make the world connection borderless`,
  viewport: { width: "device-width", initialScale: 1 },
}

export default function authRootLayout({
  children
}: {
  children: React.ReactNode
}){
  return (
    <ClerkProvider>
      <html lang="en-US">
        <body className={`${inter.className} bg-amber-100`}>
          <div className={`w-full flex justify-center items-center min-h-screen`}>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
