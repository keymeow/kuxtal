/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                // Core brand
                primary: "#2260FF",
                'primary-dark': "#0048d6",
                secondary: "#d4e5ef",
                // Surface hierarchy (design system)
                background: "#f8f9ff",
                surface: "#ffffff",
                'surface-low': "#eef2f7",
                // Text
                textos: "#434656",
                blanco: "#ffffff",
                negro: "#000000",
            },
            fontFamily: {
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                'kuxtal': '1.25rem',   // 20px — primary containers
                'kuxtal-sm': '0.5rem', // 8px  — chips & nested buttons
            },
            boxShadow: {
                // Blue-tinted ambient shadow (design.md §4)
                'soft': '0 12px 40px rgba(0, 72, 214, 0.06)',
                'glass': '0 4px 24px rgba(0, 72, 214, 0.04)',
            },
            letterSpacing: {
                'display': '-0.02em',
            },
        },
    },
    plugins: [],
}
