import api from "../../utils/api.ts";

const FetchEmployerByUserId = async (userId: string | undefined) => {
  try {
    const url = `/employers/users/${userId}`;
    return await api.get(url);
  } catch (e) {
    console.error("Error fetching employer: ", e);
  }
}

export default FetchEmployerByUserId;
