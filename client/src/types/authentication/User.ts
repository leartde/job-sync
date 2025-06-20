export type User = {
    id: string;
    email: string;
    password?: string;
    role: "JobSeeker" | "Employer" | "Admin";
    createdAt?: Date;
    emailConfirmed?: boolean;

}
