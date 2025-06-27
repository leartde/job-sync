import api from "../../utils/api.ts";

const FetchJobSeekerByUserId = async (userId: string) => {
  const url = `/jobseekers/users/${userId}`;
  try{
    return  await api.get(url);

  }
  catch (error) {
    console.error("Error fetching job seeker data:", error);
    throw error;
  }
}

export default  FetchJobSeekerByUserId;
