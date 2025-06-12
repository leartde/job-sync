import { CreateAddress } from "../../types/address/CreateAddress.ts";
import api from "../../utils/api.ts";

const CreateJobAddress = async (employerId: string, jobId: string, address: CreateAddress) => {
  const url =`/employers/${employerId}/jobs/${jobId}/address`;
  const formData = new FormData();
  formData.append("Country", address.country || "");
  formData.append("State", address.state || "");
  formData.append("City", address.city || "");
  formData.append("Street", address.street || "");
  formData.append("ZipCode", address.zipCode?.toString() || "");
  try {
    return await api.post(url, formData);
  }
  catch (error) {
    console.error("Error updating the job address:", address, error);
  }
}

export default CreateJobAddress;
