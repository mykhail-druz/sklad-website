const testimonials = [
    { name: 'Іван', review: 'Чудовий магазин, швидка доставка!' },
    { name: 'Марія', review: 'Дуже якісні товари, рекомендую!' },
]

export default function Testimonials() {
    return (
        <section className="bg-gray-100 py-10 text-center">
            <h2 className="text-2xl font-bold mb-6">Що кажуть наші клієнти?</h2>
            <div className="flex flex-col md:flex-row justify-center gap-6">
                {testimonials.map((t) => (
                    <div
                        key={t.name}
                        className="p-6 bg-white rounded-lg shadow-md"
                    >
                        <p className="text-lg">&quot;{t.review}&quot;</p>
                        <p className="mt-2 font-semibold">- {t.name}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
