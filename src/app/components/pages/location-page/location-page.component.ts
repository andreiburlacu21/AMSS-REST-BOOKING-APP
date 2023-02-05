import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { Location } from 'src/app/models/location.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Review } from 'src/app/models/review.model';
import { Table } from 'src/app/models/table.model';
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
  // location: Location;
  images: string[] = [];
  reviews: Review[] = [];
  imageObject: Object[] = [];
  restaurant: Restaurant = new Restaurant();
  location: Location = new Location();
  inDateFormControl = new FormControl(new Date(), [Validators.required]);
  outDateFormControl = new FormControl(new Date(), [Validators.required]);
  dateClass: any;

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

  // MOCK DATA

  indoorTables: Table[] = [];
  outdoorTables: Table[] = [];

  constructor(private router: Router,
    private imageService: ImageService,
    private reviewService: ReviewService,
    private _bottomSheet: MatBottomSheet,
    private accountService: AccountService,
    private bottomSheetRef: MatBottomSheetRef<WriteAReviewComponent>,
    private readonly dialog: MatDialog,
    private readonly notificationService: NotificationService) {
    this.restaurant = this.router.getCurrentNavigation()!.extras.state!;

  }

  ngOnInit(): void {
    // TEMP
    // this.indoorTables.push({
    //   id: 1,
    //   restaurantId: 1,
    //   numberOfSeats: 4,
    //   outdoor: false
    // });

    // this.indoorTables.push({
    //   id: 2,
    //   restaurantId: 1,
    //   numberOfSeats: 4,
    //   outdoor: false
    // });

    // this.indoorTables.push({
    //   id: 3,
    //   restaurantId: 1,
    //   numberOfSeats: 4,
    //   outdoor: false
    // });

    // this.indoorTables.push({
    //   id: 4,
    //   restaurantId: 1,
    //   numberOfSeats: 6,
    //   outdoor: false
    // });

    // this.indoorTables.push({
    //   id: 5,
    //   restaurantId: 1,
    //   numberOfSeats: 6,
    //   outdoor: false
    // });


    // this.outdoorTables.push({
    //   id: 6,
    //   restaurantId: 1,
    //   numberOfSeats: 2,
    //   outdoor: true
    // });

    // this.outdoorTables.push({
    //   id: 7,
    //   restaurantId: 1,
    //   numberOfSeats: 2,
    //   outdoor: true
    // });

    // this.outdoorTables.push({
    //   id: 8,
    //   restaurantId: 1,
    //   numberOfSeats: 2,
    //   outdoor: true
    // });

    // // 1
    // this.location = {
    //   id: 1,
    //   x: 44.41185902958171,
    //   y: 26.118675397630597,
    //   address: "Splaiul Unirii 160, București 040041"
    // }

    


    // this.reviews.push({
    //   reviewId: 1,
    //   accountId: 1,
    //   locationId: 2,
    //   grade: 4,
    //   description: "Great place!",
    //   date: new Date().toDateString(),
    // });

    // this.reviews.push({
    //   reviewId: 2,
    //   accountId: 2,
    //   locationId: 2,
    //   grade: 3,
    //   description: "It's ok!",
    //   date: new Date().toDateString(),
    // });

    // this.reviews.push({
    //   reviewId: 2,
    //   accountId: 3,
    //   locationId: 2,
    //   grade: 1,
    //   description: "Bad!",
    //   date: new Date().toDateString(),
    // });

    // --- END TEMP

    // if (this.location) {
    //   this.getLocationData();
    // }

    // this.accountService.getMyData().subscribe({
    //   next: resp => {
    //     this.loggedInAccount = resp;
    //   },
    //   error: () => {

    //   }
    // });
  }

  private getLocationData() {
    this.isLoading = true;
    // this.imageService.getImages("location", this.location.locationId!).subscribe({
    //   next: images => {
    //     this.images = images;
    //     this.images.forEach(imgSource => {
    //       this.imageObject.push({
    //         image: imgSource,
    //         thumbImage: imgSource
    //       });
    //     });

    //     this.getReviews();
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //   }
    // });
  }

  private getReviews() {
    // this.isLoading = true;
    // this.reviewService.getAllReviews().subscribe({
    //   next: reviews => {
    //     this.reviews = reviews.filter(review => review.locationId === this.location.locationId);
    //     this.isLoading = false;
    //     this.reviews.forEach(review => {
    //       this.reviewService.getReviewEntityById(review.reviewId!).subscribe({
    //         next: resp => {
    //           review.reviewEntity = resp;
    //           this.isLoading = false;
    //         },
    //         error: () => {

    //         }
    //       });
    //     });
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //   }
    // });
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
      // if (review.locationId === locationId) {
      //   totalScore += review.grade!!;
      //   reviewsForThisLocation.push(review);
      // }
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
    // const config: MatBottomSheetConfig = { data: { location: this.location, account: this.loggedInAccount } };

    // this.bottomSheetRef = this._bottomSheet.open(WriteAReviewComponent, config);

    // this.bottomSheetRef.afterDismissed().subscribe(() => {
    //   this.getReviews();
    // });
  }

  book() {
    // let dialogRef = this.dialog.open(MakeAReservationComponent, {
    //   width: '500px',
    //   data: {
    //     account: this.loggedInAccount,
    //     location: this.location
    //   }
    // });

    // dialogRef.afterClosed().subscribe(newBooking => {
    //   if (newBooking) {
    //     this.notificationService.showSuccessNotification("Location booked!");
    //   }
    // });

  }
}
