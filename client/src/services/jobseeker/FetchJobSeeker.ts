import api from "../../utils/api.ts";

const FetchJobSeeker = async (jobSeekerId: string) => {
        const url = `/jobseekers/${jobSeekerId}`;
        try{
            return  await api.get(url);

        }
        catch (error) {
            console.error("Error fetching job seeker data:", error);
            throw error;
        }
}

export default  FetchJobSeeker;