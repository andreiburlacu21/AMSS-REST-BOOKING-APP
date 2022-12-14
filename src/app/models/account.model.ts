import { Role } from "./role";

export class Account {
    accountId?: number;
    userName?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    role?: Role;
}