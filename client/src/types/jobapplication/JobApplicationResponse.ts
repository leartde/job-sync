import { ResponseHeaders } from "../ResponseHeaders.ts";
import { JobApplication } from "./JobApplication.ts";

export type JobApplicationResponse = {
  headers: ResponseHeaders
  jobApplications: JobApplication[],
};
