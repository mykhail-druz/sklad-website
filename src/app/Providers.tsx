'use client'
import React from 'react'
import { HeroUIProvider } from '@heroui/react'
import { Provider } from 'react-redux'
import store from '@/store'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <HeroUIProvider>{children}</HeroUIProvider>
        </Provider>
    )
}
