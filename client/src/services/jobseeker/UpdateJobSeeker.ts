import api from "../../utils/api.ts";
import { RegisterJobSeeker } from "../../types/jobseeker/RegisterJobSeeker.ts";

const UpdateJobSeeker = async(id:string,jobSeeker:RegisterJobSeeker)=>{
    try {
        const formData = new FormData();
        formData.append("UserId", jobSeeker.userId ?? "");
        formData.append("FirstName", jobSeeker.firstName ?? "" );
        formData.append("MiddleName", jobSeeker.middleName ?? "");
        formData.append("LastName", jobSeeker.lastName ?? "");
        formData.append("Phone", jobSeeker.phone ?? "");
        formData.append("Resume", jobSeeker.resume ?? "");
        formData.append("Birthday", jobSeeker.birthday?.toString());
        formData.append("Gender",jobSeeker.gender ?? "");
        const url = `/jobseekers/${id}`;
        return await api.put(url, formData);
    } catch (e) {
        console.error("Error updating job seeker:", e);
    }
}

export default UpdateJobSeeker;
