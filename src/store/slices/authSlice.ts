// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: string
    email: string
}

interface AuthState {
    user: User | null
    token: string | null
    isLoggedIn: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoggedIn: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isLoggedIn = true
        },
        clearCredentials: (state) => {
            state.user = null
            state.token = null
            state.isLoggedIn = false
        },
    },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
