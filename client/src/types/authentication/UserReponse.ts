import { User } from "./User.ts";
import { ResponseHeaders } from "../ResponseHeaders.ts";

export type UserResponse = {
  users : User[];
  headers: ResponseHeaders;
}
