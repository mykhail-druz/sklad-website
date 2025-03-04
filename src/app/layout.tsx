import Header from '@/components/Header'
import './globals.scss'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Providers from './providers'
import React from 'react'

export const metadata: Metadata = {
    title: 'Мій Магазин',
    description: 'Інтернет-магазин товарів',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="uk">
            <body>
                <Providers>
                    <Header />
                    <main className="w-full min-h-[70vh] mx-auto">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
