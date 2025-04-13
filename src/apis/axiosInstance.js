import axios from "axios";

const axiosInstanceWithHeader = axios.create({
  baseURL: "http://35.202.85.190:8080/",
  headers: {
    Authorization: `Bearer `,
  },
});

const axiosInstanceNoHeader = axios.create({
  baseURL: "http://35.202.85.190:8080/",
});
export { axiosInstanceNoHeader, axiosInstanceWithHeader };
