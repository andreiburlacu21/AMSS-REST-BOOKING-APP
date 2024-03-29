import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestaurantWithAllDetails } from 'src/app/models/restaurant-with-all-details.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Restaurant";
  }

  getAllRestaurants(): Observable<Restaurant[]> {
    return this.httpClient.get<Restaurant[]>(this.reqPath + "/all");
  }

  getRestaurantWithAllDetails(id: number): Observable<RestaurantWithAllDetails> {
    return this.httpClient.get<RestaurantWithAllDetails>(this.reqPath + "/Entity/" + id);
  }
 
  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.httpClient.post<Restaurant>(this.reqPath + "/insert", restaurant);
  }

  updateRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.httpClient.put<Restaurant>(this.reqPath + "/update", restaurant);
  }

  deleteRestaurant(restaurantId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.reqPath + "/" + restaurantId);
  }
}
