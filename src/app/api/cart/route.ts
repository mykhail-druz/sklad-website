import { NextResponse } from 'next/server'
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
} from '@/lib/cartApi'

export async function GET() {
    const cart = await getCart()
    return NextResponse.json(cart)
}

export async function POST(req: Request) {
    const { productId, productData } = await req.json()
    await addToCart(productId, productData)
    return NextResponse.json({ success: true })
}

export async function PATCH(req: Request) {
    const { productId, quantity } = await req.json()
    await updateCartItem(productId, quantity)
    return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
    const { productId } = await req.json()
    await removeCartItem(productId)
    return NextResponse.json({ success: true })
}
