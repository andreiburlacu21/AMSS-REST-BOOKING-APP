import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Restaurant } from 'src/app/models/restaurant.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { RestaurantService } from 'src/app/services/restaurant-service/restaurant.service';
import { RestaurantsDialogComponent } from './restaurants-dialog/restaurants-dialog.component';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { ImageDialogComponent } from '../locations/image-dialog/image-dialog.component';
import { LocationService } from 'src/app/services/location-service/location.service';
import { Location } from 'src/app/models/location.model';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit {
  locationsAreLoading: boolean = false;
  isLoading: boolean = false;
  restaurants: Restaurant[] = [];
  locations: Location[] = [];

  constructor(private readonly restaurantService: RestaurantService,
    private readonly notificationService: NotificationService,
    private readonly locationService: LocationService,
    private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllRestaurants();
    this.getAllLocations();
  }

  getAllRestaurants() {
    this.isLoading = true;
    this.restaurants = [];

    this.restaurantService.getAllRestaurants().subscribe({
      next: resp => {
        this.restaurants = resp;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showErrorNotification("There was a problem while fetching existing restaurants!");
        this.isLoading = false;
      }
    });
  }

  getAllLocations() {
    this.locationsAreLoading = true;
    this.locationService.getAllLocations().subscribe({
      next: resp => {
        this.locations = resp;
        this.locationsAreLoading = false;
      }, 
      error: () => {
        this.locationsAreLoading = false;
      }
    });
  }

  getLocationAddressForRestaurant(restaurant: Restaurant): string {
    let location = this.locations.find(loc => loc.locationId === restaurant.locationId);
    
    if(location) {
      return location.address!!;
    }
      
    return "Unknown";
  } 

  addRestaurant() {
    let dialogRef = this.dialog.open(RestaurantsDialogComponent, {
      width: '500px',
      data: {
        action: Action.ADD,
        locations: this.locations
      }
    })

    dialogRef.afterClosed().subscribe(newRestaurant => {
      if (newRestaurant.data) {
        this.restaurantService.addRestaurant(newRestaurant.data).subscribe(resp => {
          this.notificationService.showSuccessNotification("Restaurant added!");
          this.getAllRestaurants();
        });
      }
    });
  }

  editRestaurant(restaurant: Restaurant) {
    let dialogRef = this.dialog.open(RestaurantsDialogComponent, {
      width: '500px',
      data: {
        action: Action.UPDATE,
        restaurant: restaurant
      }
    });

    dialogRef.afterClosed().subscribe(updatedRestaurant => {
      if(updatedRestaurant.data) {
        this.restaurantService.updateRestaurant(updatedRestaurant.data).subscribe({
          next: resp => {
            this.notificationService.showSuccessNotification("Restaurant updated!");
            this.getAllRestaurants();
          },
          error: () => {
            this.notificationService.showErrorNotification("Restaurant update failed!");
          }
        });
      }
    });
  }

  deleteRestaurant(restaurant: Restaurant) {
    let dialogRef = this.dialog.open(RestaurantsDialogComponent, {
      width: '500px',
      data: {
        action: Action.DELETE,
        restaurant: restaurant
      }
    });

    dialogRef.afterClosed().subscribe(restaurantId => {
      if(restaurantId.data) {
        this.restaurantService.deleteRestaurant(restaurantId.data).subscribe({
          next: resp => {
            this.notificationService.showSuccessNotification("Restaurant deleted!");
            this.getAllRestaurants();
          },
          error: () => {
            this.notificationService.showErrorNotification("Restaurant deletion failed!");
          }
        });
      }
    });
  }

  addImage(restaurant: Restaurant) {
    this.dialog.open(ImageDialogComponent, {
      width: '500px',
      data: {
        restaurant: restaurant
      }
    })
  }
}
