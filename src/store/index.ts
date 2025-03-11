// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import { persistAuthMiddleware } from './persistMiddleware'

// Функция для загрузки состояния авторизации из localStorage
const preloadedState = () => {
    if (typeof window !== 'undefined') {
        const savedAuth = localStorage.getItem('auth')
        if (savedAuth) {
            return { auth: JSON.parse(savedAuth) }
        }
    }
    return undefined
}

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
    },
    preloadedState: preloadedState(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(persistAuthMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
