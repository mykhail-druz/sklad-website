import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { supabase } from '@/lib/supabaseClient'

// Обновляем интерфейс CartItem в cartSlice.ts
export interface CartItem {
    id?: string // Добавляем id для соответствия с таблицей
    product_id: string
    variant_id?: string | null // Добавляем поле для вариантов товара
    name: string
    image_url: string
    quantity: number
    price: number
    created_at?: string
    updated_at?: string
}

// Интерфейс для строки из таблицы 'cart_items' в Supabase
// interface CartRow {
//     id?: string
//     user_id: string
//     product_id: string
//     variant_id?: string | null
//     quantity: number
//     price: number
//     created_at?: string
//     updated_at?: string
// }

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: [],
}

// Вспомогательный интерфейс для продукта
interface ProductInfo {
    name: string
    price: number
}

// Интерфейс для словаря продуктов
interface ProductsMap {
    [key: string]: ProductInfo
}

// Интерфейс для словаря изображений
interface ImagesMap {
    [key: string]: string
}

interface PriceMap {
    [key: string]: {
        price: number
    }
}

// interface RemoveItemPayload {
//     product_id: string
// }

export const updateItemQuantityInSupabase = createAsyncThunk<
    void,
    { product_id: string; quantity: number },
    { state: RootState }
>(
    'cart/updateItemQuantityInSupabase',
    async ({ product_id, quantity }, { getState, dispatch }) => {
        const { auth } = getState()

        // Сначала обновляем локально
        dispatch(updateItemQuantity({ product_id, quantity }))

        if (!auth.isLoggedIn || !auth.user) {
            return
        }

        // Затем обновляем в Supabase
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .match({ user_id: auth.user.id, product_id })

        if (error) {
            console.error(
                'Ошибка при обновлении количества в Supabase:',
                error.message
            )
        }
    }
)

export const syncCartToSupabase = createAsyncThunk<
    void,
    void,
    { state: RootState }
>('cart/syncCartToSupabase', async (_, { getState }) => {
    const { auth, cart } = getState()
    const items = cart.items

    if (!auth.isLoggedIn || !auth.user) {
        console.log(
            'Синхронизация корзины пропущена, пользователь не авторизован'
        )
        return
    }

    const userId = auth.user.id
    console.log('Начинается синхронизация корзины для пользователя:', userId)

    // Получаем актуальные цены продуктов из базы данных
    const productIds = items.map((item) => item.product_id)

    if (productIds.length > 0) {
        const { data: productsData } = await supabase
            .from('products')
            .select('id, price, sale_price')
            .in('id', productIds)

        const productsMap: PriceMap = {}
        if (productsData) {
            productsData.forEach((product) => {
                productsMap[product.id] = {
                    price: product.sale_price || product.price,
                }
            })
        }

        // Подготавливаем данные для вставки с актуальными ценами
        const cartItemsToInsert = items.map((item) => ({
            user_id: userId,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity: item.quantity,
            // Используем актуальную цену из базы данных или текущую цену элемента
            price: productsMap[item.product_id]?.price || item.price,
        }))

        // Удаляем старые записи
        await supabase.from('cart_items').delete().eq('user_id', userId)

        // Добавляем новые записи, если корзина не пуста
        if (cartItemsToInsert.length > 0) {
            const { error } = await supabase
                .from('cart_items')
                .insert(cartItemsToInsert)

            if (error) {
                console.error(
                    'Ошибка при синхронизации корзины:',
                    error.message
                )
            } else {
                console.log('Корзина успешно синхронизирована с Supabase')
            }
        }
    } else {
        // Если корзина пуста, просто удаляем все записи для пользователя
        await supabase.from('cart_items').delete().eq('user_id', userId)
    }
})

export const loadCartFromSupabase = createAsyncThunk<
    CartItem[],
    void,
    { state: RootState }
>('cart/loadCartFromSupabase', async (_, { getState }) => {
    const { auth } = getState()
    if (!auth.isLoggedIn || !auth.user) return []

    // Получаем данные корзины из Supabase
    const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', auth.user.id)

    if (cartError) {
        console.error('Ошибка при загрузке корзины:', cartError.message)
        return []
    }

    if (!cartData || cartData.length === 0) {
        return []
    }

    // Собираем ID продуктов из корзины
    const productIds = cartData.map((item) => item.product_id)

    // Получаем информацию о продуктах
    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, sale_price')
        .in('id', productIds)

    if (productsError) {
        console.error(
            'Ошибка при загрузке информации о продуктах:',
            productsError.message
        )
        return cartData.map((item) => ({
            product_id: item.product_id,
            name: 'Товар не найден',
            image_url: '',
            quantity: item.quantity,
            price: item.price,
        }))
    }

    // Создаем словарь продуктов для быстрого поиска
    const productsMap: ProductsMap = {}
    if (productsData) {
        productsData.forEach((product) => {
            productsMap[product.id] = {
                name: product.name,
                price: product.sale_price || product.price,
            }
        })
    }

    // Получаем основные изображения продуктов
    const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('product_id, url, is_primary')
        .in('product_id', productIds)
        .order('is_primary', { ascending: false }) // Сначала основные изображения
        .order('display_order', { ascending: true }) // Затем по порядку отображения

    if (imagesError) {
        console.error(
            'Ошибка при загрузке изображений продуктов:',
            imagesError.message
        )
    }

    // Создаем словарь изображений продуктов
    const imagesMap: ImagesMap = {}
    if (imagesData) {
        // Группируем изображения по product_id
        imagesData.forEach((image) => {
            if (!imagesMap[image.product_id] || image.is_primary) {
                imagesMap[image.product_id] = image.url
            }
        })
    }

    // Формируем полные данные для элементов корзины
    return cartData.map((cartItem) => {
        const productInfo = productsMap[cartItem.product_id] || {
            name: 'Товар не найден',
            price: cartItem.price,
        }

        return {
            product_id: cartItem.product_id,
            variant_id: cartItem.variant_id,
            name: productInfo.name,
            // Используем изображение из словаря или заглушку
            image_url:
                imagesMap[cartItem.product_id] || '/placeholder-image.jpg',
            quantity: cartItem.quantity,
            price: cartItem.price || productInfo.price,
        }
    })
})

export const addItemWithProductInfo = createAsyncThunk<
    void,
    { productId: string; quantity: number; variantId?: string },
    { state: RootState }
>(
    'cart/addItemWithProductInfo',
    async ({ productId, quantity, variantId }, { dispatch, getState }) => {
        // Получаем информацию о продукте из базы данных
        const { data: productData, error: productError } = await supabase
            .from('products')
            .select('id, name, price, sale_price')
            .eq('id', productId)
            .single()

        if (productError || !productData) {
            console.error(
                'Ошибка при получении информации о продукте:',
                productError?.message
            )
            return
        }

        // Получаем основное изображение продукта
        const { data: imageData } = await supabase
            .from('product_images')
            .select('url')
            .eq('product_id', productId)
            .eq('is_primary', true)
            .order('display_order', { ascending: true })
            .limit(1)
            .single()

        // Если основное изображение не найдено, попробуем получить любое изображение
        let imageUrl = ''
        if (!imageData) {
            const { data: anyImageData } = await supabase
                .from('product_images')
                .select('url')
                .eq('product_id', productId)
                .order('display_order', { ascending: true })
                .limit(1)
                .single()

            if (anyImageData) {
                imageUrl = anyImageData.url
            }
        } else {
            imageUrl = imageData.url
        }

        // Добавляем товар в корзину с полной информацией
        const itemToAdd: CartItem = {
            product_id: productId,
            variant_id: variantId,
            name: productData.name,
            image_url: imageUrl || '/placeholder-image.jpg', // Если изображение не найдено
            quantity: quantity,
            price: productData.sale_price || productData.price,
        }

        dispatch(addItem(itemToAdd))

        // Синхронизируем корзину с Supabase
        const { auth } = getState()
        if (auth.isLoggedIn && auth.user) {
            dispatch(syncCartToSupabase())
        }
    }
)

export const removeItemFromSupabase = createAsyncThunk<
    void,
    string, // Здесь принимаем product_id как строку
    { state: RootState }
>('cart/removeItemFromSupabase', async (productId, { getState, dispatch }) => {
    // Сначала удаляем товар локально
    dispatch(removeItem(productId))

    const { auth } = getState()
    if (!auth.isLoggedIn || !auth.user) {
        return
    }

    // Затем удаляем из Supabase
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .match({ user_id: auth.user.id, product_id: productId })

    if (error) {
        console.error(
            'Ошибка при удалении товара из корзины в Supabase:',
            error.message
        )
    }
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) => item.product_id === action.payload.product_id
            )
            if (existingItem) {
                existingItem.quantity += action.payload.quantity
            } else {
                state.items.push(action.payload)
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            // Удаляем товар по product_id
            state.items = state.items.filter(
                (item) => item.product_id !== action.payload
            )
        },
        updateItemQuantity: (
            state,
            action: PayloadAction<{ product_id: string; quantity: number }>
        ) => {
            const { product_id, quantity } = action.payload
            const item = state.items.find(
                (item) => item.product_id === product_id
            )
            if (item) {
                item.quantity = quantity
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
