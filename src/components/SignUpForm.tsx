'use client'

interface SignUpFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    loading: boolean
    disabled?: boolean
}

export default function SignUpForm({
    onSubmit,
    loading,
    disabled,
}: SignUpFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <button
                type="submit"
                disabled={loading || disabled}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
                {loading ? 'Обробка...' : 'Зареєструватися'}
            </button>
        </form>
    )
}
