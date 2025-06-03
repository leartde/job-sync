import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import { createContext, useState } from "react";

type JobApplicationResponseHeadersContextType = {
    headers: ResponseHeaders;
    updateHeaders: (headers: ResponseHeaders) => void;
}

const DefaultJobApplicationResponseHeaders: ResponseHeaders = {
    HasNext: false,
    HasPrevious: false,
    PageSize: 10,
    TotalPages: 0,
    CurrentPage: 1,
    TotalCount: 0,
};

export const JobApplicationResponseHeadersContext = createContext<JobApplicationResponseHeadersContextType>({
    headers: DefaultJobApplicationResponseHeaders,
    updateHeaders: () => {}
});

export function JobApplicationResponseHeadersProvider({ children }: { children: React.ReactNode }) {
    const [headers, setHeaders] = useState<ResponseHeaders>(DefaultJobApplicationResponseHeaders);

    const updateHeaders = (newHeaders: ResponseHeaders) => {
        setHeaders(newHeaders);
    }

    return (
        <JobApplicationResponseHeadersContext.Provider value={{ headers, updateHeaders }}>
            {children}
        </JobApplicationResponseHeadersContext.Provider>
    );
}
