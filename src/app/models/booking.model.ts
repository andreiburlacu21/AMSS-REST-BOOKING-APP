import { BookingEntity } from "./booking-entity.model";

export class Booking {
    bookingId?: number;
    accountId?: number;
    locationId?: number;
    phoneNumber?: string;
    inDate?: string;
    outDate?: string;
    totalPrice?: number;
    bookingEntity?: BookingEntity
}