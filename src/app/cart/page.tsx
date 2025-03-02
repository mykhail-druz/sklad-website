'use client'

import { useCart } from '@/context/CartContext'
import CartList from '@/app/cart/CartList'

export default function CartPage() {
    const { cart } = useCart()

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">🛒 Моя корзина</h1>
            {cart.length === 0 ? (
                <p className="text-gray-600">Корзина пуста</p>
            ) : (
                <CartList />
            )}
        </div>
    )
}
