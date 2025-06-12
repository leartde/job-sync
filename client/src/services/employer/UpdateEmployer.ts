import { RegisterEmployer } from "../../types/employer/RegisterEmployer.ts";
import api from "../../utils/api.ts";

const UpdateEmployer = async(employerId:string, employer: RegisterEmployer) => {
    const url = `/employers/${employerId}`;
    const formData = new FormData();

    formData.append("Name", employer.name || "");
    formData.append("Email", employer.email || "");
    formData.append("Description", employer.description || "");
    formData.append("Headquarters", employer.headquarters || "");
    formData.append("Website", employer.website || "");
    formData.append("Phone", employer.phone || "");
    formData.append("Industry", employer.industry || "");
    formData.append("Founded", employer.founded?.toString() || "");

    if (employer.photo) {
        formData.append("Photo", employer.photo);
    }

    try {
        return await api.put(url, formData);
    } catch (e) {
        console.error("Error updating the employer account:", e);
        throw e;
    }
}

export default UpdateEmployer
