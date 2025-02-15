import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import requests from "./api";

const AuthenticationServices = {
  userLogin: async (body) => {
    return requests.post("/customer/login", body);
  },
  userSignUp: async (body) => {
    return requests.post("/customer/signup", body);
  },
  addUser: async (body) => {
    return requests.post("/admin/signup", body);
  },
  ForgotPassword: async (body) => {
    return requests.post("/forget-password", body);
  },
  Update_Password_Via_Mail: async (body) => {
    return requests.post("/update-password-via-mail", body);
  },
  getUserDetails: async (id) =>{
    return requests.get(`/user/${id}/get-by-id`);
  },
  tokenVerify: async (token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await requests.customPost("/authenticate", {}, token); 

      return response;
    } catch (error) {
      console.error("Error in tokenVerify:", error.response ? error.response.data : error.message);
      throw error;  
    }
  },

}
export default AuthenticationServices;
