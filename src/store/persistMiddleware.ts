import { Middleware } from '@reduxjs/toolkit'

export const persistAuthMiddleware: Middleware =
    (store) => (next) => (action) => {
        const result = next(action)

        // Сохраняем состояние auth в localStorage, только если оно изменилось
        if (typeof window !== 'undefined') {
            const state = store.getState()
            const prevAuth = localStorage.getItem('auth')

            const currentAuth = JSON.stringify(state.auth)

            // Проверяем, изменилось ли состояние auth
            if (prevAuth !== currentAuth) {
                localStorage.setItem('auth', currentAuth)
            }
        }

        return result
    }
