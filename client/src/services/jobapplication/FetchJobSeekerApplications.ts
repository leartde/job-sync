import api from "../../utils/api.ts";

const FetchJobSeekerApplications = async(jobSeekerId: string) =>{
    const url = `/jobseekers/${jobSeekerId}/applications`;
    try{
        return await api.get(url);

    }
    catch (e){
        console.error(e);
    }
}

export default FetchJobSeekerApplications;