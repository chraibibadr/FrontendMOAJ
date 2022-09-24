
import {server} from './helper'
export const token= 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmYzYWFlOWE0OWI1OTdlYTJjNTQzOGYiLCJlbWFpbCI6InNtQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbIkFwMSIsIkFwMiJdLCJpYXQiOjE2NjM4ODE1NjgsImV4cCI6MTY2NDA1NDM2OH0.tXy40tSc1jID_ZgL1-0jA5tluY6UBlXa6Lp0YQ0A0rU';
import { axios } from 'boot/axios';
export function createObject(url,object){
    return axios.post(`${server.baseURL}/${url}`,object,);
}
 export  function getAll(url,page,idAuth,column,filter,sort,colSort){
  const p=idAuth?page+'/'+idAuth:page?page:'';
  const params=filter && sort?column+'/'+filter+'/s/'+sort:filter?column+'/'+filter+'/s':colSort?
  's/'+sort+'/'+colSort
  :sort?'s/'+sort:'';
       return    axios.get(`${server.baseURL}/${url}/${p}${params}`,);
    }

 export function updateObject(url,object,id){
   return axios.put(`${server.baseURL}/${url}/${id}`,object,);
 }


export function getById(url,id){
  
 return   axios.get(`${server.baseURL}/${url}/${id}`,);
     
   }
export function deleteData(url,id){
    return axios.delete(`${server.baseURL}/${url}/${id}`, );
}
export function verifyPassword(id,pass){
  return axios.get(`${server.baseURL}/users/verify/${id}/${pass}`, );
}
export function getLastIncome(url){
  return axios.get(`${server.baseURL}/${url}`, );
}

export function getDailyIncomes(url){
  return axios.get(`${server.baseURL}/${url}`,);
}

export function getHistoryIncomes(url,page,column,filter,sort){
  const p=page?page:'';
  const params=filter && sort?column+'/'+filter+'/s/'+sort:filter?column+'/'+filter+'/s':sort?'s/'+sort:'';
  return axios.get(`${server.baseURL}/${url}/${p}${params}`, );
}
export function  getSumNetofIncomes(url){
  return axios.get(`${server.baseURL}/${url}`, );
}
export function getUserAuth(){
 return  getById('users','62f3aae9a49b597ea2c5438f');
}