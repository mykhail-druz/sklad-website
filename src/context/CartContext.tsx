// app/context/CartContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'
import { supabase } from '@/lib/supabaseClient'

interface CartItem {
    id: string
    product_id: string
    title: string
    image_url: string
    price: number
    quantity: number
    total: number
}

interface CartContextProps {
    cart: CartItem[]
    addToCart: (item: Omit<CartItem, 'id' | 'total'>) => void
    updateQuantity: (productId: string, quantity: number) => void
    removeItem: (productId: string) => void
    clearCart: () => void
    syncCartWithSupabase: (userId: string) => Promise<void>
    getTotal: () => number
}

const CartContext = createContext<CartContextProps | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])

    // Загрузка корзины из куки
    useEffect(() => {
        const cookieCart = getCookie('cart')
        if (cookieCart) {
            setCart(JSON.parse(cookieCart as string))
        }
    }, [])

    // Сохранение в куки
    const saveToCookies = (cartData: CartItem[]) => {
        setCookie('cart', JSON.stringify(cartData), {
            maxAge: 30 * 24 * 60 * 60,
        })
        setCart(cartData)
    }

    // Добавление товара
    const addToCart = (item: Omit<CartItem, 'id' | 'total'>) => {
        const existingItem = cart.find((i) => i.product_id === item.product_id)
        if (existingItem) {
            updateQuantity(
                item.product_id,
                existingItem.quantity + item.quantity
            )
        } else {
            const newItem = {
                ...item,
                id: crypto.randomUUID(),
                total: item.price * item.quantity,
            }
            saveToCookies([...cart, newItem])
        }
    }

    // Обновление количества
    const updateQuantity = (productId: string, quantity: number) => {
        const updatedCart = cart.map((item) =>
            item.product_id === productId
                ? {
                      ...item,
                      quantity: Math.max(1, quantity),
                      total: Math.max(1, quantity) * item.price,
                  }
                : item
        )
        saveToCookies(updatedCart)
    }

    // Удаление товара
    const removeItem = (productId: string) => {
        const updatedCart = cart.filter((item) => item.product_id !== productId)
        saveToCookies(updatedCart)
    }

    // Очистка корзины
    const clearCart = () => {
        deleteCookie('cart')
        setCart([])
    }

    // Синхронизация с Supabase
    const syncCartWithSupabase = async (userId: string) => {
        if (!userId) return

        await supabase.from('cart_items').delete().eq('user_id', userId)
        const itemsToSync = cart.map((item) => ({
            user_id: userId,
            product_id: item.product_id,
            title: item.title,
            image_url: item.image_url,
            price: item.price,
            quantity: item.quantity,
            created_at: new Date().toISOString(),
        }))
        await supabase.from('cart_items').insert(itemsToSync)

        deleteCookie('cart')
        setCart([])
    }

    // Общая сумма
    const getTotal = () => cart.reduce((sum, item) => sum + item.total, 0)

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                syncCartWithSupabase,
                getTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
}
