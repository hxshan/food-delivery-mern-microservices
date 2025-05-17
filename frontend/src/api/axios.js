import axios from "axios";
import {API_URL} from '../api/'
const BASE_URL= API_URL

export default axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})