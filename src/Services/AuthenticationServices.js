import requests from "./api";

const AuthenticationServices = {
    userLogin:  async (body) => {
        return requests.post("/customer/login", body);
      },
      addUser: async(body) => {
        return requests.post("/admin/signup", body);
      },

}
export default AuthenticationServices;
