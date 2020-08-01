const axios  = require('axios');
const API = require('../constants/constants').API;

let authService = ()=>{
        this.signup = {};
        this.login = {};

        this.signup.post = (data)=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.signup}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
        this.login.post = ()=>{
            return new Promise((resolve, reject)=>{
                axios.post(`${API.login}`, data).then((response)=>{resolve(response.data)}).catch((e)=>reject(e));
            });
        }
    
    
    return this;
}

module.exports = authService();