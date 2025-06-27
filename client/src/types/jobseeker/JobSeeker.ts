export type JobSeeker = {
    id: string;
    userId?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email?: string;
    phone: string;
    secondaryPhone?: string;
    address: string;
    gender: string;
    birthday?: Date;
    photoUrl?: string;
    resumeLink?: string;
    resumeName?: string;
    skills? : string[];

}
