'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { CiHeart } from 'react-icons/ci'
import { supabase } from '@/lib/supabaseClient'

export default function FavoriteIcon() {
    const [favoriteCount, setFavoriteCount] = useState(0)

    useEffect(() => {
        const checkFavorites = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase
                    .from('wishlist_items')
                    .select('id')
                    .eq('user_id', user.id)

                if (error) {
                    console.error('Ошибка загрузки избранного:', error)
                } else {
                    setFavoriteCount(data.length) // Количество записей в favorites для текущего пользователя
                }
            }
        }

        checkFavorites()

        // Подписка на изменения в реальном времени (опционально)
        const subscription = supabase
            .channel('wishlist_items')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'favorites' },
                (payload) => {
                    if (
                        payload.eventType === 'INSERT' ||
                        payload.eventType === 'DELETE'
                    ) {
                        checkFavorites() // Обновляем количество при изменении
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    return (
        <Link href="/favorites" className="relative flex flex-row items-center">
            <CiHeart className="h-8 w-8 text-black hover:text-red-600 transition" />
            {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2">
                    {favoriteCount}
                </span>
            )}
        </Link>
    )
}
