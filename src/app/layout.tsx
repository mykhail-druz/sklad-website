import Header from '@/components/Header'
import './globals.scss'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import React from 'react'
import Providers from '@/app/Providers'
import CartManager from '@/components/CartManager/CartManager'
import AuthListener from '@/components/AuthListener/AuthListener'

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
                    <AuthListener />
                    <CartManager />
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
