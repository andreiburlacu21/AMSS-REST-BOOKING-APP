import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Account } from 'src/app/models/account.model';
import { Location } from 'src/app/models/location.model';
import { Review } from 'src/app/models/review.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ReviewService } from 'src/app/services/review-service/review.service';

@Component({
  selector: 'app-write-a-review',
  templateUrl: './write-a-review.component.html',
  styleUrls: ['./write-a-review.component.scss']
})
export class WriteAReviewComponent implements OnInit {
  location: Location = new Location();
  account: Account = new Account();
  descriptionFormControl = new FormControl('', [Validators.required]);
  rating: number = 0;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  private readonly reviewService: ReviewService,
  private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.location = this.data.location;
    this.account = this.data.account;
  }

  ratingUpdated(eventData: {rating: number}) {
    this.rating = eventData.rating;
  }

  postReview() {
    let newReview: Review = new Review();
    newReview.locationId = this.location.locationId;
    newReview.accountId = this.account.accountId;
    newReview.grade = this.rating;
    newReview.description = this.descriptionFormControl.getRawValue() ?? "";
    newReview.date = new Date().toDateString();

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
