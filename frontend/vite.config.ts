import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: '0.0.0.0', // Listen on all network interfaces for LAN access
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000', // Use 127.0.0.1 for reliable local routing
                changeOrigin: true,
            }
        }
    }
})
