import { IBM_Plex_Mono } from "next/font/google"
import Script from "next/script"
import { JSX } from "react"

export const metadata = {
    title: "LP Craft",
    description: "A linear program crafting XP optimizer",
}

// Use IBM Plex Mono for the whole page
const font = IBM_Plex_Mono({
    weight: "400",
    subsets: ["latin"],
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode,
}): JSX.Element {
    return (
        <html lang="en">
            <body className={font.className}>
                <Script src="/highs.js" strategy="beforeInteractive"></Script>
                {children}
            </body>
        </html>
    )
}