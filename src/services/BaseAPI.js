import axios from 'axios';

class BaseAPI {
  constructor() {
    // Define the base URL for all services
    this.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    // 1. Public Client: For requests that do not require authentication headers
    this.publicClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 2. Authenticated Client: For requests that require authentication headers
    this.authClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Initialize interceptors to inject headers dynamically
    this.initializeInterceptors();
  }

  initializeInterceptors() {
    this.authClient.interceptors.request.use(
      (config) => {
        // Retrieve token from storage (localStorage, sessionStorage, or state)
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
}

export default new BaseAPI();