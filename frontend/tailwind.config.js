/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                onyx: {
                    950: '#030304',
                    900: '#060709',
                    850: '#090B0F',
                    800: '#0E1117',
                    750: '#141822',
                    700: '#1A202C',
                },
                charcoal: {
                    900: '#050608',
                    800: '#0A0C10',
                    700: '#12151C',
                },
                emerald: {
                    400: '#34D399',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                },
                crimson: {
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                },
            },
            boxShadow: {
                'liquid': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
                'liquid-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), 0 0 25px rgba(16, 185, 129, 0.25), 0 10px 30px rgba(0, 0, 0, 0.8)',
                'liquid-btn': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.3), 0 8px 20px -4px rgba(16, 185, 129, 0.4)',
            },
        },
    },
    plugins: [],
}

