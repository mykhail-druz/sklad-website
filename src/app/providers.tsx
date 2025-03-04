import { HeroUIProvider } from '@heroui/react'
import React from 'react'
import { CartProvider } from '@/context/CartContext'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <CartProvider>{children}</CartProvider>
        </HeroUIProvider>
    )
}
