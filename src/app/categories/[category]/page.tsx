import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type PageProps = {
    params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: PageProps) {
    // Ждём разрешения параметров
    const { category: categorySlug } = await params

    // Загружаем категорию по slug
    const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', categorySlug)
        .single()

    if (categoryError || !category) {
        return (
            <p className="text-center text-gray-600">Категорію не знайдено</p>
        )
    }

    // Загружаем подкатегории этой категории
    const { data: subcategories, error: subcategoryError } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('parent_id', category.id)

    return (
        <div className="max-w-[1440px] mx-auto py-4">
            <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
            {subcategoryError || !subcategories?.length ? (
                <p className="text-gray-600">Підкатегорії не знайдено</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {subcategories.map(({ name, slug }) => (
                        <Link
                            key={slug}
                            href={`/categories/${categorySlug}/${slug}`}
                        >
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
