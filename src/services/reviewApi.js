// reviewApi.js — FIXED
// Location: src/services/reviewApi.js

import axios from "axios";

const reviewAPI = axios.create({
    baseURL: "http://localhost:8081"
});

reviewAPI.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default reviewAPI;