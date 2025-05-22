import axios from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

// Request Interceptor: Gắn accessToken vào headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Tự động gọi refresh token nếu token hết hạn
axiosInstance.interceptors.response.use(
    response => response.data,
    async (error) => {
        const originalRequest = error.config;

        // const isTokenExpired =
        //     error.response?.status === 401 &&
        //     error.response?.data?.message === 'jwt expired';

        // if (isTokenExpired && !originalRequest._retry) {
        //     // Thực hiện refresh token
        // }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
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
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('accessToken');
                if (typeof window !== 'undefined') {
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
