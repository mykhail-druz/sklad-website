'use client'
import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setCredentials } from '@/store/slices/authSlice'
import { supabase } from '@/lib/supabaseClient'
import { loadCartFromSupabase } from '@/store/slices/cartSlice'

export default function AuthListener() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Подписка на изменение сессии
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    // Если произошёл вход в аккаунт, сохраняем токен и данные пользователя
                    dispatch(
                        setCredentials({
                            user: {
                                id: session.user.id || '', // Используем пустую строку, если id не определен
                                email: session.user.email || '', // Аналогично для email
                            },
                            token: session.access_token || '', // Аналогично для токена
                        })
                    )

                    // Загружаем корзину для авторизованного пользователя
                    await dispatch(loadCartFromSupabase())
                }

                if (event === 'SIGNED_OUT') {
                    // Сброс состояния при выходе пользователя
                    dispatch(
                        setCredentials({
                            user: { id: '', email: '' },
                            token: '',
                        })
                    )
                }
            }
        )

        // Отписываемся при размонтировании компонента
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [dispatch])

    return null
}
