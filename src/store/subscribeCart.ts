// store/subscribeCart.ts
import store from '@/store'
import { syncCartToSupabase } from './slices/cartSlice'
import debounce from 'lodash.debounce'

const debouncedSync = debounce((items) => {
    store.dispatch(syncCartToSupabase(items))
}, 1000)

store.subscribe(() => {
    const state = store.getState()
    if (state.auth.isLoggedIn && state.auth.user) {
        // вызываем с задержкой
        debouncedSync(state.cart.items)
    }
})
