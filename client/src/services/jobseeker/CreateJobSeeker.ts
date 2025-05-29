import { RegisterJobSeeker } from "../../types/jobseeker/RegisterJobSeeker";
import api from "../../utils/api.ts";

type CreateJobSeekerProps = {
    email: string;
    password: string;
    role: string;
    jobSeeker: RegisterJobSeeker;
};

const CreateJobSeeker = async ({ email, password, jobSeeker, role }: CreateJobSeekerProps) => {
    try {
        const formData = new FormData();

        formData.append("Email", email);
        formData.append("Password", password);
        formData.append("Role", "JobSeeker");

        formData.append("JobSeeker.FirstName", jobSeeker.firstName || "");
        formData.append("JobSeeker.MiddleName", jobSeeker.middleName || "");
        formData.append("JobSeeker.LastName", jobSeeker.lastName || "");
        formData.append("JobSeeker.Gender", jobSeeker.gender || "");
        const birthday = jobSeeker.birthday ? new Date(jobSeeker.birthday) : new Date();
        const formattedBirthday = `${birthday.getFullYear()}-${String(birthday.getMonth()+1).padStart(2, '0')}-${String(birthday.getDate()).padStart(2, '0')}`;

        formData.append("JobSeeker.Birthday", formattedBirthday);
        formData.append("JobSeeker.Phone", jobSeeker.phone || "");
        formData.append("JobSeeker.Address.Country",jobSeeker.address?.country || "")
        formData.append("JobSeeker.Address.Street", jobSeeker.address?.street || "");
        formData.append("JobSeeker.Address.City", jobSeeker.address?.city || "");
        formData.append("JobSeeker.Address.State", jobSeeker.address?.state?.toString() || "");
        formData.append("JobSeeker.Address.ZipCode", jobSeeker.address?.zipCode?.toString() || "");


        const skills = Array.isArray(jobSeeker.skills) ? jobSeeker.skills : [];

        skills.forEach(skill => {
            formData.append('JobSeeker.Skills', skill);
        });

        if (jobSeeker?.resume) {
            formData.append("JobSeeker.Resume", jobSeeker.resume);
        }

        const url = `/authentication/register/jobseeker`;

        return await api.post(url, formData);

    } catch (e) {
        console.error("Error adding job seeker:", e);
    }
};

export default CreateJobSeeker;
