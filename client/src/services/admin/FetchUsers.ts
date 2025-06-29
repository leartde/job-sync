import api from "../../utils/api.ts";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import { User } from "../../types/authentication/User.ts";
import { UserResponse } from "../../types/authentication/UserReponse.ts";

export type UserParameters = {
  Role?: string;
  SearchTerm?: string;
  PageNumber?: number;
  PageSize?: number;
}
const FetchUsers = async ({Role, SearchTerm, PageNumber, PageSize}:UserParameters)=>{
  let url = "authentication/users?";
  if(Role && Role.trim() !== ""){
    url += `&Role=${Role}`;
  }
  if(SearchTerm && SearchTerm.trim() !== ""){
    url += `&SearchTerm=${SearchTerm}`;
  }
  if(PageNumber && PageNumber > 0){
    url += `&PageNumber=${PageNumber}`;
  }
  if(PageSize && PageSize > 0){
    url += `&PageSize=${PageSize}`;
  }
  try{
    const response =  await api.get(url);
    const headers = response.headers["x-pagination"];
    const parsedHeader : ResponseHeaders = JSON.parse(headers);
    const users : User[] = response.data;
    const data : UserResponse = {
      users: users,
      headers: parsedHeader
    };
    return data;
    }
  catch (error){
    console.error("Error fetching all users:", error);
  }
}

export default FetchUsers;
