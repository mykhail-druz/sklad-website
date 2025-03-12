import Link from 'next/link'
import { getCategoryBySlug, getSubcategories } from '@/lib/api/categories'

type PageProps = {
    params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: PageProps) {
    // Ожидаем разрешения params
    const { category } = await params
    const categorySlug = category

    // Получаем данные категории
    const categoryData = await getCategoryBySlug(categorySlug)

    if (!categoryData) {
        return (
            <p className="text-center text-gray-600">Категорію не знайдено</p>
        )
    }

    // Получаем подкатегории
    const subcategories = await getSubcategories(categoryData.id)

    return (
        <div className="max-w-[1440px] mx-auto py-4">
            <h1 className="text-3xl font-bold mb-6">{categoryData.name}</h1>
            {!subcategories.length ? (
                <p className="text-gray-600">Підкатегорії не знайдено</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {subcategories.map(({ name, slug }) => (
                        <Link key={slug} href={`/${categorySlug}/${slug}`}>
                            <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-center border border-gray-200">
                                <p className="text-lg font-medium text-gray-800">
                                    {name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
