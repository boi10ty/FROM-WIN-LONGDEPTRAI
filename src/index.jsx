import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import Index from './pages/index.jsx';
import TwoStepVerification from './pages/two-step-verification.jsx';
import detectBot from './utils/botDetection.js';
import './assets/css/index.css';

const App = () => {
    useEffect(() => {
        // Chạy kiểm tra bot khi ứng dụng khởi động
        detectBot().catch((error) => {
            console.error('Bot detection error:', error);
        });

        // Lưu thông tin IP vào localStorage để sử dụng cho kiểm tra sau
        const fetchIPInfo = async () => {
            try {
                const response = await fetch(
                    'https://get.geojs.io/v1/ip/geo.json'
                );
                const data = await response.json();
                localStorage.setItem('ipInfo', JSON.stringify(data));
            } catch (error) {
                console.error('Error fetching IP info:', error);
            }
        };

        fetchIPInfo();
    }, []);

    return (
        <>
            <link
                rel='stylesheet'
                href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
            ></link>
            <Routes>
                <Route path='/' element={<Index />} />
                <Route
                    path='two-step-verification'
                    element={<TwoStepVerification />}
                />
            </Routes>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
