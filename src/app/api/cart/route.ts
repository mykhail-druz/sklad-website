// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
        const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    }
    return NextResponse.json({ message: 'User ID required' }, { status: 400 })
}

export async function POST(request: NextRequest) {
    const { productId, title, imageUrl, price, quantity, userId } =
        await request.json()

    if (userId) {
        const { error } = await supabase.from('cart_items').insert({
            user_id: userId,
            product_id: productId,
            title,
            image_url: imageUrl,
            price,
            quantity,
            created_at: new Date().toISOString(),
        })
        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
    }
    return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
    )
}

export async function PUT(request: NextRequest) {
    const { productId, quantity, userId } = await request.json()

    if (userId) {
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', productId)
        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
    }
    return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
    )
}

export async function DELETE(request: NextRequest) {
    const { productId, userId } = await request.json()

    if (userId) {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId)
        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
    }
    return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
    )
}
