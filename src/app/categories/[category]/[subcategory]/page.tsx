import ProductList from '@/components/ProductList'
import { getProductsBySubcategory } from '@/lib/api/products'

type PageProps = {
    params: Promise<{ subcategory: string }>
}

export default async function SubcategoryPage({ params }: PageProps) {
    // Разрешаем параметры, чтобы получить объект с полем subcategory
    const { subcategory: subcategorySlug } = await params

    const { name, products } = await getProductsBySubcategory(subcategorySlug)

    if (!products.length) {
        return <p className="text-center text-gray-600">Товари відсутні</p>
    }

    return (
        <div className="max-w-[1440px] mx-auto py-4">
            <h1 className="text-3xl font-bold mb-6">{name}</h1>
            <ProductList products={products} />
        </div>
    )
}
