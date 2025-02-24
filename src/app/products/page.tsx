import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

export default async function ProductsPage() {
    const { data: products } = await supabase.from("products").select("*");

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Товари</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products?.map((product: Product) => (
                    <div key={product.id} className="border p-4 rounded-lg">
                        <h2 className="text-xl">{product.title}</h2>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-lg font-semibold">{product.price} $</p>
                        {product.image_url && (
                            <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover mt-2" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}