//import axios from 'axios';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333/'
})