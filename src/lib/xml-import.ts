import { parseStringPromise } from "xml2js";
import { supabase } from "./supabase";

export async function importProductsFromXML(xmlUrl: string) {
    try {
        const response = await fetch(xmlUrl);
        if (!response.ok) {
            throw new Error(`Не вдалося завантажити XML: ${response.statusText}`);
        }

        const xmlData = await response.text();
        const result = await parseStringPromise(xmlData);

        // Логируем структуру для отладки
        console.log("Розібраний XML:", JSON.stringify(result, null, 2));

        // Проверяем правильную структуру
        const shop = result?.yml_catalog?.shop?.[0];
        if (!shop || !shop.offers?.[0]?.offer) {
            console.error("Невірний формат XML:", result);
            return { success: false, message: "Формат XML не відповідає очікуваному." };
        }

        // Разбираем товары
        const products = shop.offers[0].offer.map((offer: any) => ({
            title: offer.name?.[0] || "Без назви",
            price: offer.price?.[0] ? parseFloat(offer.price[0]) : 0,
            description: offer.description?.[0] || "",
            image_url: offer.picture?.[0] || "",
        }));

        if (products.length === 0) {
            return { success: false, message: "Не знайдено жодного товару." };
        }

        const { error } = await supabase.from("products").insert(products);
        if (error) throw error;

        return { success: true, message: "Товари успішно імпортовано!" };
    } catch (error) {
        console.error("Помилка імпорту:", error);
        return { success: false, message: "Помилка під час імпорту товарів." };
    }
}
