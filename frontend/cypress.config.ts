import {defineConfig} from 'cypress';

// import * as dotenv from 'dotenv';
// dotenv.config({ path: '../frontend/.env' });

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173',
        // env: {
        //     apiUrl: process.env.VITE_API_URL, // expose API URL
        // },
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
    },
});
