import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account } from 'src/app/models/account.model';
import { Booking } from 'src/app/models/booking.model';
import { Location } from 'src/app/models/location.model';
import { AccountService } from 'src/app/services/account-service/account.service';
import { BookingService } from 'src/app/services/booking-service/booking.service';
import { LocationService } from 'src/app/services/location-service/location.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { DateHelper } from 'src/app/utils/date-helper';
import { AccountDialogComponent } from '../../admin-pages/accounts/account-dialog/account-dialog.component';

@Component({
  selector: 'app-make-a-reservation',
  templateUrl: './make-a-reservation.component.html',
  styleUrls: ['./make-a-reservation.component.scss']
})

export class MakeAReservationComponent implements OnInit {
  booking: Booking = new Booking();
  location: Location = new Location();
  loggedInAccount: Account =  new Account();
  phoneNumberFormControl = new FormControl('', [Validators.required]);
  inDateFormControl = new FormControl(new Date(), [Validators.required]);
  outDateFormControl = new FormControl(new Date(), [Validators.required]);
  checkInDate: any = null;
  totalPriceFormControl = new FormControl(0, [Validators.required]);
  minDate: any = new Date;
  myFilterIn: any;
  myFilterOut: any;
  dateClass: any;
  enableDates: boolean = false;
  locationData!: Location[];
  accountData!: Account[];
  private dateHelper !: DateHelper;
  totalPrice: number = 0;
  noOfDaysBooked: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly notificationService: NotificationService,
    private bookingService: BookingService,
    public dialogRef: MatDialogRef<AccountDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();
    this.setAvailabilityDate();
  }

  private getPassedData() {
    this.location = this.data.location;
    this.loggedInAccount = this.data.account;
  }

  setAvailabilityDate() {
    var id = this.location.locationId!!;
    this.enableDates = true;
    this.dateHelper = new DateHelper(this.bookingService, id);
    this.myFilterIn = this.dateHelper.myFilterIn;
    this.myFilterOut = this.dateHelper.myFilterOut;
  }

  setInDate() {
    this.dateHelper.inDate = this.inDateFormControl.getRawValue() as unknown as Date;
  }

  setOutDate() {
    this.noOfDaysBooked = (((this.outDateFormControl.getRawValue() as unknown as Date).getTime() - (this.inDateFormControl.getRawValue() as unknown as Date).getTime()) 
    / (1000 * 3600 * 24) + 1);
    this.totalPrice = this.noOfDaysBooked * this.location.pricePerHour!!;
  }

  addBooking() {
    var booking = new Booking();
    booking.accountId = this.loggedInAccount.accountId;
    booking.inDate = this.inDateFormControl.getRawValue()?.toDateString();
    booking.outDate = this.outDateFormControl.getRawValue()?.toDateString();
    booking.phoneNumber = this.loggedInAccount.phoneNumber;
    booking.locationId = this.location.locationId;
    booking.totalPrice = this.totalPrice;

    this.bookingService.addBooking(booking)
      .subscribe(value => {
        this.dialogRef.close({ event: 'Add', data: value });
      });
  }
}
