import { CreateAddress } from "../address/CreateAddress.ts";

export type AddJob = {
  employerId?: string;
  title?: string;
  description?: string;
  type?: string;
  hourlyPay?: number;
  address?: CreateAddress| null
  skills?: string[];
  benefits?: string[];
  hasMultipleSpots?: boolean;
  image?: File | undefined
  remote?: boolean;
}
