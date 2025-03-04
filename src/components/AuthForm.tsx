'use client'

interface AuthFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    loading: boolean
    buttonText: string
    disabled?: boolean
    email: string
    setEmail: (value: string) => void
    password: string
    setPassword: (value: string) => void
}

export default function AuthForm({
    onSubmit,
    loading,
    buttonText,
    disabled,
    email,
    setEmail,
    password,
    setPassword,
}: AuthFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
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
                disabled={loading || disabled}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
                {loading ? 'Обработка...' : buttonText}
            </button>
        </form>
    )
}
