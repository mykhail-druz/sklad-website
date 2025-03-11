// components/CartManager.tsx
'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import {
    loadCartFromSupabase,
    syncCartToSupabase,
    setCartItems,
} from '@/store/slices/cartSlice'

export default function CartManager() {
    const dispatch = useDispatch<AppDispatch>()
    const { isLoggedIn } = useSelector((state: RootState) => state.auth)
    const cartItems = useSelector((state: RootState) => state.cart.items)

    useEffect(() => {
        console.log('cartItems изменились:', cartItems)
    }, [cartItems])

    // При монтировании загружаем корзину
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(loadCartFromSupabase())
            // После загрузки принудительно синхронизируем
            dispatch(syncCartToSupabase(cartItems))
        } else if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('cart')
            if (stored) {
                dispatch(setCartItems(JSON.parse(stored)))
            }
        }
    }, [dispatch, isLoggedIn])

    // Синхронизация корзины: если пользователь авторизован, отправляем изменения на сервер
    useEffect(() => {
        console.log('isLoggedIn:', isLoggedIn)
        if (isLoggedIn) {
            console.log('Синхронизация корзины...')
            dispatch(syncCartToSupabase(cartItems))
        } else {
            console.log(
                'Сохранение корзины для неавторизованного пользователя.'
            )
            localStorage.setItem('cart', JSON.stringify(cartItems))
        }
    }, [dispatch, isLoggedIn, cartItems])

    return null
}
