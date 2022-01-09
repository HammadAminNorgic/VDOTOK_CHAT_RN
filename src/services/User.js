import axios from 'axios';
import {API_URL} from '../config/Constants';
// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false, // (NOTE: this will disable client verification)
//   cert: fs.readFileSync("./usercert.pem"),
//   key: fs.readFileSync("./key.pem"),
//   passphrase: "YYY"
// })

const User = {
  Signup: (data) => {
    console.log(data);
    return axios.post(`${API_URL}SignUp`,data,{
      headers: {
        "Content-Type": "application/json",
              "Accept": "application/json, text/plain"
      },

    });
  },
  Login: (data) => {
    return axios.post(`${API_URL}Login`,data,{
      headers: {
          "Content-Type": `application/json`,
          "Accept": "application/json, text/plain"


        },
    });
  },
  getGroups: (token) => {
    
    return axios.get(`${API_URL}/AllGroups`,{
        headers:{
          'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json, text/plain"

            // "Accept": 'application/json',
        }
    }); 
    // 
  },
  getAllUsers: (token) => {
    return axios.get(`${API_URL}/AllUsers`,{
        headers:{
          'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json',
            "Accept": 'application/json',
        }
    });
  },
  createChat: (data,token) => {
    return axios.post(`${API_URL}/CreateGroup`,data,{
        headers:{
          'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json',
            "Accept": 'application/json',
        }
    });
  },

};

export default User;
// AllGroups