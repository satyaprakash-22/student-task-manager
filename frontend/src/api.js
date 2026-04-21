import axios from "axios";

const API = axios.create({
  baseURL: "https://student-task-manager-931x.onrender.com",
});

export default API;