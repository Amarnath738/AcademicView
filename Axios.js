import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'; // Set the base URL for all requests
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default axios;
