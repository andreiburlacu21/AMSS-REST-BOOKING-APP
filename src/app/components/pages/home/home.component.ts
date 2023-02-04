import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/models/booking.model';
import { LocationWithAllDetails } from 'src/app/models/location-with-all-details.model';
import { Location } from 'src/app/models/location.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Review } from 'src/app/models/review.model';
import { BookingService } from 'src/app/services/booking-service/booking.service';
import { LocationService } from 'src/app/services/location-service/location.service';
import { ReviewService } from 'src/app/services/review-service/review.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  isLoading = false;
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
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.isAdminLoggedIn = environment.isAdmin;

    if (!this.isAdminLoggedIn) { // load data for user
      this.loadData();
    }
  }

  private loadData() {  


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


    // // 1
    // this.restaurants.push({
    //   id: 1,
    //   name: "Open Gastrobar",
    //   rating: 4,
    //   description: "Beautiful terrace and very friendly and nice staff. You can enjoy watching the sunset while eating dinner here." +
    //   "The menu has a lot of variety, with a little bit of every type of cuisine.",
    //   locationId: 1
    // });

    // this.locations.push({
    //   id: 1,
    //   x: 44.41185902958171,
    //   y: 26.118675397630597,
    //   address: "Splaiul Unirii 160, București 040041"
    // });


    // // 2
    // this.restaurants.push({
    //   id: 2,
    //   name: "Noeme",
    //   rating: 5,
    //   description: "The kind of place you wish were more of.",
    //   locationId: 2
    // });

    // this.locations.push({
    //   id: 2,
    //   x: 44.4278014722162,
    //   y: 26.11522476879475,
    //   address: "Strada Anton Pann 29, București 030796"
    // });


    // // 3
    // this.restaurants.push({
    //   id: 3,
    //   name: "Resto Aperto",
    //   rating: 2,
    //   description: "Aperto is a nice location situated right at the mall entrance.",
    //   locationId: 3
    // });

    // this.locations.push({
    //   id: 3,
    //   x: 44.41968671111673,
    //   y: 26.126780155303663,
    //   address: "Calea Vitan 55-59, București 031282"
    // });

    // this.filteredRestaurants = this.restaurants;
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

  getLocationByRestaurantId(restaurant: Restaurant): Location | undefined {
    return this.locations.find(location => location.locationId === restaurant.locationId);
  }

  seeMore(restaurant: Restaurant) {
    environment.locationX = this.getLocationByRestaurantId(restaurant)?.x!!;
    environment.locationY = this.getLocationByRestaurantId(restaurant)?.y!!;
    this.router.navigateByUrl('/location-page', { state: restaurant});
  }
}
