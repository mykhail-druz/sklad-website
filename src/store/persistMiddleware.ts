import { Middleware } from '@reduxjs/toolkit'

export const persistAuthMiddleware: Middleware =
    (store) => (next) => (action) => {
        const result = next(action)

        // Сохраняем состояние auth в localStorage (проверяем, что window доступно)
        if (typeof window !== 'undefined') {
            const state = store.getState()
            localStorage.setItem('auth', JSON.stringify(state.auth))
        }

        return result
    }
