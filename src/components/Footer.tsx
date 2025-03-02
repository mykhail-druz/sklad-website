export default function Footer() {
    return (
        <footer className="bg-black  text-center py-6 mt-10">
            <p className="text-white">
                © {new Date().getFullYear()} Мій Магазин. Усі права захищені.
            </p>
        </footer>
    )
}
