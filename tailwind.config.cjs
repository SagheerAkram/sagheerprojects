/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'electric-blue': '#00d4ff',
                'violet-glow': '#7c3aed',
                'deep-violet': '#4c1d95',
                'neon-purple': '#a855f7',
                'space-dark': '#03040a',
                'card-bg': 'rgba(10, 12, 30, 0.7)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'gradient-x': 'gradient-x 8s ease infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { 'box-shadow': '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
                    '100%': { 'box-shadow': '0 0 20px #7c3aed, 0 0 40px #7c3aed' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
