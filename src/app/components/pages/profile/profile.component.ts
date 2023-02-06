import { Component, OnInit } from '@angular/core';
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
  account: Account = new Account();
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
    // this.isLoading = true;

    // this.accountService.getMyData().subscribe({
    //   next: resp => {
    //     this.account = resp;
    //     this.getAllReviews();
    //     this.getAllBookings();
    //     this.isLoading = false;
    //   },
    //   error: () => {
    //     this.notificationService.showErrorNotification("There was a problem loading your data!");
    //     this.isLoading = false;
    //   }
    // });
  }

  private getAllReviews() {
    this.reviewsAreLoading = true;
    this.reviewService.getAllReviews().subscribe({
      next: resp => {
        // this.myReviews = resp.filter(review => review.accountId === this.account.accountId);
        let reviewsLoaded: number = 0;
        this.myReviews.forEach(review => {
          this.reviewService.getReviewEntityById(review.reviewId!!).subscribe({
            next: resp => {
              // review.reviewEntity = resp;
              reviewsLoaded++;

              if(reviewsLoaded === this.myReviews.length) {
                this.reviewsAreLoading = false;
              }
            },
            error: () => {
              this.reviewsAreLoading = false;
              this.notificationService.showErrorNotification("There was an error while a review's data!");
            }
          });
        });
      },
      error: () => {
        this.reviewsAreLoading = false;
        this.notificationService.showErrorNotification("There was an error while loading your reviews!");
      }
    });
  }

  private getAllBookings() {
    this.bookingsAreLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: resp => {
        this.myBookings = resp.filter(booking => booking.accountId === this.account.accountId);
        let bookingsLoaded: number = 0;
        this.myBookings.forEach(booking => {
          this.bookingService.getBookingEntityById(booking.bookingId!!).subscribe({
            next: resp => {
              // booking.bookingEntity = resp;
              bookingsLoaded++;

              if(bookingsLoaded === this.myBookings.length) {
                this.bookingsAreLoading = false;
              }
            },
            error: () => {
              this.bookingsAreLoading = false;
              this.notificationService.showErrorNotification("There was an error while a booking's data!");
            }
          });
        });
      },
      error: () => {
        this.bookingsAreLoading = false;
        this.notificationService.showErrorNotification("There was an error while loading your bookings!");
      }
    });
  }
}
