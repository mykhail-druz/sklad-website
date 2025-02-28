import { supabase } from '@/lib/supabaseClient'

export async function getProductsBySubcategory(subcategorySlug: string) {
    // Получаем ID подкатегории по slug
    const { data: subcategory, error: subcategoryError } = await supabase
        .from('categories')
        .select('id, name, parent_id')
        .eq('slug', subcategorySlug)
        .single()

    if (subcategoryError || !subcategory) return { name: '', products: [] }

    // Загружаем товары для подкатегории
    let { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('subcategory_id', subcategory.id)

    // Если товаров нет, загружаем из родительской категории
    if (!products?.length && subcategory.parent_id) {
        console.log(
            `🔄 Товары не найдены в подкатегории, загружаем из родительской...`
        )
        const { data: parentProducts } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', subcategory.parent_id)

        products = parentProducts ?? []
    }

    return { name: subcategory.name, products: products ?? [] }
}
