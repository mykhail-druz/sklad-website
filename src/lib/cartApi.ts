'use server'

import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { CartItem } from '@/types/cart'

// 🟢 Важно: products — массив!
interface CartItemResponse {
    quantity: number
    products: {
        id: string
        title: string
        price: number
        image_url: string
    }[]
}

export async function getCart(): Promise<CartItem[]> {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()

    if (user?.user) {
        const { data: cartItems, error } = await supabase
            .from('cart')
            .select(
                `
        quantity,
        products (
          id,
          title,
          price,
          image_url
        )
      `
            )
            .eq('user_id', user.user.id)

        if (error) {
            console.error('❌ Ошибка загрузки корзины из Supabase:', error)
            return []
        }
        if (!cartItems) return []

        return cartItems
            .filter(
                (item: CartItemResponse) =>
                    item.products && item.products.length > 0
            )
            .map((item: CartItemResponse) => {
                const product = item.products[0] // берем первый товар
                return {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: item.quantity,
                }
            })
    }

    // 🟠 Если не авторизован — берем из cookies
    const cartCookie = (await cookies()).get('cart')?.value
    return cartCookie ? JSON.parse(cartCookie) : []
}

// ✅ Функция добавления товара в корзину
// Для авторизованных пользователей работаем через Supabase,
// а для гостей — сохраняем полный объект товара в cookies.
export async function addToCart(
    productId: string,
    productData?: { title: string; price: number; image_url: string }
) {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()

    if (user?.user) {
        const { data: existingItem } = await supabase
            .from('cart')
            .select('id, quantity')
            .eq('user_id', user.user.id)
            .eq('product_id', productId)
            .single()

        if (existingItem) {
            await supabase
                .from('cart')
                .update({ quantity: existingItem.quantity + 1 })
                .eq('id', existingItem.id)
        } else {
            await supabase.from('cart').insert([
                {
                    user_id: user.user.id,
                    product_id: productId,
                    quantity: 1,
                },
            ])
        }
    } else {
        const cookieStore = await cookies()
        let localCart: CartItem[] = JSON.parse(
            cookieStore.get('cart')?.value || '[]'
        )

        const existingItem = localCart.find((item) => item.id === productId)

        if (existingItem) {
            localCart = localCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        } else {
            // Если productData передан, используем его, иначе оставляем поля пустыми
            localCart.push({
                id: productId,
                title: productData?.title || '',
                price: productData?.price || 0,
                image_url: productData?.image_url || '',
                quantity: 1,
            })
        }

        cookieStore.set({
            name: 'cart',
            value: JSON.stringify(localCart),
            path: '/',
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7, // 7 дней
        })
    }
}

// ✅ Функция обновления количества товара в корзине
export async function updateCartItem(productId: string, quantity: number) {
    if (quantity < 1) return removeCartItem(productId)

    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()

    if (user?.user) {
        await supabase
            .from('cart')
            .update({ quantity })
            .eq('user_id', user.user.id)
            .eq('product_id', productId)
    } else {
        const cookieStore = await cookies()
        let cart: CartItem[] = JSON.parse(
            cookieStore.get('cart')?.value || '[]'
        )
        cart = cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
        )
        cookieStore.set({
            name: 'cart',
            value: JSON.stringify(cart),
            path: '/',
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7,
        })
    }
}

// ✅ Функция удаления товара из корзины
export async function removeCartItem(productId: string) {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()

    if (user?.user) {
        await supabase
            .from('cart')
            .delete()
            .eq('user_id', user.user.id)
            .eq('product_id', productId)
    } else {
        const cookieStore = await cookies()
        let cart: CartItem[] = JSON.parse(
            cookieStore.get('cart')?.value || '[]'
        )
        cart = cart.filter((item) => item.id !== productId)
        cookieStore.set({
            name: 'cart',
            value: JSON.stringify(cart),
            path: '/',
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7,
        })
    }
}
