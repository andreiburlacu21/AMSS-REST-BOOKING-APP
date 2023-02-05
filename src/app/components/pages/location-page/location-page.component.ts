import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { RestaurantWithAllDetails } from 'src/app/models/restaurant-with-all-details.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Review } from 'src/app/models/review.model';
import { Table } from 'src/app/models/table.model';
import { AccountService } from 'src/app/services/account-service/account.service';
import { ImageService } from 'src/app/services/image-service/image.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { RestaurantService } from 'src/app/services/restaurant-service/restaurant.service';
import { ReviewService } from 'src/app/services/review-service/review.service';
import { environment } from 'src/environments/environment';
import { WriteAReviewComponent } from './write-a-review/write-a-review.component';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss']
})
export class LocationPageComponent implements OnInit {
  isLoading: boolean = false;
  loggedInAccount: Account = new Account();
  images: string[] = [];
  reviews: Review[] = [];
  imageObject: Object[] = [];
  restaurant: Restaurant = new Restaurant();
  restaurantDetails: RestaurantWithAllDetails = new RestaurantWithAllDetails();
  inDateFormControl = new FormControl(new Date(), [Validators.required]);
  outDateFormControl = new FormControl(new Date(), [Validators.required]);
  dateClass: any;
  center: google.maps.LatLngLiteral = {
    lat: Number(environment.locationX),
    lng: Number(environment.locationY)
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: Number(environment.locationX),
    lng: Number(environment.locationY)
  }
  zoom = 17;
  indoorTables: Table[] = [];
  outdoorTables: Table[] = [];

  constructor(private router: Router,
    private imageService: ImageService,
    private reviewService: ReviewService,
    private _bottomSheet: MatBottomSheet,
    private accountService: AccountService,
    private bottomSheetRef: MatBottomSheetRef<WriteAReviewComponent>,
    private readonly dialog: MatDialog,
    private readonly restaurantService: RestaurantService,
    private readonly notificationService: NotificationService) {
      this.restaurant = this.router.getCurrentNavigation()!.extras.state!;
      console.log(this.restaurant);
    }

  ngOnInit() {
    this.getRestaurantAllDetails();
  }

  private getRestaurantAllDetails() {
    this.isLoading = true;
    this.imageService.getImages("location", this.restaurant.restaurantId!).subscribe({
      next: images => {
        this.images = images;
        console.log(images);
        this.images.forEach(imgSource => {
         
          this.imageObject.push({
            image: imgSource,
            thumbImage: imgSource
          });
        });

        console.log(this.imageObject);
        this.isLoading = false;
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
