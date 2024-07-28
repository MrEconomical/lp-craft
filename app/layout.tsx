export const metadata = {
    title: "LP Craft",
    description: "A linear program crafting XP optimizer",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}