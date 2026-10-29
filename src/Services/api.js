import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `http://127.0.0.1:8000/api`,
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  const isAuthenticated = localStorage.getItem('token') || localStorage.getItem('userToken');
  // console.log("isAuthenticated",isAuthenticated)

  if (isAuthenticated && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${isAuthenticated}`;
  }

  return config;
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error?.config?.url?.includes('/customer/login');
    if (error?.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),

  upload: (url, formData) =>
    instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(responseBody),

  customPost: (url, body, token) => {
    return instance.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }).then(responseBody);
  },
};

export default requests;
