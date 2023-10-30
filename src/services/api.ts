import axios from 'axios';

const api = axios.create({
  baseURL: "https://us-central1-tem-que-funcionar.cloudfunctions.net/",
});

export default api;