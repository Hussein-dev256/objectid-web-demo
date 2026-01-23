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
                charcoal: {
                    900: '#0A0A0A',
                    800: '#121212',
                    700: '#1A1A1A',
                },
                emerald: {
                    500: '#10B981',
                    600: '#059669',
                },
                crimson: {
                    500: '#DC2626',
                    600: '#B91C1C',
                },
            },
        },
    },
    plugins: [],
}
