import axios from "axios";

const axiosInstance = axios.create({
  baseURL: { DOCKTALK_API_BASE_URL },
  headers: {
    Authorization: `Bearer {DOCKTALK_API_ACCESS_TOKEN}`,
  },
});

export { axiosInstance };
