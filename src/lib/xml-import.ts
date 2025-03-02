// import { parseStringPromise } from 'xml2js'
// import { supabase } from '@/lib/supabaseClient'
// import slugify from 'slugify'
//
// // Функция проверки валидности UUID
// const isValidUUID = (id: string) => /^[0-9a-fA-F-]{36}$/.test(id)
//
// export async function importProductsFromXML(xmlUrl: string) {
//     return null
//     try {
//         console.log(`🔄 Старт імпорту XML: ${xmlUrl}`)
//
//         const response = await fetch(xmlUrl)
//         if (!response.ok) {
//             throw new Error(
//                 `❌ Помилка завантаження XML: ${response.statusText}`
//             )
//         }
//
//         const xmlData = await response.text()
//         const result = await parseStringPromise(xmlData)
//
//         console.log(`✅ XML успішно завантажено!`)
//
//         // 1️⃣ **Парсим категории**
//         console.log('🔍 Починаємо парсинг категорій...')
//         const categoriesMap = new Map<
//             string,
//             { name: string; slug: string; parentId: string | null }
//         >()
//         const categoriesSet = new Set<string>() // Используем Set для удаления дублей
//
//         result.yml_catalog.shop[0].categories[0].categories.forEach(
//             (cat: any) => {
//                 const id = cat.$.id
//                 const name = cat._
//                 let parentId = cat.$.parentId || null
//                 const slug = slugify(name, { lower: true, strict: true })
//
//                 // Проверяем, является ли `parentId` валидным UUID, иначе ставим null
//                 if (parentId && !isValidUUID(parentId)) {
//                     console.warn(
//                         `⚠️ Некорректный parent_id: ${parentId} → Заменяем на NULL`
//                     )
//                     parentId = null
//                 }
//
//                 categoriesMap.set(id, { name, slug, parentId })
//                 categoriesSet.add(
//                     JSON.stringify({ name, slug, parent_id: null })
//                 ) // Ставим `null` временно
//             }
//         )
//
//         let categories = Array.from(categoriesSet).map((c) => JSON.parse(c))
//
//         console.log(`📌 Унікальних категорій: ${categories.length}`)
//         console.log('📝 Первая категория:', categories[0])
//
//         // 2️⃣ **Добавляем категории в Supabase**
//         console.log('📡 Додаємо категорії в базу...')
//         const { data: insertedCategories, error: categoryError } =
//             await supabase
//                 .from('categories')
//                 .upsert(categories, { onConflict: 'slug' })
//                 .select('id, slug')
//
//         if (categoryError) {
//             console.error('❌ Ошибка при вставке категорий:', categoryError)
//             return {
//                 success: false,
//                 message: 'Помилка під час імпорту категорій.',
//             }
//         }
//
//         console.log(`✅ Категорії додано!`)
//
//         // 3️⃣ **Обновляем parent_id**
//         console.log('🔄 Оновлюємо parent_id...')
//         const slugToIdMap = Object.fromEntries(
//             insertedCategories.map((c) => [c.slug, c.id])
//         )
//
//         for (const categories of insertedCategories) {
//             const originalCategory = categoriesMap.get(categories.slug)
//             if (originalCategory && originalCategory.parentId) {
//                 const newParentId =
//                     slugToIdMap[
//                         categoriesMap.get(originalCategory.parentId)?.slug || ''
//                     ]
//                 if (newParentId) {
//                     await supabase
//                         .from('categories')
//                         .update({ parent_id: newParentId })
//                         .eq('id', categories.id)
//                 }
//             }
//         }
//
//         console.log(`✅ parent_id оновлено!`)
//
//         // 4️⃣ **Парсим товары**
//         console.log('🛒 Починаємо парсинг товарів...')
//         const products = result.yml_catalog.shop[0].offers[0].offer.map(
//             (offer: any) => {
//                 const categoryData = categoriesMap.get(offer.categoryId[0])
//
//                 // ✅ Проверяем, есть ли parent_id, и определяем subcategory_id
//                 const subcategoryId = categoryData?.parentId
//                     ? categorySlugToId[
//                           categoriesMap.get(categoryData.parentId)?.slug || ''
//                       ]
//                     : null
//
//                 return {
//                     id: offer.$.id,
//                     title: offer.name[0],
//                     price: parseFloat(offer.price[0]),
//                     description: offer.description?.[0] || '',
//                     image_url: offer.picture?.[0] || '',
//                     category_id: categorySlugToId[categoryData.slug] || null,
//                     subcategory_id: subcategoryId || null, // ✅ Добавляем подкатегорию
//                     created_at: new Date().toISOString(),
//                 }
//             }
//         )
//
//         console.log(`📦 Унікальних товарів: ${products.length}`)
//         console.log('📝 Первый товар:', products[0])
//
//         // 5️⃣ **Импортируем товары**
//         console.log('📡 Додаємо товари в базу...')
//         const { error: productError } = await supabase
//             .from('products')
//             .upsert(products, { onConflict: 'id' })
//
//         if (productError) {
//             console.error('❌ Ошибка при вставке товаров:', productError)
//             return {
//                 success: false,
//                 message: 'Помилка під час імпорту товарів.',
//             }
//         }
//
//         console.log(`✅ Товари успішно імпортовано!`)
//         return { success: true, message: 'Імпорт завершено!' }
//     } catch (error) {
//         console.error('🚨 Помилка імпорту:', error)
//         return { success: false, message: 'Помилка під час імпорту товарів.' }
//     }
// }
