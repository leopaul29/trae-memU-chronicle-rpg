import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Chronicle",
  description: "Dark parchment UI"
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment-900 bg-parchment text-neutral-200 antialiased">
        {children}
      </body>
    </html>
  )
}
