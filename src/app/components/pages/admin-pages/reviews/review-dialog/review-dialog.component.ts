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
    private readonly locationService: LocationService,
    private readonly accountService: AccountService,
    private readonly reviewService: ReviewService) { }

  ngOnInit(): void {
    this.getPassedData();

    this.locationService.getAllLocations()
      .subscribe(data => this.locationData = data)

    this.accountService.getAllAccounts()
      .subscribe(data => this.accountData = data)

    if(this.action !== Action.ADD && this.review.reviewId) {
      this.reviewService.getReviewEntityById(this.review.reviewId).subscribe({
        next: resp => {
          // this.review.reviewEntity = resp;
        },
        error: () => {
          this.notificationService.showErrorNotification("There was an error while loading this review information!");
        }
      })
    }
  }

  private getPassedData() {
    this.action = this.data.action;
    if (this.action !== Action.ADD) {
      this.review = this.data.review;
    }

    if (this.action === Action.UPDATE) {
      // this.accountIdFormControl.setValue(this.review.accountId!!);
      // this.locationIdFormControl.setValue(this.review.locationId!!);
      this.gradeFormControl.setValue(this.review.grade!!);
      this.descriptionFormControl.setValue(this.review.description!!);
      // this.dateFormControl.setValue(new Date(this.review.date!!));
    }
  }

  addReview() {
    let newReview: Review = new Review();
    // newReview.accountId = this.accountIdFormControl.getRawValue() ?? 0;
    // newReview.locationId = this.locationIdFormControl.getRawValue() ?? 0;
    newReview.grade = this.gradeFormControl.getRawValue() ?? 0;
    newReview.description = this.descriptionFormControl.getRawValue() ?? "";
    // newReview.date = this.dateFormControl.getRawValue()?.toDateString();

    this.dialogRef.close({ event: 'Add', data: newReview });
  }

  updateReview() {
    let newReview: Review = new Review();
    newReview.reviewId = this.review.reviewId;
    // newReview.accountId = this.accountIdFormControl.getRawValue() ?? 0;
    // newReview.locationId = this.locationIdFormControl.getRawValue() ?? 0;
    newReview.grade = this.gradeFormControl.getRawValue() ?? 0;
    newReview.description = this.descriptionFormControl.getRawValue() ?? "";
    // newReview.date = this.descriptionFormControl.getRawValue as unknown as string ?? "";

    this.dialogRef.close({ event: 'Update', data: newReview });
  }

  deleteReview() {
    this.dialogRef.close({ event: 'Delete', data: this.review.reviewId })
  }
}
