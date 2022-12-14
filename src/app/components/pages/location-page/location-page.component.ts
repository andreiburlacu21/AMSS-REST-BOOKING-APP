import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { Location } from 'src/app/models/location.model';
import { Review } from 'src/app/models/review.model';
import { AccountService } from 'src/app/services/account-service/account.service';
import { ImageService } from 'src/app/services/image-service/image.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ReviewService } from 'src/app/services/review-service/review.service';
import { environment } from 'src/environments/environment';
import { MakeAReservationComponent } from './make-a-reservation/make-a-reservation.component';
import { WriteAReviewComponent } from './write-a-review/write-a-review.component';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss']
})
export class LocationPageComponent implements OnInit {
  isLoading: boolean = true;
  loggedInAccount: Account = new Account();
  location: Location;
  images: string[] = [];
  reviews: Review[] = [];
  imageObject: Object[] = [];

  center: google.maps.LatLngLiteral = {
    lat: environment.locationX,
    lng: environment.locationY
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  markerPosition: google.maps.LatLngLiteral = {
    lat: environment.locationX,
    lng: environment.locationY
  }

  zoom = 17;

  constructor(private router: Router,
    private imageService: ImageService,
    private reviewService: ReviewService,
    private _bottomSheet: MatBottomSheet,
    private accountService: AccountService,
    private bottomSheetRef: MatBottomSheetRef<WriteAReviewComponent>,
    private readonly dialog: MatDialog, 
    private readonly notificationService: NotificationService) {
    this.location = this.router.getCurrentNavigation()!.extras.state!;

  }

  ngOnInit(): void {
    if (this.location) {
      this.getLocationData();
    }

    this.accountService.getMyData().subscribe({
      next: resp => {
        this.loggedInAccount = resp;
      },
      error: () => {

      }
    });
  }

  private getLocationData() {
    this.isLoading = true;
    this.imageService.getImages("location", this.location.locationId!).subscribe({
      next: images => {
        this.images = images;
        this.images.forEach(imgSource => {
          this.imageObject.push({
            image: imgSource,
            thumbImage: imgSource
          });
        });

        this.getReviews();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private getReviews() {
    this.isLoading = true;
    this.reviewService.getAllReviews().subscribe({
      next: reviews => {
        this.reviews = reviews.filter(review => review.locationId === this.location.locationId);
        this.isLoading = false;
        this.reviews.forEach(review => {
          this.reviewService.getReviewEntityById(review.reviewId!).subscribe({
            next: resp => {
              review.reviewEntity = resp;
              this.isLoading = false;
            },
            error: () => {

            }
          });
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  zoomImage() {
    environment.hideSidenav = true;
  }

  exitImage() {
    environment.hideSidenav = false;
  }

  calculateLocationRating(locationId: number): number {
    let reviewsForThisLocation: Review[] = [];
    let totalScore: number = 0;

    this.reviews.forEach(review => {
      if (review.locationId === locationId) {
        totalScore += review.grade!!;
        reviewsForThisLocation.push(review);
      }
    });

    if (reviewsForThisLocation.length === 0) {
      return 0;
    }

    let rating: number = totalScore / reviewsForThisLocation.length;

    if (rating % 1 < 0.5) {
      return Math.floor(rating);
    }

    if (rating % 1 >= 0.5) {
      return Math.ceil(rating);
    }

    return 0;
  }

  writeReview() {
    const config: MatBottomSheetConfig = { data: { location: this.location, account: this.loggedInAccount } };

    this.bottomSheetRef = this._bottomSheet.open(WriteAReviewComponent, config);

    this.bottomSheetRef.afterDismissed().subscribe(() => {
      this.getReviews();
    });
  }

  book() {
    let dialogRef = this.dialog.open(MakeAReservationComponent, {
      width: '500px',
      data: {
        account: this.loggedInAccount,
        location: this.location
      }
    });

    dialogRef.afterClosed().subscribe(newBooking => {
      if (newBooking) {
        this.notificationService.showSuccessNotification("Location booked!");
      }
    });

  }
}
