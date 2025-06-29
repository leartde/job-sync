import api from "../../utils/api";

type Token  = {
    accessToken: string;
    refreshToken: string;

}
const GetTokens = async ()=>{
  return await api.get("/authentication/me");

}

export default GetTokens;
