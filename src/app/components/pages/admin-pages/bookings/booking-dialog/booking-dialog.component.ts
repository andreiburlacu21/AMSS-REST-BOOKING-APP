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
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { AccountDialogComponent } from '../../accounts/account-dialog/account-dialog.component';

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})

export class BookingDialogComponent implements OnInit {
  action: Action = Action.ADD;
  booking: Booking = new Booking();
  accountIdFormControl = new FormControl('', [Validators.required]);
  locationFormControl = new FormControl('', [Validators.required]);
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly notificationService: NotificationService,
    private locationService: LocationService,
    private accountService: AccountService,
    private bookingService: BookingService,
    public dialogRef: MatDialogRef<AccountDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();

    this.locationService.getAllLocations()
      .subscribe(data => this.locationData = data)

    this.accountService.getAllAccounts()
      .subscribe(data => this.accountData = data)
  }

  private getPassedData() {
    this.action = this.data.action;
    if (this.action !== Action.ADD) {
      this.booking = this.data.booking;
    }

    if (this.action === Action.UPDATE) {
      this.accountIdFormControl.setValue(this.booking.accountId + "");
      // this.locationFormControl.setValue(this.booking.locationId + "");
      // this.phoneNumberFormControl.setValue(this.booking.phoneNumber!!);
      // this.inDateFormControl.setValue(new Date(this.booking.inDate!!));
      // this.outDateFormControl.setValue(new Date(this.booking.outDate!!));
      // this.totalPriceFormControl.setValue(this.booking.totalPrice!!);
    }
  }

  setAvailabilityDate() {
    var id = this.locationFormControl.getRawValue() as unknown as number;
    this.enableDates = true;
    this.dateHelper = new DateHelper(this.bookingService, id);
    this.myFilterIn = this.dateHelper.myFilterIn;
    this.myFilterOut = this.dateHelper.myFilterOut;
    //this.dateClass = this.dateHelper.dateClass;
  }
  setInDate() {
    this.dateHelper.inDate = this.inDateFormControl.getRawValue() as unknown as Date;
  }

  addBooking() {
    var booking = new Booking();
    booking.accountId = this.accountIdFormControl.getRawValue() as unknown as number;
    // booking.inDate = this.inDateFormControl.getRawValue()?.toDateString();
    // booking.outDate = this.outDateFormControl.getRawValue()?.toDateString();
    // booking.phoneNumber = this.phoneNumberFormControl.getRawValue() ?? "";
    // booking.locationId = this.locationFormControl.getRawValue() as unknown as number;
    // booking.totalPrice = this.totalPriceFormControl.getRawValue() as unknown as number;

    this.bookingService.addBooking(booking)
      .subscribe(value => {
        this.dialogRef.close({ event: 'Add', data: value });
      });
  }

  updateBooking() {

  }

  deleteBooking() {

  }

}
