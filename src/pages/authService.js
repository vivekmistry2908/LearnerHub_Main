// authService.js
import axios from 'axios';
import axiosInstance from './axiosInstance';

let accessToken = sessionStorage.getItem('accessToken');
let refreshToken = sessionStorage.getItem('refreshToken');

export const setAccessToken = (newAccessToken, newRefreshToken) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    sessionStorage.setItem('accessToken', newAccessToken);
    sessionStorage.setItem('refreshToken', newRefreshToken);
};

export const getAccessToken = () => {
    return accessToken || sessionStorage.getItem('accessToken');
};

export const refresh_Token = async () => {
    const token = refreshToken || sessionStorage.getItem('refreshToken');
    if (!token) throw new Error('No refresh token available');

    const response = await axiosInstance.post('https://api.lernen-hub.de/api/token/refresh/', { 
        "refresh":token
     });
    if (response.status === 200) {
        // console.log("Refreshed token",response.data)
        // const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        setAccessToken(response.data.access, response.data.refresh);
    } else {
        throw new Error('Unable to refresh token');
    }
};

