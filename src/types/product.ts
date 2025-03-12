// types/product.ts
export interface Product {
    id: string
    name: string
    price: number
    description: string
    category_id?: string
    product_images?: {
        id: string
        url: string
    }[]
}
