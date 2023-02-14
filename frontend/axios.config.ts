import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
	withCredentials: true,
});
