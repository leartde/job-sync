import { CreateAddress } from "../../types/address/CreateAddress.ts";
import api from "../../utils/api.ts";

const UpdateJobAddress = async (employerId: string, jobId: string, address: CreateAddress) => {
  const url =`/employers/${employerId}/jobs/${jobId}/address`;
  const form = new FormData();
form.append("Country", address.country || "");
  form.append("State", address.state || "");
  form.append("City", address.city || "");
  form.append("Street", address.street || "");
  form.append("ZipCode", address.zipCode?.toString() || "");
  try {
    return await api.put(url, form);
  }
  catch (error) {
    console.error("Error updating the job address:", address, error);
  }
}

export default UpdateJobAddress;
