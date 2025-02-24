import Link from "next/link";

export default function Home() {
  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Вітаємо в українському магазині!</h1>
        <Link href="/products" className="text-blue-500 hover:underline">
          Переглянути товари
        </Link>
      </div>
  );
}