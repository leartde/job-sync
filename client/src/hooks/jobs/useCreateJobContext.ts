import { useContext } from "react";
import { CreateJobContext } from "../../context/jobs/CreateJobContext.tsx";

const useCreateJobContext = () => {
  const context = useContext(CreateJobContext);
  if (!context) {
    throw new Error("useCreateJobContext must be used within a CreateJobProvider");
  }
  return context;
}
export default useCreateJobContext;
