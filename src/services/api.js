import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
});

// إضافة Token تلقائياً لكل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('[API Request]', config.method?.toUpperCase(), config.url, {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : null
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// معالجة الأخطاء - إعادة التوجيه عند انتهاء الصلاحية
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('[API Error]', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.warn('Token invalid or expired, logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;