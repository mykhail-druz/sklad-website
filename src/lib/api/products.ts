// lib/api/products.ts
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/types/product'
import { getCategoryBySlug } from './categories'

// lib/api/products.ts

// Get products by category ID
export async function getProductsByCategory(
    categoryId: string
): Promise<Product[]> {
    const { data, error } = await supabase
        .from('product_categories')
        .select(
            `
            products(
                id, 
                name, 
                price, 
                description,
                product_images(id, url)
            )
        `
        )
        .eq('category_id', categoryId)

    if (error) {
        console.error('Error fetching products by category:', error)
        return []
    }

    // Extract products from the nested data structure и выровняем массив
    const products = data?.flatMap((item) => item.products) || []
    return products
}

// Get products by subcategory slug
export async function getProductsBySubcategory(subcategorySlug: string) {
    console.log(`Getting products for subcategory slug: ${subcategorySlug}`)

    // First get the subcategory details
    const subcategory = await getCategoryBySlug(subcategorySlug)

    if (!subcategory) {
        console.log(`Subcategory not found for slug: ${subcategorySlug}`)
        return { name: 'Підкатегорія не знайдена', products: [] }
    }

    console.log(`Found subcategory:`, subcategory)

    // Get products through the product_categories junction table
    const { data, error } = await supabase
        .from('product_categories')
        .select(
            `
            products(
                id, 
                name, 
                price, 
                description,
                product_images(id, url)
            )
        `
        )
        .eq('category_id', subcategory.id)

    console.log(`Query result:`, { data, error })

    if (error) {
        console.error('Error fetching products for subcategory:', error)
        return { name: subcategory.name, products: [] }
    }

    // Extract products from the nested data structure
    const products = data?.flatMap((item) => item.products) || []
    return { name: subcategory.name, products }
}

// Get detailed product by ID
export async function getProductById(
    productId: string
): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select(
            `
            id, 
            name, 
            price, 
            description,
            product_images(id, url),
            product_categories(category_id)
        `
        )
        .eq('id', productId)
        .single()

    if (error) {
        console.error('Error fetching product details:', error)
        return null
    }

    // Restructure data to match your Product type if needed
    return {
        ...data,
        category_id: data.product_categories?.[0]?.category_id || null,
    }
}
