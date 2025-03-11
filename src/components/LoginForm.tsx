import React from 'react'
import { Spinner } from '@heroui/spinner'

interface LoginFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    email: string
    password: string
    setEmail: (value: string) => void
    setPassword: (value: string) => void
    loading: boolean
}

export default function LoginForm({
    onSubmit,
    email,
    password,
    setEmail,
    setPassword,
    loading,
}: LoginFormProps) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4 pb-4">
            <div className="flex flex-col">
                <label
                    htmlFor="loginEmail"
                    className="mb-1 text-sm font-medium"
                >
                    Електронна пошта
                </label>
                <input
                    id="loginEmail"
                    type="email"
                    value={email}
                    placeholder="Введіть електронну пошту"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex flex-col">
                <label
                    htmlFor="loginPassword"
                    className="mb-1 text-sm font-medium"
                >
                    Пароль
                </label>
                <input
                    id="loginPassword"
                    type="password"
                    value={password}
                    placeholder="Введіть пароль"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
                {loading ? <Spinner color="default" /> : 'Увійти'}
            </button>
        </form>
    )
}
