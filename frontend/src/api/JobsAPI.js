import axios from "axios";
import apiConfig from "./config";

const instance = axios.create({
  baseURL: apiConfig.baseURI
});

class JobsAPI {
  static async getJob(id) {
    let response = await instance.get(`/jobs/${id}`);
    return response.data;
  }

  static async getJobs() {
    let response = await instance.get("/jobs");
    return response.data;
  }
}

export default JobsAPI;