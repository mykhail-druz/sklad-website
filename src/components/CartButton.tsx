'use client'

import { useCart } from '@/context/CartContext'

interface CartButtonProps {
    productId: string
    title: string
    imageUrl: string
    price: number
}

export default function CartButton({
    productId,
    title,
    imageUrl,
    price,
}: CartButtonProps) {
    const { addToCart } = useCart()

    const handleAdd = () => {
        addToCart({
            product_id: productId,
            title,
            image_url: imageUrl,
            price,
            quantity: 1,
        })
    }

    return (
        <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 mt-2 w-full"
        >
            Добавить в корзину
        </button>
    )
}
