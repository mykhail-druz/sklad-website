'use client'

import React, { useState } from 'react'
import { Spinner } from '@heroui/spinner'

interface SignUpFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    loading?: boolean
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phoneNumber: string
    setFirstName: React.Dispatch<React.SetStateAction<string>>
    setLastName: React.Dispatch<React.SetStateAction<string>>
    setEmail: React.Dispatch<React.SetStateAction<string>>
    setPassword: React.Dispatch<React.SetStateAction<string>>
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>
}

export default function SignUpForm({
    onSubmit,
    loading,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setPhoneNumber,
}: SignUpFormProps) {
    const [passwordsMatch, setPasswordsMatch] = useState(true)

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setPasswordsMatch(e.target.value === confirmPassword)
    }

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value)
        setPasswordsMatch(password === e.target.value)
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
                <label htmlFor="firstName" className="mb-1 text-sm font-medium">
                    Ім&apos;я
                </label>
                <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    placeholder="Введіть ім'я"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="lastName" className="mb-1 text-sm font-medium">
                    Прізвище
                </label>
                <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    placeholder="Введіть прізвище"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 text-sm font-medium">
                    Електронна пошта
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Введіть електронну пошту"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="password" className="mb-1 text-sm font-medium">
                    Пароль
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Введіть пароль"
                    onChange={handlePasswordChange}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex flex-col">
                <label
                    htmlFor="confirmPassword"
                    className="mb-1 text-sm font-medium"
                >
                    Підтвердження пароля
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    placeholder="Підтвердіть пароль"
                    onChange={handleConfirmPasswordChange}
                    required
                    className={`border p-2 rounded focus:outline-none focus:ring-2 ${
                        passwordsMatch
                            ? 'focus:ring-blue-400'
                            : 'focus:ring-red-400'
                    }`}
                />
            </div>
            {!passwordsMatch && (
                <p className="text-red-500">Паролі не співпадають</p>
            )}

            <div className="flex flex-col">
                <label
                    htmlFor="phoneNumber"
                    className="mb-1 text-sm font-medium"
                >
                    Номер телефону
                </label>
                <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    placeholder="Введіть номер телефону"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <button
                type="submit"
                disabled={loading || !passwordsMatch}
                className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center"
            >
                {loading ? <Spinner color="default" /> : 'Зареєструватися'}
            </button>
        </form>
    )
}
