import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Booking } from 'src/app/models/booking.model';
import { Review } from 'src/app/models/review.model';
import { BookingService } from 'src/app/services/booking-service/booking.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ReviewService } from 'src/app/services/review-service/review.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})

export class ReviewsComponent implements OnInit {
  isLoading: boolean = false;
  bookingsAreLoading: boolean = false;
  reviews: Review[] = [];
  bookings: Booking[] = [];

  constructor(private readonly reviewsService: ReviewService,
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllReviews();
    this.getAllBookings();
  }

  private getAllReviews() {
    this.isLoading = true;

    this.reviewsService.getAllReviews().subscribe({
      next: resp => {
        this.reviews = resp;
        this.isLoading = false;
        console.log(this.reviews);

      },
      error: () => {
        this.isLoading = false;
        this.notificationService.showErrorNotification("There was an error while loading the reviews!");
      }
    });
  }

  private getAllBookings() {
    this.bookingsAreLoading = true;

    this.bookingService.getAllBookings().subscribe({
      next: resp => {
        this.bookings = resp;
        this.bookingsAreLoading = false;
      },
      error: err => {
        console.log(err);
        this.bookingsAreLoading = false;
        this.notificationService.showErrorNotification("There was an error while loading all the bookings!");
      }
    });
  }

  addReview() {
    let dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '500px',
      data: {
        action: Action.ADD
      }
    })

    dialogRef.afterClosed().subscribe(newReview => {
      if (newReview.data) {
        this.reviewsService.addReview(newReview.data).subscribe(resp => {
          this.notificationService.showSuccessNotification("Review added!");
          this.getAllReviews();
        });
      }
    });
  }

  editReview(review: Review) {
    let dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '500px',
      data: {
        action: Action.UPDATE,
        review: review
      }
    })

    dialogRef.afterClosed().subscribe(updatedReview => {
      if(updatedReview.data) {
        this.reviewsService.updateReview(updatedReview.data).subscribe(resp => {
          if(resp) {
            this.notificationService.showSuccessNotification("Review updated!");
            console.log(resp);
            this.getAllReviews();
          }
        });
      }
    });
  }

  deleteReview(review: Review) {
    let dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '500px',
      data: {
        action: Action.DELETE,
        review:  review
      }
    })

    dialogRef.afterClosed().subscribe(reviewId => {
      if(reviewId.data) {
        this.reviewsService.deleteReview(reviewId.data).subscribe(resp => {
          if(resp) {
            this.notificationService.showSuccessNotification("Review deleted!");
            this.getAllReviews();
          }
        });
      }
    });
  }
}
