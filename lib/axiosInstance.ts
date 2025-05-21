import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `https://api.wedly.info/api`,
    headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401 || status === 403) {
                console.warn('Unauthorized! Redirecting to login...');
                // Ví dụ: redirect khi token hết hạn
                // window.location.href = '/login';
            }

            return Promise.reject(data?.message || 'Request failed!');
        }

        return Promise.reject(error.message || 'Network error!');
    }
);

export default axiosInstance;