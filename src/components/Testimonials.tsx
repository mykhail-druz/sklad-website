'use client'
import avatar1 from '@/assets/avatar-1.webp'
import avatar2 from '@/assets/avatar-2.webp'
import avatar3 from '@/assets/avatar-3.webp'
import avatar4 from '@/assets/avatar-4.webp'
import avatar5 from '@/assets/avatar-5.webp'
import avatar6 from '@/assets/avatar-6.webp'
import avatar7 from '@/assets/avatar-7.webp'
import avatar8 from '@/assets/avatar-8.webp'
import avatar9 from '@/assets/avatar-9.webp'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import React from 'react'
import { motion } from 'framer-motion'

const testimonials = [
    {
        text: 'Чесно, не очікував такого сервісу! Замовлення прийшло швидко, менеджер відповів одразу, а якість товару — на висоті. Ніякого браку, усе як треба. Рекомендую всім оптовикам!',
        imageSrc: avatar1.src,
        name: 'Ігор',
        username: '@IgorWholesale',
    },
    {
        text: 'Швидкість відправки просто космічна, а як спілкуються — одне задоволення! Товар без єдиного дефекту. Молодці, так тримати!',
        imageSrc: avatar2.src,
        name: 'Андрій',
        username: '@AndriyBulkBuy',
    },
    {
        text: 'Я в захваті від цього магазину! Замовила оптом манікюрні набори — усе приїхало за два дні, комунікація супер швидка, а товар ідеальний, без жодного браку. Дякую, буду замовляти ще!',
        imageSrc: avatar3.src,
        name: 'Ольга',
        username: '@OlyaShopUA',
    },
    {
        text: 'Оце так магазин! Замовила партію туристичних наборів, усе приїхало за один день, комунікація взагалі на рівні, а брак — нуль! Дуже задоволена, буду брати ще й ще!',
        imageSrc: avatar4.src,
        name: 'Наталія',
        username: '@NataTradeUA',
    },
    {
        text: 'Відповіді моментальні, відправка швидка, а товар — бездоганний. Ніяких сюрпризів з браком, усе чітко. Дуже рекомендую!',
        imageSrc: avatar5.src,
        name: 'Сергій',
        username: '@SerhiyOptUA',
    },
    {
        text: 'Замовлення прийшло за рекордні два дні, комунікація з командою — на вищому рівні, а якість товару — без нарікань! Ніякого браку, усе супер. Беру ще!',
        imageSrc: avatar6.src,
        name: 'Віктор',
        username: '@ViktorTrade',
    },
    {
        text: 'Замовила оптом запальнички і кальяни — усе прилетіло за пару днів, без затримок! Комунікація топова, а якість — на 5+! Ніякого браку, дякую команді за професіоналізм!',
        imageSrc: avatar7.src,
        name: 'Марія',
        username: '@MarysiaShop',
    },
    {
        text: 'Ура, нарешті знайшла ідеальний магазин! Замовила ліхтарі оптом — усе приїхало швидко, спілкування з менеджером приємне, а браку немає взагалі. Дякую, ви найкращі!',
        imageSrc: avatar8.src,
        name: 'Олена',
        username: '@LenaWholesaleUA',
    },
    {
        text: 'Ви просто круті! Замовив оптом подурункові набори — усе прилетіло за два дні, спілкування з менеджером швидке, а товар без єдиного шматочка браку. Дякую, вже планую наступне замовлення!!',
        imageSrc: avatar9.src,
        name: 'Петро',
        username: '@PetroOpt',
    },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

const TestimonialsColumn = (props: {
    className?: string
    testimonials: typeof testimonials
    duration?: number
}) => (
    <div className={props.className}>
        <motion.div
            animate={{
                translateY: '-50%',
            }}
            transition={{
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
                duration: props.duration || 10,
            }}
            className={twMerge('flex flex-col gap-6 pb-6')}
        >
            {[...new Array(2)].fill(0).map((_, index) => (
                <React.Fragment key={index}>
                    {props.testimonials.map(
                        ({ text, imageSrc, name, username }) => (
                            <div key={username} className="card">
                                <div>{text}</div>
                                <div className="flex items-center gap-2 mt-5">
                                    <Image
                                        src={imageSrc}
                                        alt={name}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <div className="font-medium tracking-tight leading-5">
                                            {name}
                                        </div>
                                        <div className="leading-5 tracking-tight">
                                            {username}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </React.Fragment>
            ))}
        </motion.div>
    </div>
)

export const Testimonials = () => {
    return (
        <section id="customers">
            <div className="">
                <div className="section-header">
                    <h2 className="section-title mt-5">
                        Що кажуть наші клієнти
                    </h2>
                    <p className="section-description mt-5">
                        Дізнайтесь, чому наші оптові покупці обирають нас!
                        Швидка комунікація, надійна доставка та ідеальна якість
                        — ось що надихає їх повертатися знову й знову.
                    </p>
                </div>
                <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
                    <TestimonialsColumn
                        testimonials={firstColumn}
                        duration={15}
                    />
                    <TestimonialsColumn
                        testimonials={secondColumn}
                        className="hidden md:block"
                        duration={19}
                    />
                    <TestimonialsColumn
                        testimonials={thirdColumn}
                        className="hidden lg:block"
                        duration={17}
                    />
                </div>
            </div>
        </section>
    )
}
