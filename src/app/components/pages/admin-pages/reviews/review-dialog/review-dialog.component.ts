import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account } from 'src/app/models/account.model';
import { Location } from 'src/app/models/location.model';
import { Review } from 'src/app/models/review.model';
import { AccountService } from 'src/app/services/account-service/account.service';
import { LocationService } from 'src/app/services/location-service/location.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ReviewService } from 'src/app/services/review-service/review.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})

export class ReviewDialogComponent implements OnInit {
  action: Action = Action.ADD;
  review: Review = new Review();
  accountIdFormControl = new FormControl(0, [Validators.required]);
  locationIdFormControl = new FormControl(0, [Validators.required]);
  gradeFormControl = new FormControl(0, [Validators.required]);
  descriptionFormControl = new FormControl('', [Validators.required]);
  dateFormControl = new FormControl(new Date(), [Validators.required]);
  locationData!: Location[];
  accountData!: Account[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly notificationService: NotificationService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    private readonly reviewService: ReviewService) { }

  ngOnInit(): void {
    this.getPassedData();
  }

  private getPassedData() {
    this.action = this.data.action;
    if (this.action !== Action.ADD) {
      this.review = this.data.review;
    }
  }

  deleteReview() {
    this.dialogRef.close({ event: 'Delete', data: this.review.reviewId })
  }
}
