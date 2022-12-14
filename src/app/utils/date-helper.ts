import { Injectable } from "@angular/core";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";
import { Booking } from "../models/booking.model";
import { BookingService } from "../services/booking-service/booking.service";

export class DateHelper {
    private dictionary!: Map<number | undefined, [string | undefined, string | undefined]>;
    public inDate!: Date;

    constructor(private service: BookingService, locationId: number) {
        this.dictionary = new Map();
        service.getBookingsByLocationId(locationId).subscribe(bookings =>
            bookings.forEach(value => this.dictionary.set(value.bookingId, [value.inDate, value.outDate]
            )));
    }
    static getDate(date: any) {
        return (new Date(date)).toLocaleDateString().replace("/", "-").replace("/", "-");
    }

    myFilterIn = (d: Date): boolean => {
        var set = true;
        this.dictionary.forEach(x => {

            var date1 = new Date(x[0] + "");
            var date2 = new Date(x[1] + "");
            if ((d >= date1 && d <= date2)) {
                set = false;
            }
        });
        return set;
    }

    myFilterOut = (d: Date): boolean => {
        var set = true;
        this.dictionary.forEach(x => {

            var date1 = new Date(x[0] + "");
            var date2 = new Date(x[1] + "");
            if (this.inDate < date1) {
                set = false;
            }
        });
        if(d < this.inDate)
            return false;
        return set;
    }

    //   dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    //     var date = DateHelper.getDate(cellDate);
    //     const bool: boolean = (this.bookings.indexOf(date) > -1);
    //     return bool ? 'custom-date-class' : '';
    //   };
}