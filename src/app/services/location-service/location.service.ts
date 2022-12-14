import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from 'src/app/models/location.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Locations";
  }

  getAllLocations(): Observable<Location[]> {
    return this.httpClient.get<Location[]>(this.reqPath + "/all");
  }

  addLocation(location: Location): Observable<Location> {
    return this.httpClient.post<Location>(this.reqPath + "/insert", location);
  }

  updateLocation(location: Location): Observable<Location> {
    return this.httpClient.put<Location>(this.reqPath + "/update", location);
  }

  deleteLocation(locationId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.reqPath + "/" + locationId);
  }
}
