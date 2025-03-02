'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignOutButton() {
    const router = useRouter()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
            Выйти
        </button>
    )
}
