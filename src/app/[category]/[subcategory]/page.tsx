import ProductList from '@/components/ProductList'
import { getProductsBySubcategory } from '@/lib/api/products'

interface AsyncPageParams {
    params: Promise<{
        category: string
        subcategory: string
    }>
}

export default async function SubcategoryPage({ params }: AsyncPageParams) {
    // Разрешаем промис, чтобы получить объект параметров
    const { subcategory } = await params

    // Получаем данные подкатегории и продукты
    const { name, products } = await getProductsBySubcategory(subcategory)

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
