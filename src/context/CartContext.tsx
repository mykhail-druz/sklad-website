'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { CartItem } from '@/types/cart'
import { getCart } from '@/lib/cartApi'

interface CartContextProps {
    cart: CartItem[]
    setCart: (cart: CartItem[]) => void
}

const CartContext = createContext<CartContextProps | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    useEffect(() => {
        async function loadCart() {
            const cartData = await getCart()
            setCart(cartData)
        }
        loadCart()
    }, [])

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart должен использоваться внутри CartProvider')
    }
    return context
}
