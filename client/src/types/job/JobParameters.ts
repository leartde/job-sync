export type JobParameters = {
    JobType?: string | null;
    SearchTerm?: string | null;
    HasMultipleSpots?: boolean | null;
    IsTakingApplications?: boolean;
    MinimumPay?: number | null;
    IsRemote?: boolean | null;
    OrderBy?: string | null;
    PageSize?: number;
    PageNumber?: number;
    Pending?: boolean
};
