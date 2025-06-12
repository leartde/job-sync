export type Job = {
    id: string;
    title: string;
    employer: string;
    employerId: string;
    description: string
    address?: string;
    city?: string;
    createdAt: string;
    pay: string;
    hourlyPay?: number;
    type:string;
    imageUrl? : string;
    isTakingApplications: boolean;
    hasMultipleSpots: boolean;
    skills?: string[];
    benefits?: string[];
}
