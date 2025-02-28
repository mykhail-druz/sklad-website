'use client'

import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { addToCart } from '@/lib/cartApi'

interface ProductProps {
    id: string
    title: string
    price: number
    image_url: string
    description: string
}

export default function ProductCard({ product }: { product: ProductProps }) {
    const { setCart } = useCart()

    async function handleAddToCart() {
        // Для неавторизованных пользователей передаем productData,
        // чтобы сохранялись все данные о товаре в cookies
        await addToCart(product.id, {
            title: product.title,
            price: product.price,
            image_url: product.image_url,
        })

        // Обновляем корзину через API
        const response = await fetch('/api/cart')
        const updatedCart = await response.json()
        setCart(updatedCart)
    }

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform p-4 flex flex-col min-w-[250px]">
            <Image
                src={product.image_url}
                alt={product.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-lg font-semibold mt-2 line-clamp-2">
                {product.title}
            </h2>
            <p className="text-gray-600 text-sm line-clamp-2">
                {product.description.replace(/<br\s*\/?>/g, ' ')}
            </p>
            <p className="text-lg font-semibold text-blue-600 mt-auto">
                {product.price} $
            </p>

            <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700 transition"
                onClick={handleAddToCart}
            >
                Добавить в корзину
            </button>
        </div>
    )
}
