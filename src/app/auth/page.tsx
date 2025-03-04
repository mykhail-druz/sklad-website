'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AuthForm from '@/components/AuthForm'
import GoogleButton from '@/components/GoogleButton'
import SignUpForm from '@/components/SignUpForm'

// Опционально: определение типа ошибки Supabase
interface SupabaseError {
    message: string
    code?: string
    status?: number
}

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            setError(null)
            router.push('/')
        } catch (err: unknown) {
            const errorMessage =
                (err as SupabaseError)?.message || 'Ошибка входа'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            setError(null)
            alert('Перевірте свою пошту для підтвердження реєстрації!')
        } catch (err: unknown) {
            const errorMessage =
                (err as SupabaseError)?.message || 'Помилка реєстрації'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            })
            if (error) throw error
        } catch (err: unknown) {
            const errorMessage =
                (err as SupabaseError)?.message || 'Ошибка входа через Google'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-3xl mx-auto py-4 px-8 max-w-xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">
                Авторизація
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <AuthForm
                onSubmit={handleLogin}
                loading={loading}
                buttonText="Вхід"
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
            />

            <div className="my-6 text-center">або</div>

            <GoogleButton onClick={handleGoogleSignIn} loading={loading} />

            <hr className="my-6" />

            <SignUpForm
                onSubmit={handleSignUp}
                loading={loading}
                disabled={!email || !password}
            />
        </div>
    )
}
