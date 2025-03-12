import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import CartButton from '@/components/CartButton'
import SaveButton from '@/components/SaveButton'

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    // Ждём разрешения параметров
    const { id } = await params

    // Загружаем товар по ID
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        return <p className="text-center text-gray-600">Товар не знайдено</p>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        width={800}
                        height={600}
                        className="w-full rounded-lg object-cover"
                    />
                </div>
                <div className="lg:w-1/2 relative">
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-semibold text-blue-600 mb-4">
                        ${product.price}
                    </p>
                    <div className="flex flex-row items-center gap-6 mb-6">
                        <div className="w-1/2">
                            <CartButton
                                productId={product.id}
                                name={product.name}
                                imageUrl={product.image_url}
                                price={product.price}
                            />
                        </div>
                        <SaveButton productId={product.id} />
                    </div>
                    <div className="prose max-w-none">
                        {product.description}
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Подробности товару</h2>
                <p className="text-gray-700">{product.description}</p>
            </div>
        </div>
    )
}
