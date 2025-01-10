import axios from 'axios';

const refreshService = {
    refreshToken: async () => {
        try {
            const refresh = localStorage.getItem('refreshToken');
            const response = await axios.post(`http://localhost:8000/api/login/refresh/`, { refresh });
            localStorage.setItem('accessToken', response.data.access);
            return response.data.access;
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    },
};

export default refreshService;
