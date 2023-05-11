import axios from "axios";
import jwt from 'jwt-decode' // import dependency

const API_URL = "http://localhost:8080/";

class AuthService {

  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {

        console.log(response.data);

        const auth = response.data['jwt'];
        const token = auth.replace("Bearer ", "");
        const decodedJwt =  jwt(token);        
        if (auth) {
          localStorage.setItem("user", JSON.stringify(decodedJwt));
          localStorage.setItem("userToken", JSON.stringify(token));
          }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
  }

  register(firstname, lastname, email, password) {
    return axios.post(API_URL + "sign-up", {
      firstname,
      lastname,
      email,
      password
    })
  }

  confirm(code, email, password) {
    return axios.post(API_URL + "sign-up/confirm", {
      code,
      email,
      password
    }).then(response => {

      console.log(response.data);

      const auth = response.data['jwt'];
        const token = auth.replace("Bearer ", "");
        const decodedJwt =  jwt(token);
        console.log("УРА" + decodedJwt)
        
        if (auth) {
          localStorage.setItem("user", JSON.stringify(decodedJwt));
          localStorage.setItem("userToken", JSON.stringify(token));    
        }

      return response.data;
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getCurrentJwt() {
    return JSON.parse(localStorage.getItem('userToken'));
  }

}

export default new AuthService();
