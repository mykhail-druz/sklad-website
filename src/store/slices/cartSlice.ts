import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { supabase } from '@/lib/supabaseClient'

export interface CartItem {
    product_id: string
    title: string
    image_url: string
    quantity: number
    price: number
}

// Интерфейс для строки из таблицы 'cart' в Supabase
interface CartRow {
    user_id: string
    product_id: string
    quantity: number
    price: number
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: [],
}

export const syncCartToSupabase = createAsyncThunk<
    void,
    CartItem[],
    { state: RootState }
>('cart/syncCartToSupabase', async (items, { getState }) => {
    const { auth } = getState()
    if (!auth.isLoggedIn || !auth.user) {
        console.log(
            'Синхронизация корзины пропущена, пользователь не авторизован'
        )
        return
    }

    const userId = auth.user.id
    console.log('Начинается синхронизация корзины для пользователя:', userId)
    console.log('Данные для синхронизации:', items)

    const { error } = await supabase.from('cart').upsert(
        items.map((item) => ({
            user_id: userId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        })),
        { onConflict: 'user_id, product_id' }
    )

    if (error) {
        console.error('Ошибка при синхронизации корзины:', error.message)
    } else {
        console.log('Корзина успешно синхронизирована с Supabase')
    }
})

export const loadCartFromSupabase = createAsyncThunk<
    CartItem[],
    void,
    { state: RootState }
>('cart/loadCartFromSupabase', async (_, { getState }) => {
    const { auth } = getState()
    if (!auth.isLoggedIn || !auth.user) return []

    const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', auth.user.id)

    if (error) {
        console.error('Ошибка при загрузке корзины:', error.message)
        return []
    }

    return (data ?? []).map((row: CartRow) => ({
        product_id: row.product_id,
        title: '',
        image_url: '',
        quantity: row.quantity,
        price: row.price,
    }))
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload
            const existing = state.items.find(
                (i) => i.product_id === item.product_id
            )
            if (existing) {
                existing.quantity += item.quantity
            } else {
                state.items.push(item)
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (i) => i.product_id !== action.payload
            )
        },
        updateItemQuantity: (
            state,
            action: PayloadAction<{ product_id: string; quantity: number }>
        ) => {
            const { product_id, quantity } = action.payload
            const existing = state.items.find(
                (i) => i.product_id === product_id
            )
            if (existing) {
                existing.quantity = quantity
            }
        },
        clearCart: (state) => {
            state.items = []
        },
        setCartItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(syncCartToSupabase.fulfilled, () => {
            // можно показать уведомление, что корзина сохранена
        })
        builder.addCase(loadCartFromSupabase.fulfilled, (state, action) => {
            if (action.payload) {
                state.items = action.payload
            }
        })
    },
})

export const {
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    setCartItems,
} = cartSlice.actions

export default cartSlice.reducer
