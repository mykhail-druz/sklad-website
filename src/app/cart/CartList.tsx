'use client'

import { useCart } from '@/context/CartContext'
import CartItem from './CartItem'

export default function CartList() {
    const { cart, getTotal } = useCart()

    return (
        <div>
            {cart.length === 0 ? (
                <p className="text-gray-600">Корзина пуста</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem
                            key={item.id}
                            id={item.id}
                            productId={item.product_id}
                            title={item.title}
                            imageUrl={item.image_url}
                            price={item.price}
                            quantity={item.quantity}
                        />
                    ))}
                    <div className="mt-6 text-right">
                        <p className="text-xl font-semibold text-gray-800">
                            Общая сумма: {getTotal().toFixed(2)} $
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}
