import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default async function CategoryList() {
    // Загружаем все категории, включая главные и подкатегории
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')

    if (error || !categories?.length) {
        return (
            <p className="text-center text-gray-600">Категорії не знайдено</p>
        )
    }

    // Разделяем категории на главные и подкатегории
    const mainCategories = categories.filter((c) => c.parent_id === null)
    const subcategories = categories.filter((c) => c.parent_id !== null)

    return (
        <section className="container mx-auto py-10">
            <h2 className="text-2xl font-bold mb-6">Популярні категорії</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {mainCategories.map(({ id, name, slug }) => (
                    <div
                        key={id}
                        className="bg-gray-100 rounded-lg shadow-md p-4"
                    >
                        <Link href={`/category/${slug}`}>
                            <p className="text-lg font-semibold cursor-pointer hover:text-blue-500 transition">
                                {name}
                            </p>
                        </Link>

                        {/* Вложенные подкатегории */}
                        <div className="mt-2 text-sm text-gray-600">
                            {subcategories
                                .filter((sub) => sub.parent_id === id)
                                .map(({ name, slug }) => (
                                    <Link
                                        key={slug}
                                        href={`/category/${slug}`}
                                        className="block hover:text-blue-500 transition"
                                    >
                                        {name}
                                    </Link>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
