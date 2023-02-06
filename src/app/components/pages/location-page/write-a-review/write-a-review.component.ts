import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Account } from 'src/app/models/account.model';
import { Location } from 'src/app/models/location.model';
import { RestaurantWithAllDetails } from 'src/app/models/restaurant-with-all-details.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Review } from 'src/app/models/review.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ReviewService } from 'src/app/services/review-service/review.service';

@Component({
  selector: 'app-write-a-review',
  templateUrl: './write-a-review.component.html',
  styleUrls: ['./write-a-review.component.scss']
})
export class WriteAReviewComponent implements OnInit {
  restaurant: Restaurant = new Restaurant();
  account: Account = new Account();
  restaurantDetails: RestaurantWithAllDetails = new RestaurantWithAllDetails();
  descriptionFormControl = new FormControl('', [Validators.required]);
  rating: number = 0;
  bookingId: number = -1;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  private readonly reviewService: ReviewService,
  private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.restaurant = this.data.restaurant;
    this.restaurantDetails = this.data.restaurantDetails;
    this.bookingId = this.data.bookingId;
  }

  ratingUpdated(eventData: {rating: number}) {
    this.rating = eventData.rating;
  }

  postReview() {
    let newReview: Review = new Review();
    newReview.restaurantId = this.restaurant.restaurantId;
    newReview.grade = this.rating;
    newReview.description = this.descriptionFormControl.getRawValue() ?? "";

    console.log(newReview);

    this.reviewService.addReview(newReview).subscribe({
      next: () => {
        this.notificationService.showSuccessNotification("Thank you for your feedback!");
      },
      error: err => {
        this.notificationService.showErrorNotification(err.error);
        console.log(err);
      }
    });
  }
}
