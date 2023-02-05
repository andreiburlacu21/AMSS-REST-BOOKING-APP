import { Booking } from "./booking.model";
import { Menu } from "./menu.model";
import { Review } from "./review.model";
import { Table } from "./table.model";
import { Location } from "./location.model"

export class RestaurantWithAllDetails {
    menus?: Menu[];
    reviews?: Review[];
    bookings?: Booking[];
    tables?: Table[];
    location?: Location;
}