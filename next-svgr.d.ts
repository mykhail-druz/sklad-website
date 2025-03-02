declare module 'next-svgr' {
    import { NextConfig } from 'next'

    const withSvgr: (config: NextConfig) => NextConfig
    export default withSvgr
}
