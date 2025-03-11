'use client'

import Link from 'next/link'
import { CiShoppingCart } from 'react-icons/ci'
import { useAppSelector } from '@/hooks/useAppSelector'

export default function CartIcon() {
    // Получаем товары из Redux
    const cart = useAppSelector((state) => state.cart.items)
    // Считаем общее количество
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <Link href="/cart" className="relative flex flex-row items-center">
            <CiShoppingCart className="h-8 w-8 text-black hover:text-blue-600 transition" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full px-2">
                    {totalItems}
                </span>
            )}
        </Link>
    )
}
