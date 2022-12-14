import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/booking-service/booking.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})

export class BookingsComponent implements OnInit {
  isLoading: boolean = false;
  bookings: Booking[] = [];

  constructor(private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllBookings();
  }

  private getAllBookings() {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: resp => {
        this.bookings = resp;
        console.log(this.bookings);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  addBooking() {
    let dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '500px',
      data: {
        action: Action.ADD
      }
    });

    dialogRef.afterClosed().subscribe(newBooking => {
      if (newBooking) {
        this.notificationService.showSuccessNotification("Account added!");
        this.getAllBookings();
      }
    });

  }

  editBooking(booking: Booking) {

  }

  deleteBooking(booking: Booking) {

  }
}
