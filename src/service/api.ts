import { getItem } from '@/helpers/storage';
import axios from 'axios';

axios.defaults.baseURL = 'https://dummyjson.com';

axios.interceptors.request.use(config => {
	const token = getItem('token');
	const authorization = token ? `Token ${token} ` : '';
	config.headers.Authorization = authorization;
	return config;
});

export default axios;
