import { Account } from "./account.model";
import { Booking } from "./booking.model";
import { Review } from "./review.model";

export class AccountEntityDto extends Account {
    reviews?: Review[];
    bookings?: Booking[];
}