'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setCredentials } from '@/store/slices/authSlice'
import { loadCartFromSupabase } from '@/store/slices/cartSlice'
import { Spinner } from '@heroui/spinner'
import { UserData } from '@/types/user' // Импортируем наш кастомный тип

export default function AuthCallbackPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Используем UserData для типизации userData
        const saveUserProfile = async (
            userId: string,
            userData: UserData & { email?: string }
        ) => {
            try {
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()

                if (existingProfile) {
                    await supabase
                        .from('profiles')
                        .update({
                            full_name:
                                userData.full_name || existingProfile.full_name,
                            avatar_url:
                                userData.avatar_url ||
                                existingProfile.avatar_url,
                            email: userData.email || existingProfile.email,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', userId)
                } else {
                    await supabase.from('profiles').insert({
                        id: userId,
                        full_name: userData.full_name || null,
                        avatar_url: userData.avatar_url || null,
                        email: userData.email || null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                }
            } catch (err) {
                console.error('Ошибка при сохранении профиля:', err)
            }
        }

        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (error) {
                console.error('Ошибка получения сессии:', error.message)
                router.push('/auth')
                return
            }

            if (data.session && data.session.user) {
                // Приводим данные из Supabase к нашему типу
                const userData: UserData & { email?: string } = {
                    full_name:
                        data.session.user.user_metadata?.full_name || null,
                    avatar_url:
                        data.session.user.user_metadata?.avatar_url || null,
                    email: data.session.user.email || undefined,
                }

                await saveUserProfile(data.session.user.id, userData)

                dispatch(
                    setCredentials({
                        user: {
                            id: data.session.user.id,
                            email: data.session.user.email || '',
                        },
                        token: data.session.access_token,
                    })
                )

                try {
                    await dispatch(loadCartFromSupabase())
                } catch (e) {
                    console.error('Ошибка при загрузке корзины:', e)
                }

                router.push('/')
            }
        }

        getSession()
    }, [dispatch, router])

    return (
        <section className="w-full h-[90vh] flex items-center justify-center">
            <Spinner />
        </section>
    )
}
