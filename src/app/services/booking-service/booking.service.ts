import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingEntity } from 'src/app/models/booking-entity.model';
import { Booking } from 'src/app/models/booking.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Bookings";
  }

  getAllBookings(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(this.reqPath + "/all");
  }

  getBookingEntityById(bookingId: number): Observable<BookingEntity> {
    return this.httpClient.get<BookingEntity>(this.reqPath + "/Entity/" + bookingId);
  }

  addBooking(booking: Booking): Observable<Booking> {
    return this.httpClient.post<Booking>(this.reqPath + "/insert", booking);
  }

  updateBooking(booking: Booking): Observable<Booking> {
    return this.httpClient.put<Booking>(this.reqPath + "/update", booking);
  }

  deleteBooking(bookingId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.reqPath + "/" + bookingId);
  }
  checkAppointmentDate(date: any) {
    return this.httpClient.get<boolean>(this.reqPath + "/dateval" + date);
  }
  getCurrentDates(locationId: number) {
    return this.httpClient.get<string[]>(this.reqPath + `/dates/${locationId}`);
  }
  getBookingsByLocationId(locationId: number) {
    return this.httpClient.get<Booking[]>(this.reqPath + `/byLocationid/${locationId}`);
  }
}
