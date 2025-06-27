import { RegisterEmployer } from "../../types/employer/RegisterEmployer.ts";
import api from "../../utils/api.ts";

type CreateEmployerProps = {
    email: string;
    password: string;
    employer: RegisterEmployer
}
const CreateEmployer = async ({email, password, employer}:CreateEmployerProps) =>{
    const url = '/authentication/register/employer';
    const formData = new FormData();

    formData.append("Email",email);
    formData.append("Password",password);
    formData.append("Role","Employer");

    formData.append("Employer.Name",employer.name || "");
    formData.append("Employer.Email",employer.email || "");
    formData.append("Employer.Description",employer.description || "");
    formData.append("Employer.Headquarters",employer.headquarters || "");
    formData.append("Employer.Website",employer.website || "");
    formData.append("Employer.Industry",employer.industry || "");
    formData.append("Employer.Founded",employer.founded?.toString())
    if (employer.photo){
        formData.append("Employer.Photo",employer.photo);
    }
    try{
        return await api.post(url, formData)
    }
    catch (e){
        console.error("Error creating the employer account:", e)
    }
};

export default CreateEmployer;
