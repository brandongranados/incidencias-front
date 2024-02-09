import axios from 'axios';
import propiedades from './propiedades.json';

const ajax = axios.create({
  baseURL: propiedades.URL_SERVER,
});

export default ajax;
