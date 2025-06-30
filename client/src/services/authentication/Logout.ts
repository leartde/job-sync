import api from "../../utils/api";

const Logout = async () => {
    const url = `/authentication/logout`;

    try{
        return await api.post(url,{},{
            withCredentials: true,
        });
    }
    catch (e){
        console.error("Error logging out:", e);
    }
}

export default Logout;
