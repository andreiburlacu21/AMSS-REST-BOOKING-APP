import { Booking } from "./booking.model";
import { Location } from "./location.model";
import { Review } from "./review.model";

export class LocationWithAllDetails {
    location?: Location;
    reviews: Review[] = [];
    bookings: Booking[] = [];
    images: string[] = [];
}