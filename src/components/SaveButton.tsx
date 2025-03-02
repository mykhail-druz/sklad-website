'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaHeart, FaRegHeart } from 'react-icons/fa' // Импортируем обе иконки
import { supabase } from '@/lib/supabaseClient'

interface SaveButtonProps {
    productId: string
}

export default function SaveButton({ productId }: SaveButtonProps) {
    const [isSaved, setIsSaved] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkIfSaved = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('product_id', productId)
                    .single()
                setIsSaved(!!data)
            }
        }
        checkIfSaved()
    }, [productId])

    const handleSaveToggle = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
            router.push('/auth')
            return
        }

        if (isSaved) {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId)
            if (error) console.error('Ошибка удаления из избранного:', error)
            setIsSaved(false)
        } else {
            const { error } = await supabase
                .from('favorites')
                .insert({ user_id: user.id, product_id: productId })
            if (error) console.error('Ошибка добавления в избранное:', error)
            setIsSaved(true)
        }
    }

    return (
        <button
            onClick={handleSaveToggle}
            className="flex items-center justify-center bg-white h-9 w-9 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        >
            {isSaved ? (
                <FaHeart className="h-5 w-5 text-red-500" /> // Заполненная красная иконка
            ) : (
                <FaRegHeart className="h-5 w-5 text-black" /> // Контурная черная иконка
            )}
        </button>
    )
}
