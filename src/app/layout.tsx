import Header from '@/components/Header'
import './globals.scss'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'

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
                <CartProvider>
                    <Header />
                    <main className="w-full mx-auto p-4">{children}</main>
                    <Footer />
                </CartProvider>
            </body>
        </html>
    )
}
