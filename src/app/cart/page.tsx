'use client'

import { useAppSelector } from '@/hooks/useAppSelector'
import CartList from '@/app/cart/CartList'
import React from 'react'

export default function CartPage() {
    // Получаем список товаров в корзине из Redux
    const cartItems = useAppSelector((state) => state.cart.items)

    return (
        <main className="max-w-[1440px] mx-auto py-4">
            <h1 className="text-3xl font-bold mb-6">🛒 Мій кошик</h1>
            {cartItems.length === 0 ? (
                <p className="text-gray-600">Кошик порожній</p>
            ) : (
                <CartList />
            )}
        </main>
    )
}
