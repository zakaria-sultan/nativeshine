/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#002366', // Royal Blue
                    dark: '#001a4d',
                    light: '#334f85',
                },
                accent: {
                    DEFAULT: '#D4AF37', // Gold
                    dark: '#b08d2c',
                    light: '#f4e4bc',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
