import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
export default defineConfig(({command})=>({plugins:[react(),tailwind()],define:{'process.env.NODE_ENV':JSON.stringify(command==='build'?'production':'development')},server:{proxy:{'/api':'http://127.0.0.1:3001'}},build:{target:'es2022'}}));
