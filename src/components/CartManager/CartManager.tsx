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
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)
    const cartItems = useSelector((state: RootState) => state.cart.items)

    // При монтировании загружаем корзину
    useEffect(() => {
        if (isLoggedIn && user) {
            console.log(
                'Загрузка корзины из Supabase для пользователя:',
                user.id
            )
            dispatch(loadCartFromSupabase())
        } else if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('cart')
            if (stored) {
                console.log('Загрузка корзины из localStorage')
                dispatch(setCartItems(JSON.parse(stored)))
            }
        }
    }, [dispatch, isLoggedIn, user])

    // Синхронизация корзины при изменении
    useEffect(() => {
        if (cartItems.length === 0) return

        if (isLoggedIn && user) {
            const timeoutId = setTimeout(() => {
                console.log('Синхронизация корзины с Supabase')
                dispatch(syncCartToSupabase())
            }, 500) // Небольшая задержка, чтобы не отправлять запросы слишком часто

            return () => clearTimeout(timeoutId)
        } else {
            console.log('Сохранение корзины в localStorage')
            localStorage.setItem('cart', JSON.stringify(cartItems))
        }
    }, [dispatch, isLoggedIn, user, cartItems])

    // При авторизации синхронизируем локальную корзину с Supabase
    useEffect(() => {
        if (isLoggedIn && user) {
            // Если пользователь только что авторизовался и у него есть локальная корзина
            const stored = localStorage.getItem('cart')
            if (stored) {
                const localCart = JSON.parse(stored)
                if (localCart.length > 0) {
                    // Устанавливаем локальную корзину и синхронизируем с Supabase
                    dispatch(setCartItems(localCart))
                    dispatch(syncCartToSupabase())
                    // Очищаем локальную корзину
                    localStorage.removeItem('cart')
                }
            }

            // В любом случае загружаем корзину с сервера
            dispatch(loadCartFromSupabase())
        }
    }, [isLoggedIn, user, dispatch])

    return null
}
