import axios from 'axios';
import authService from './components/RefreshService.tsx';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });

    failedQueue = [];
};

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Obsługa błędu 401
            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    try {
                        const newToken = await new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        });
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } catch (err) {
                        return Promise.reject(err);
                    }
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const newAccessToken = await authService.refreshToken();
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    return axios(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';  // Zamiast useNavigate
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;
