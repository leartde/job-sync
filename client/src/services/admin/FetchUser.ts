import api from "../../utils/api.ts";

const FetchUser = async (userId: string)=>{
  const url = `authentication/users/${userId}`;
  try{
    return await api.get(url);
  }
  catch (error){
    console.error("Error fetching user:", error);
  }
}

export default FetchUser;
