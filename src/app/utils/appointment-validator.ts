import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map } from "rxjs";
import { BookingService } from "../services/booking-service/booking.service";
import { DateHelper } from "./date-helper";

export class AppointmentValidator {
    static checkDate(Service: BookingService, editData?: any): AsyncValidatorFn {
        return (control: AbstractControl) => {
            var data = DateHelper.getDate(control.value);
            return Service.checkAppointmentDate(data)
                .pipe(
                    map(date => {
                        if (data == editData) return null;
                        if (control.value < Date.now()) return { date: true };
                        return date ? null : { date: true }
                    }
                    )
                );
        }
    }
}