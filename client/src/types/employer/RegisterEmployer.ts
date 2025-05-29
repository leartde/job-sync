export type RegisterEmployer = {
    userId?: string;
    name?: string;
    email?: string;
    description?: string;
    headquarters?: string;
    website?: string;
    industry?: string;
    founded?: Date;
    phone?: string;
    secondaryPhone?: string;
    photo?: File
    ;
}