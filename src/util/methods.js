
import {server} from './helper'
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


export function getById(url,id){return   axios.get(`${server.baseURL}/${url}/${id}`,); }
export function deleteData(url,id){
    return axios.delete(`${server.baseURL}/${url}/${id}`, );
}
export function verifyPassword(id,pass){
  return axios.get(`${server.baseURL}/users/verify/${id}/${pass}`, );
}
/********* interaction with incomes and expends docs***************** */
export function getHistoryIncomes(url,page,column,filter,sort){
  const p=page?page:'';
  const params=filter && sort?column+'/'+filter+'/s/'+sort:filter?column+'/'+filter+'/s':sort?'s/'+sort:'';
  return axios.get(`${server.baseURL}/${url}/${p}${params}`, );
}

export function  getFromDB(url){
  return axios.get(`${server.baseURL}/${url}`, );
}

