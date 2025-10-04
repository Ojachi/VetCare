import axios from 'axios';
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiUrlAndroid ; // apiUrlWeb

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default axiosClient;
