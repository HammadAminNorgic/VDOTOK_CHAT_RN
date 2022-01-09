import axios from 'axios';
import {API_URL} from '../config/Constants';

const Group = {
    getGroups: (data,token) => {
      return axios.post(`${API_URL}AllGroups`,{},{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            "Accept": 'application/json',
          }
      });
    },
    getAllUsers: (data,token) => {
      console.log(data,token);
        return axios.post(`${API_URL}AllUsers`,data,{
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json, text/plain"
            }
        });
      },
      createNewGroup: (data,token) => {
        return axios.post(`${API_URL}CreateGroup`,data,{
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            "Accept": 'application/json',
            }
        });
      },
      renameGroup: (data,token) => {
        return axios.post(`${API_URL}RenameGroup`,data,{
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            "Accept": 'application/json',
            }
        });
      },
      deleteGroup: (data,token) => {
        return axios.post(`${API_URL}DeleteGroup`,data,{
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            "Accept": 'application/json',
            }
        });
      },
   

  };
  export default Group;