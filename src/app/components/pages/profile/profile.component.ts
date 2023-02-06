import { Component, OnInit } from '@angular/core';
import { AccountEntityDto } from 'src/app/models/account-entity.model';
import { Account } from 'src/app/models/account.model';
import { Booking } from 'src/app/models/booking.model';
import { Review } from 'src/app/models/review.model';
import { AccountService } from 'src/app/services/account-service/account.service';
import { BookingService } from 'src/app/services/booking-service/booking.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ReviewService } from 'src/app/services/review-service/review.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  reviewsAreLoading: boolean = false;
  bookingsAreLoading: boolean = false;
  account: AccountEntityDto = new AccountEntityDto();
  userWantsToUpdate: boolean = false;
  myReviews: Review[] = [];
  myBookings: Booking[] = [];

  constructor(
    private readonly notificationService: NotificationService,
    private readonly accountService: AccountService,
    private readonly bookingService: BookingService,
    private readonly reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.loadMyData();
  }

  loadMyData() {
    this.isLoading = true;

    this.accountService.getMyData().subscribe({
      next: resp => {
        this.account = resp;
        this.myBookings = resp.bookings!!;
        this.myReviews = resp.reviews!!;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showErrorNotification("There was a problem loading your data!");
        this.isLoading = false;
      }
    });
  }

  deleteBooking(booking: Booking){
    this.bookingService.deleteBooking(booking.bookingId!!).subscribe({
      next: resp =>{
        if(resp){
          let index = this.myBookings.indexOf(booking);
          delete this.myBookings[index];
        }
      },
      error: err =>{

      }
    });
  }



  getStatus(status: any){
    if(status == 0) return "Created";
    if(status == 1) return "Confirmed";
    if(status == 2) return "Canceled";
    return "";
  }

  getColor(status: any){
    if(status == 0) return "background-color: rgb(14, 88, 152); margin-bottom: 20px;";
    if(status == 1) return "background-color: rgb(3, 126, 54); margin-bottom: 20px;";
    if(status == 2) return "background-color: rgb(10, 192, 4); margin-bottom: 20px;";
    return "";
  }

}
