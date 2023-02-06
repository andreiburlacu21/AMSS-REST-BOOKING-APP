import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { Booking } from 'src/app/models/booking.model';
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
import { MakeAReservationComponent } from './make-a-reservation/make-a-reservation.component';
import { WriteAReviewComponent } from './write-a-review/write-a-review.component';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss']
})

export class LocationPageComponent implements OnInit {
  isLoading: boolean = false;
  imagesAreLoading: boolean = false;
  loggedInAccount: Account = new Account();
  images: string[] = [];
  imageObject: Object[] = [];
  restaurant: Restaurant = new Restaurant();
  restaurantDetails: RestaurantWithAllDetails = new RestaurantWithAllDetails();
  inDateFormControl = new FormControl(new Date(), [Validators.required]);
  startHour: number = 8
  endHour: number = 9
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
  menuContent: string = "";
  reservationDatesHaveBeenGiven: boolean = false;
  selectedTableForReservation: Table = new Table();
  occupiedTables: Table[] = [];
  isOneTableSelected: boolean = false;
  loggedInACcount: Account = new Account();
  reservationInDate: Date = new Date();
  reservationOutDate: Date = new Date();
  canThisUserReviewTheLocation: boolean = false;
  finishedBookingForThisUser: Booking = new Booking();
  accounts: Account[] = [];

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
  }

  ngOnInit() {
    this.getRestaurantAllDetails();
    this.getAllAccounts();
  }

  private getAllAccounts() {
    this.accountService.getAllAccounts().subscribe({
      next: resp => {
        this.accounts = resp;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getUsernameByAccountId(accountId: number) {
    let account = this.accounts.find(acc => acc.accountId === accountId);
    if(account) {
      return account.userName;
    }
    return "user";
  }

  private getAccountDetails() {
    this.accountService.getMyData().subscribe(resp => {
      this.loggedInACcount = resp;

      this.restaurantDetails.bookings?.forEach(booking => {
        if(new Date(booking.endDate!) < new Date() && booking.status == '1' && booking.accountId == this.loggedInACcount.accountId) {
          this.canThisUserReviewTheLocation = true;
          this.finishedBookingForThisUser = booking;
        }
      });
    });
  }

  private getRestaurantAllDetails() {
    this.isLoading = true;
    this.restaurantService.getRestaurantWithAllDetails(this.restaurant.restaurantId!).subscribe({
      next: resp => {
        this.restaurantDetails = resp;
        this.getAccountDetails();

        // calcualte restaurant's rating
        let totalStars = 0;
        this.restaurantDetails.reviews?.forEach(review => {
          totalStars += review.grade!;
        });

        this.restaurant.rating = totalStars / this.restaurantDetails.reviews?.length!;

        this.isLoading = false;

        this.restaurantDetails.tables?.forEach(table => { // dividing the tables based on their location inside the restaurant
          if (table.outdoor) {
            this.outdoorTables.push(table);
          } else {
            this.indoorTables.push(table);
          }
        });

        this.restaurantDetails.menus?.forEach(menu => { // adding up all menus information
          this.menuContent += "\n" + menu.content;
        });
      },
      error: err => {
        this.isLoading = false;
        this.notificationService.showErrorNotification("There was an error while loading restaurant's information!");
        console.log(err);
      }
    });

    this.imagesAreLoading = true;
    this.imageService.getImages("location", this.restaurant.restaurantId!).subscribe({
      next: images => {
        this.images = images;
        this.images.forEach(imgSource => {

          this.imageObject.push({
            image: imgSource,
            thumbImage: imgSource
          });
        });

        console.log(this.imageObject);
        this.imagesAreLoading = false;
      },
      error: () => {
        this.notificationService.showErrorNotification("Error while loading the images!");
        this.imagesAreLoading = false;
      }
    });
  }

  zoomImage() {
    environment.hideSidenav = true;
  }

  exitImage() {
    environment.hideSidenav = false;
  }

  writeReview() {
    const config: MatBottomSheetConfig = { data: { restaurant: this.restaurant } };

    this.bottomSheetRef = this._bottomSheet.open(WriteAReviewComponent, config);
  }

  hoursAreValid(): boolean {
    if(this.startHour < 8 || this.endHour < 9) {
      return false;
    }
    if(this.startHour > 23 || this.endHour > 24) {
      return false;
    }

    if(this.startHour >= this.endHour) {
      return false;
    }

    return true;
  }

  confirmDates() {
    this.reservationInDate = new Date(this.inDateFormControl.getRawValue()!);
    this.reservationInDate!.setHours(this.startHour, 0, 0);

    this.reservationOutDate = new Date(this.inDateFormControl.getRawValue()!);
    this.reservationOutDate!.setHours(this.endHour!, 0, 0);

    this.reservationDatesHaveBeenGiven = true;

    this.occupiedTables = [];
    this.outdoorTables = [];
    this.indoorTables = [];

    this.restaurantDetails.tables?.forEach(table => { // dividing the tables based on their location inside the restaurant
      if (table.outdoor) {
        this.outdoorTables.push(table);
      } else {
        this.indoorTables.push(table);
      }
    });

    this.restaurantDetails.bookings?.forEach(booking => {
      if (this.reservationInDate! < new Date(booking.endDate!) && new Date(booking.startDate!) < this.reservationOutDate!
        && booking.status !== "2") {
        this.occupiedTables.push(
          this.restaurantDetails.tables?.find(table => table.tableId === booking.tableId)!
        );
      }
    });
  }

  selectTable(table: Table): void {
    if (this.selectedTableForReservation !== table && !this.occupiedTables.find(tb => tb.tableId === table.tableId)) {
      this.isOneTableSelected = true;
      this.selectedTableForReservation = table;
    } else {
      this.isOneTableSelected = false;
      this.selectedTableForReservation = new Table();
    }
  }

  isTableSelected(tableId: number): boolean {
    return this.selectedTableForReservation.tableId === tableId;
  }

  isTableOccupied(tableId: number): boolean {
    let table = this.occupiedTables.find(table => table.tableId === tableId);

    if (table) {
      return true;
    }
    return false;
  }

  makeReservation() {
    let newBooking = new Booking();

    newBooking.accountId = this.loggedInACcount.accountId;
    newBooking.startDate = this.reservationInDate.toString();
    newBooking.endDate = this.reservationOutDate.toString();
    newBooking.isReviewed = false;
    newBooking.restaurantId = this.restaurant.restaurantId;
    newBooking.tableId = this.selectedTableForReservation.tableId;

    let dialogRef = this.dialog.open(MakeAReservationComponent, {
      width: '500px',
      data: {
        booking: newBooking
      }
    });

    dialogRef.afterClosed().subscribe(resp => {
      this.reservationDatesHaveBeenGiven = false;

      this.occupiedTables = [];
      this.outdoorTables = [];
      this.indoorTables = [];
    });
  }
}
