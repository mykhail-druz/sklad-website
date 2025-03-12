'use client'

import { useAppSelector } from '@/hooks/useAppSelector'
import CartItem from './CartItem'

export default function CartList() {
    const cart = useAppSelector((state) => state.cart.items)

    // Аналог getTotal из контекста, но теперь вычисляем локально
    const getTotal = () => {
        return cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }

    return (
        <div>
            {cart.length === 0 ? (
                <p className="text-gray-600">Кошик порожній</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem
                            key={item.product_id}
                            productId={item.product_id}
                            title={item.name}
                            imageUrl={item.image_url}
                            price={item.price}
                            quantity={item.quantity}
                        />
                    ))}
                    <div className="mt-6 text-right">
                        <p className="text-xl font-semibold text-gray-800">
                            Загальна сума: {getTotal().toFixed(2)} грн.
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}
