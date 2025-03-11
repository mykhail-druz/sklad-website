// components/CartButton.tsx
'use client'

import React from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { addItem } from '@/store/slices/cartSlice'

interface CartButtonProps {
    productId: string
    title: string
    imageUrl: string
    quantity?: number
    price: number
}

export default function CartButton({
    productId,
    title,
    imageUrl,
    quantity = 1,
    price,
}: CartButtonProps) {
    const dispatch = useAppDispatch()

    const handleAdd = () => {
        // Обновляем локальное состояние корзины
        dispatch(
            addItem({
                product_id: productId,
                title,
                image_url: imageUrl,
                quantity,
                price,
            })
        )
        // Если пользователь авторизован, CartManager выполнит синхронизацию автоматически через debounce.
    }

    return (
        <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
            Добавить в корзину
        </button>
    )
}
