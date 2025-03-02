'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { FaGoogle } from 'react-icons/fa'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        } else {
            setError(null)
            router.push('/') // перенаправляем пользователя после успешного входа
        }
        setLoading(false)
    }

    async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            setError(error.message)
        } else {
            setError(null)
            alert('Проверьте свою почту для подтверждения регистрации')
        }
        setLoading(false)
    }

    async function handleGoogleSignIn() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        })
        if (error) {
            setError(error.message)
            setLoading(false)
        }
        // При успешном вызове OAuth Supabase выполнит редирект на страницу Google
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Авторизация</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border rounded-md px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border rounded-md px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>

            <div className="my-6 text-center">или</div>

            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
                <FaGoogle />
            </button>

            <hr className="my-6" />

            <form onSubmit={handleSignUp} className="space-y-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    )
}
