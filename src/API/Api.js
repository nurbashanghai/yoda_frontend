import axios from 'axios';

const AxiosInstance = axios.create({
	baseUrl: 'http//localhost:8080'
});

export default AxiosInstance;