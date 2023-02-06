import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
  startHourFormControl = new FormControl(8, [Validators.required, Validators.min(8), Validators.max(24)])
  endHourFormControl = new FormControl(9, [Validators.required, Validators.min(Number(this.startHourFormControl.getRawValue) + 1), 
    Validators.max(24)])
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
    this.getAccountDetails();
  }

  private getAccountDetails() {
    this.accountService.getMyData().subscribe(resp => this.loggedInACcount = resp);
  }

  private getRestaurantAllDetails() {
    this.isLoading = true;
    this.restaurantService.getRestaurantWithAllDetails(this.restaurant.restaurantId!).subscribe({
      next: resp => {
        this.restaurantDetails = resp;
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
        console.log(images);
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

  confirmDates() {
    this.reservationInDate = this.inDateFormControl.getRawValue()!;
    this.reservationInDate!.setHours(this.startHourFormControl.getRawValue()!, 0, 0);

    this.reservationOutDate = new Date(this.inDateFormControl.getRawValue()!);
    this.reservationOutDate!.setHours(this.endHourFormControl.getRawValue()!, 0, 0);

    this.reservationDatesHaveBeenGiven = true;
    this.occupiedTables = [];

    this.restaurantDetails.bookings?.forEach(booking => {
      if(this.reservationInDate! < new Date(booking.endDate!) && new Date(booking.startDate!) < this.reservationOutDate! && booking.status !== "2") {
        this.occupiedTables.push(
          this.restaurantDetails.tables?.find(table => table.tableId === booking.tableId)!
        );
      }
    });
  }

  selectTable(table: Table): void {
    if(this.selectedTableForReservation !== table && !this.occupiedTables.find(tb => tb.tableId === table.tableId)) {
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

    if(table) {
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

    });
  }
}
