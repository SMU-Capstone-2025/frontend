import axios from "axios";

const axiosInstanceWithHeader = axios.create({
  baseURL: "http://172.17.64.116:8080",
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwicm9sZSI6IlJPTEVfTUFOQUdFUiIsImlhdCI6MTc0NDE4MTI2MiwiZXhwIjoxNzQ0MTgzMDYyfQ.nNBt4xxN9bI_OqN-Z-IxAF1KY_GFkUMmKhhvV9yKS8M`,
  },
});

const axiosInstanceNoHeader = axios.create({
  baseURL: "http://172.17.64.116:8080",
});
export { axiosInstanceNoHeader, axiosInstanceWithHeader };
