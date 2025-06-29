import api from "../../utils/api.ts";

const   DeleteUser = async (userId: string)=>{
    try {
       return await api.delete(`authentication/users/${userId}`);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

export default DeleteUser;
