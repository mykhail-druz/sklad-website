'use client'
import Particles from '@/components/Particles/Particles'

export default function Banner() {
    return (
        <section className="relative rounded-3xl w-full max-w-[1440px] mx-auto h-[600px] bg-black">
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />
        </section>
    )
}
