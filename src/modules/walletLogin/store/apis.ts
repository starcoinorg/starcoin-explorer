// @ts-ignore
import client from '@/utils/client';
import seedClient from '@/utils/seed-client';
import { getNetwork } from '@/utils/helper';


const network = getNetwork();

export const login = (params: any) =>
  client.get(`v2/user/login/${params.address}/?sign=${params.sign}`);

export const getUserInfo = (params: any) =>
  client.get(`v2/user/show/${params.address}`);

export const logout = (params: any) =>
  client.get(`v2/user/logout/${params.address}/`);


export const updateUserInfo = (params: any) =>{
    const address = params.address;
    delete params.address;
    return  client.get(`v2/user/update/${address}/`, params);
}
export const deleteUserInfo = (params: any) =>{
  const address = params.address;
  delete params.address;
  return  client.get(`v2/user/destroy/${address}/`, params);
}

export const apiKeyList = (params: any) =>{
  return  client.get(`v2/user/apikey/list/`, params);
}

export const addApiKey = (params: any) =>{
  const app_name = params.app_name;
  delete params.app_name;
  return  client.get(`v2/user/apikey/add/${app_name}`, params);
}

export const updateApiKey = (params: any) =>{
  const app_name = params.app_name;
  delete params.app_name;
  return  client.get(`v2/user/apikey/update/${app_name}`, params);
}

export const removeApiKey = (params: any) =>{
  return  client.get(`v2/user/apikey/remove`, params);
}

export const getQrCode = (params: any) =>{
  return  client.get(`v2/user/code/`, params);
}

export const updateUserName = (params: any) =>{
  const newAddress = params.new;
  delete params.new;
  return  client.get(`v2/user/update/address/${newAddress}`, params);
}