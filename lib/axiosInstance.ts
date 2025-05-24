import axios from 'axios';

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// Chỉ redirect về /login nếu pathname bắt đầu bằng /manage
const shouldRedirectToLogin = (pathname: string) => {
    return pathname.startsWith('/manage');
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/auth/refresh-token')) {
            localStorage.removeItem('accessToken');
            if (typeof window !== 'undefined' && shouldRedirectToLogin(window.location.pathname)) {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newToken = refreshResponse.data.accessToken;
                localStorage.setItem('accessToken', newToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (err: any) {
                processQueue(err, null);
                localStorage.removeItem('accessToken');

                if (typeof window !== 'undefined' && shouldRedirectToLogin(window.location.pathname)) {
                    window.location.href = '/login';
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
