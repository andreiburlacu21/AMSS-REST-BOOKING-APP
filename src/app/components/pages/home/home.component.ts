import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/models/booking.model';
import { LocationWithAllDetails } from 'src/app/models/location-with-all-details.model';
import { Location } from 'src/app/models/location.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Review } from 'src/app/models/review.model';
import { BookingService } from 'src/app/services/booking-service/booking.service';
import { LocationService } from 'src/app/services/location-service/location.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { RestaurantService } from 'src/app/services/restaurant-service/restaurant.service';
import { ReviewService } from 'src/app/services/review-service/review.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  isLoading = false;
  locationsAreLoading = false;
  isAdminLoggedIn: boolean = false;
  locationsWithAllDetails: LocationWithAllDetails[] = [];
  bookings: Booking[] = []
  reviews: Review[] = []
  searchInput: string = ""
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  locations: Location[] = [];

  constructor(
    private readonly locationService: LocationService,
    private readonly bookingService: BookingService,
    private readonly reviewService: ReviewService,
    private readonly restaurantService: RestaurantService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.isAdminLoggedIn = environment.isAdmin;

    if (!this.isAdminLoggedIn) { // load data for user
      this.loadData();
    }
  }

  private loadData() {  
    this.isLoading = true;
    this.restaurantService.getAllRestaurants().subscribe({
      next: resp => {
        this.restaurants = resp;
        this.filteredRestaurants = this.restaurants;
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this.notificationService.showErrorNotification("There was an error while loading existing restaurants!");
      }
    });

    this.locationsAreLoading = true;
    this.locationService.getAllLocations().subscribe({
      next: resp => {
        this.locations = resp;
        this.locationsAreLoading = false;
      },
      error: err => {
        console.log(err);
        this.notificationService.showErrorNotification("Error while loading locations!");
        this.locationsAreLoading = false;
      }
    });

    // this.isLoading = true;
    // this.locationService.getAllLocations().subscribe({ // get all locations
    //   next: locations => {
    //     this.locations = locations;
    //     this.filteredLocations = this.locations;

    //     this.reviewService.getAllReviews().subscribe({ // get all reviews
    //       next: reviews => {
    //         this.reviews = reviews;

    //         this.bookingService.getAllBookings().subscribe({ // get all bookings
    //           next: bookings => {
    //             this.bookings = bookings;
    //             this.isLoading = false;
    //           },
    //           error: () => {
    //             this.isLoading = false;
    //           }
    //         });
    //       },
    //       error: () => {
    //         this.isLoading = false;
    //       }
    //     })
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //   }
    // });
  }

  search() {
    if(this.searchInput !== "") {
      this.filteredRestaurants = this.restaurants.filter(restaurant => restaurant.name?.includes(this.searchInput));
    } else {
      this.filteredRestaurants = this.restaurants;
    }
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

  getLocationByRestaurantId(restaurant: Restaurant): Location | undefined {
    return this.locations.find(location => location.locationId === restaurant.locationId);
  }

  seeMore(restaurant: Restaurant) {
    let restaurantLocation = this.locations.find(loc => loc.locationId === restaurant.locationId);
    environment.locationX = restaurantLocation?.x!;
    environment.locationY = restaurantLocation?.y!;
    this.router.navigateByUrl('/location-page', { state: restaurant});
  }
}
