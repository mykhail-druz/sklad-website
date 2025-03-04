'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CartIcon from '@/components/CartIcon'
import { CiLogin, CiLogout } from 'react-icons/ci'
import { supabase } from '@/lib/supabaseClient'
import FavoriteIcon from '@/components/FavoriteIcon'
import { Tooltip } from '@heroui/tooltip'

export default function Header() {
    const [user, setUser] = useState<null | { id: string }>(null)
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    async function handleSignOut() {
        await supabase.auth.signOut()
        setUser(null)
        router.push('/')
    }

    return (
        <header className="pt-4 pb-8">
            <div className="mx-auto flex justify-between items-center max-w-[1440px] gap-8">
                <Link href="/" className="text-2xl font-bold text-black">
                    Мій Магазин
                </Link>

                <input
                    type="text"
                    placeholder="Пошук товарів..."
                    className="border rounded-lg px-4 py-2 w-1/3 mr-auto"
                />

                <nav className="flex items-center space-x-4">
                    <FavoriteIcon />
                    <Tooltip content="Корзина">
                        <CartIcon />
                    </Tooltip>

                    <div className="flex items-center justify-center text-black hover:text-blue-600 transition">
                        {user ? (
                            <button onClick={handleSignOut}>
                                <CiLogout className="h-8 w-8" />
                            </button>
                        ) : (
                            <Link href="/auth">
                                <CiLogin className="h-8 w-8" />
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}
