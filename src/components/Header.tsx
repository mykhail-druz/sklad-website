import Link from 'next/link'
import CartIcon from '@/components/CartIcon' // ✅ Импортируем иконку корзины

export default function Header() {
    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Мій Магазин
                </Link>

                <input
                    type="text"
                    placeholder="Пошук товарів..."
                    className="border rounded-lg px-4 py-2 w-1/3"
                />

                <nav className="flex items-center space-x-6">
                    <Link
                        href="/products"
                        className="text-gray-700 hover:text-blue-600"
                    >
                        Каталог
                    </Link>
                    <Link
                        href="/favorites"
                        className="text-gray-700 hover:text-blue-600"
                    >
                        ❤️ Обране
                    </Link>

                    {/* 🛒 Иконка корзины с количеством товаров */}
                    <CartIcon />
                </nav>
            </div>
        </header>
    )
}
