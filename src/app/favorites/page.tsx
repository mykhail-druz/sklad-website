'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'
import { FavoriteProductId } from '@/types/favorite'

export default function Favorites() {
    const [favorites, setFavorites] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        let isMounted = true

        const checkAuthAndFetchFavorites = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
                if (isMounted) router.push('/auth')
                return
            }

            try {
                const { data, error } = await supabase
                    .from('wishlist_items')
                    .select('product_id')
                    .eq('user_id', user.id)

                if (error) {
                    console.error('Ошибка загрузки избранного:', error.message)
                    if (isMounted) setLoading(false)
                    return
                }

                const productIds = data.map(
                    (item: FavoriteProductId) => item.product_id
                )
                const { data: products, error: productsError } = await supabase
                    .from('products')
                    .select('id, name, price, image_url, description') // Явно указываем поля
                // .in('id', productIds); // Уберите, если не фильтруете

                if (productsError) {
                    console.error(
                        'Ошибка загрузки продуктов:',
                        productsError.message
                    )
                } else if (isMounted) {
                    // Фильтруем только те продукты, которые есть в favorites
                    const filteredProducts = products.filter((product) =>
                        productIds.includes(product.id)
                    )
                    setFavorites(filteredProducts as Product[])
                }
            } catch (err) {
                console.error('Неожиданная ошибка:', err)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        checkAuthAndFetchFavorites()

        return () => {
            isMounted = false
        }
    }, [router])

    if (loading)
        return <p className="text-center text-gray-600">Завантаження...</p>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Обране</h1>
            {favorites.length === 0 ? (
                <p className="text-gray-600">Немає збережених товарів</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                        <div key={product.id} className="relative">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
