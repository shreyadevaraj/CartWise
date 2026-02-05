import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (credentials) => api.post('/auth/authenticate', credentials);
export const register = (data) => api.post('/auth/register', data);
export const comparePrices = (pincode, items) => api.post(`/scraper/compare?pincode=${pincode}`, items);

export default api;
