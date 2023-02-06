import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/models/booking.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Email";
  }

  sendConfirmationMail(booking: Booking) {
    return this.httpClient.post(this.reqPath + "/booking", booking);
  }

  sendCode(key: string, booking: Booking) {
    console.log(key);
    return this.httpClient.post(this.reqPath + "/confirmationBooking/" + key, booking);
  }

  sendFinishedEmail() {
    return this.httpClient.get(this.reqPath + "/finished");
  }
}
