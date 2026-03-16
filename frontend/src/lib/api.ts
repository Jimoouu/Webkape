import axios from 'axios';

const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:8000/api/`;
    }
    return 'http://127.0.0.1:8000/api/';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('admin_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_refresh');
                localStorage.removeItem('is_staff');
                localStorage.removeItem('user_id');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
