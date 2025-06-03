import useJobApplicationParametersContext from "../../../hooks/jobapplications/useJobApplicationParametersContext.ts";
import SearchBar from "../../SearchBar.tsx";

const ApplicantsSearch = () => {
  const { updateJobApplicationParameters } = useJobApplicationParametersContext();
  return (
    <SearchBar
      placeholder="Search by name"
      updateParameters={updateJobApplicationParameters}
    />
  );
}

export default ApplicantsSearch;
