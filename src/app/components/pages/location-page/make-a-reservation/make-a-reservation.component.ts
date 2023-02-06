import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/booking-service/booking.service';
import { MailService } from 'src/app/services/mail-service/mail.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { AccountDialogComponent } from '../../admin-pages/accounts/account-dialog/account-dialog.component';

@Component({
  selector: 'app-make-a-reservation',
  templateUrl: './make-a-reservation.component.html',
  styleUrls: ['./make-a-reservation.component.scss']
})

export class MakeAReservationComponent implements OnInit {
  booking: Booking = new Booking();
  confirmationMailSent: boolean = false;
  enteredCode: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
    private bookingService: BookingService,
    public dialogRef: MatDialogRef<AccountDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();
    this.setAvailabilityDate();
  }

  private getPassedData() {
    this.booking = this.data.booking;

    this.bookingService.addBooking(this.booking).subscribe({
      next: resp => {
        if(resp) {
          this.booking.bookingId = resp.bookingId;
          this.mailService.sendConfirmationMail(this.booking).subscribe({
            next: () => {
              this.confirmationMailSent = true;
            },
            error: err => {
              console.log(err);
            }
          });
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  submitCode() {
    this.mailService.sendCode(this.enteredCode, this.booking).subscribe({
      next: resp => {
        if(resp) {
          this.notificationService.showSuccessNotification("Reservation confirmed!");
          this.mailService.sendFinishedEmail().subscribe();
          this.dialogRef.close({ event: 'Added', data: true })
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  setAvailabilityDate() {
    // var id = this.location.locationId!!;
    // this.enableDates = true;
    // // this.dateHelper = new DateHelper(this.bookingService, id);
    // this.myFilterIn = this.dateHelper.myFilterIn;
    // this.myFilterOut = this.dateHelper.myFilterOut;
  }

  setInDate() {
    // this.dateHelper.inDate = this.inDateFormControl.getRawValue() as unknown as Date;
  }

  setOutDate() {
    // this.noOfDaysBooked = (((this.outDateFormControl.getRawValue() as unknown as Date).getTime() - (this.inDateFormControl.getRawValue() as unknown as Date).getTime()) 
    // / (1000 * 3600 * 24) + 1);
    // this.totalPrice = this.noOfDaysBooked * this.location.pricePerHour!!;
  }
}
