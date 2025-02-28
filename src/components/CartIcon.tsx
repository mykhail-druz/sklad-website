'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { CiShoppingCart } from 'react-icons/ci'

export default function CartIcon() {
    const { cart } = useCart()
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <Link href="/cart" className="relative flex flex-row items-center">
            {/* 🛒 Иконка корзины */}
            <CiShoppingCart className="h-8 w-8 text-black" />

            {/* 🔴 Число товаров в корзине */}
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full px-2">
                    {totalItems}
                </span>
            )}
        </Link>
    )
}
