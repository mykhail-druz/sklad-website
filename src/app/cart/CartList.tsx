import CartItem from './CartItem'
import { CartItem as CartItemType } from '@/types/cart'

export default function CartList({ cartItems }: { cartItems: CartItemType[] }) {
    return (
        <div>
            {cartItems.length > 0 ? (
                cartItems.map((item) => <CartItem key={item.id} item={item} />)
            ) : (
                <p className="text-center text-gray-500">Корзина пуста</p>
            )}
        </div>
    )
}
