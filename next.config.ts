import type { NextConfig } from 'next'
import withSvgr from 'next-svgr'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

export default withSvgr(nextConfig)
