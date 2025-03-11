'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setCredentials } from '@/store/slices/authSlice'
import { loadCartFromSupabase } from '@/store/slices/cartSlice'
import SignUpForm from '@/components/SignUpForm'
import LoginForm from '@/components/LoginForm'
import GoogleButton from '@/components/GoogleButton'
import { Alert } from '@heroui/alert'
import { UserData } from '@/types/user' // Импортируем новый тип

interface SupabaseError {
    message: string
    code?: string
    status?: number
}

export default function AuthPage() {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [googleLoading, setGoogleLoading] = useState<boolean>(false)
    const [isLogin, setIsLogin] = useState<boolean>(false)

    const router = useRouter()
    const dispatch = useAppDispatch()

    // Функция для сохранения профиля пользователя с типом UserData
    const saveUserProfile = async (userId: string, userData: UserData) => {
        try {
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            const fullName =
                userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.full_name || null

            if (existingProfile) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        phone: userData.phone || existingProfile.phone,
                        full_name: fullName || existingProfile.full_name,
                        avatar_url:
                            userData.avatar_url || existingProfile.avatar_url,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', userId)

                if (error) throw error
            } else {
                const { error } = await supabase.from('profiles').insert({
                    id: userId,
                    phone: userData.phone || phoneNumber || null,
                    full_name: fullName,
                    avatar_url: userData.avatar_url || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })

                if (error) throw error
            }
        } catch (err) {
            console.error('Помилка при збереженні профілю:', err)
            throw err
        }
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error

            if (data?.user && data?.session && data.user.email) {
                await saveUserProfile(data.user.id, {
                    phone: phoneNumber || null,
                })

                dispatch(
                    setCredentials({
                        user: { id: data.user.id, email: data.user.email },
                        token: data.session.access_token,
                    })
                )
                await dispatch(loadCartFromSupabase())
            }

            setSuccess('Вхід успішний!')
            setTimeout(() => router.push('/'), 1500)
        } catch (err: unknown) {
            const errorMessage =
                (err as SupabaseError)?.message || 'Помилка входу'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (password !== confirmPassword) {
                setError('Паролі не співпадають')
                setLoading(false)
                return
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            if (data.user) {
                await saveUserProfile(data.user.id, {
                    phone: phoneNumber || null,
                    firstName,
                    lastName,
                })
            }

            setSuccess('Перевірте свою пошту для підтвердження реєстрації!')
        } catch (err: unknown) {
            const errorMessage =
                (err as SupabaseError)?.message || 'Помилка реєстрації'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err: unknown) {
            const errorMessage =
                (err as SupabaseError)?.message || 'Помилка входу через Google'
            setError(errorMessage)
        } finally {
            setGoogleLoading(false)
        }
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg border">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {isLogin ? 'Вхід' : 'Реєстрація'}
                </h1>

                {error && (
                    <Alert
                        title="Помилка"
                        description={error}
                        className="mb-4"
                    />
                )}
                {success && (
                    <Alert
                        title="Успішно"
                        description={success}
                        className="mb-4 bg-green-50 text-green-800 border-green-200"
                    />
                )}

                {isLogin ? (
                    <LoginForm
                        onSubmit={handleLogin}
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        loading={loading}
                    />
                ) : (
                    <SignUpForm
                        onSubmit={handleSignUp}
                        loading={loading}
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        phoneNumber={phoneNumber}
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        setConfirmPassword={setConfirmPassword}
                        setPhoneNumber={setPhoneNumber}
                    />
                )}

                <hr className="my-6" />
                <GoogleButton
                    onClick={handleGoogleSignIn}
                    loading={googleLoading}
                />

                <p className="text-center mt-4 text-gray-600">
                    {isLogin ? (
                        <span>
                            Немає акаунта?{' '}
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => setIsLogin(false)}
                            >
                                Зареєструватися
                            </button>
                        </span>
                    ) : (
                        <span>
                            Вже є акаунт?{' '}
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => setIsLogin(true)}
                            >
                                Увійти
                            </button>
                        </span>
                    )}
                </p>
            </div>
        </section>
    )
}
