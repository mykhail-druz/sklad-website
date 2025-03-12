// lib/api/categories.ts
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/types/product'

export type Category = {
    id: string
    name: string
    slug: string
    parent_id: string | null
}

export type SubcategoryWithProducts = {
    name: string
    slug: string
    products: Product[]
}

// Get main categories (those without parent_id)
export async function getMainCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .is('parent_id', null)
        .order('name')

    if (error) {
        console.error('Error fetching main categories:', error)
        return []
    }

    return data || []
}

// Get subcategories for a specific category
export async function getSubcategories(categoryId: string) {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('parent_id', categoryId)
        .order('name')

    if (error) {
        console.error('Error fetching subcategories:', error)
        return []
    }

    return data || []
}

// Get a category by its slug
export async function getCategoryBySlug(
    slug: string
): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching category by slug:', error)
        return null
    }

    return data
}
