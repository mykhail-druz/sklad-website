'use client'

import { useCart } from '@/context/CartContext'
import { addToCart, getCart } from '@/lib/cartApi'

export default function CartButton({ productId }: { productId: string }) {
    const { setCart } = useCart()

    async function handleAdd() {
        await addToCart(productId)
        setCart(await getCart())
    }

    return (
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={handleAdd}
        >
            Добавить в корзину
        </button>
    )
}
