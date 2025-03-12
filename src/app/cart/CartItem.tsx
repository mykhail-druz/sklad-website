'use client'

import Image from 'next/image'
import Counter from '@/components/Counter/Counter'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import {
    removeItemFromSupabase,
    updateItemQuantity,
} from '@/store/slices/cartSlice'

interface CartItemProps {
    productId: string
    title: string
    imageUrl: string
    price: number
    quantity: number
}

export default function CartItem({
    productId,
    title,
    imageUrl,
    price,
    quantity,
}: CartItemProps) {
    const dispatch = useAppDispatch()

    // Обработчики изменения количества
    const handleDecrease = () => {
        if (quantity > 1) {
            dispatch(
                updateItemQuantity({
                    product_id: productId,
                    quantity: quantity - 1,
                })
            )
        }
    }

    const handleIncrease = () => {
        dispatch(
            updateItemQuantity({
                product_id: productId,
                quantity: quantity + 1,
            })
        )
    }

    const handleRemove = () => {
        dispatch(removeItemFromSupabase(productId))
    }

    return (
        <div className="flex items-center justify-between border-b py-4">
            <div className="flex items-center space-x-4">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h3>
                    <p className="text-gray-600">Ціна: {price} грн</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDecrease}
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        -
                    </button>
                    <Counter
                        value={quantity}
                        fontSize={20}
                        padding={1}
                        places={[10, 1]}
                        gap={4}
                        textColor="black"
                        fontWeight={700}
                        counterStyle={{ backgroundColor: 'white' }}
                        gradientFrom="transparent"
                        gradientTo="transparent"
                    />
                    <button
                        onClick={handleIncrease}
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700"
                >
                    Видалити
                </button>
            </div>
        </div>
    )
}
