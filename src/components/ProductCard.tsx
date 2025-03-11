'use client'

import Image from 'next/image'
import Link from 'next/link'
import CartButton from './CartButton'
import SaveButton from '@/components/SaveButton'

interface Product {
    id: string
    title: string
    price: number
    image_url: string
    description: string
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition p-4 flex flex-col min-w-[250px] relative">
            <div className="absolute top-0 right-0">
                {' '}
                <SaveButton productId={product.id} />
            </div>

            <Link href={`/product/${product.id}`}>
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
                    {product.description}
                </p>
                <p className="text-lg font-semibold text-blue-600 mt-auto">
                    {product.price} грн
                </p>
            </Link>
            <CartButton
                productId={product.id}
                title={product.title}
                imageUrl={product.image_url}
                price={product.price}
            />
        </div>
    )
}
