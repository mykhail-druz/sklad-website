'use client'

import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { CartItem as CartItemType } from '@/types/cart'

export default function CartItem({ item }: { item: CartItemType }) {
    const { setCart } = useCart()

    async function handleRemove() {
        await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.id }),
        })

        const response = await fetch('/api/cart')
        const updatedCart = await response.json()
        setCart(updatedCart)
    }

    return (
        <div className="flex items-center gap-4 border-b py-4">
            <Image
                src={item.image_url}
                alt={item.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
            />
            <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600">${item.price}</p>
                <p className="text-sm">Количество: {item.quantity}</p>
            </div>
            <button
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700"
            >
                ❌
            </button>
        </div>
    )
}
