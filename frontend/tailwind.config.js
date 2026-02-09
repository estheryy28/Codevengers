/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce': 'bounce 1s infinite',
                'spin': 'spin 1s linear infinite',
                'fadeIn': 'fadeIn 0.5s ease-out',
                'success': 'success 0.3s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                success: {
                    '0%': { backgroundColor: 'rgb(147, 51, 234)' },
                    '100%': { backgroundColor: 'rgb(34, 197, 94)' },
                },
            },
            transitionDuration: {
                '1500': '1500ms',
            },
            letterSpacing: {
                'widest': '0.3em',
            },
        },
    },
    plugins: [],
}
