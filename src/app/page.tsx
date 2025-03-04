import Banner from '@/components/Banner'
import CategoryList from '@/components/CategoryList'
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
    return (
        <div className="flex flex-col gap-6">
            <Banner />
            <CategoryList />
            <Testimonials />
        </div>
    )
}
