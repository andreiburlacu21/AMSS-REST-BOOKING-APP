import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Location } from 'src/app/models/location.model';
import { LocationService } from 'src/app/services/location-service/location.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})

export class LocationsComponent implements OnInit {
  isLoading: boolean = false;
  locations: Location[] = [];

  constructor(private readonly locationService: LocationService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllLocations();
  }

  private getAllLocations() {
    this.isLoading = true;

    this.locationService.getAllLocations().subscribe({
      next: resp => {
        this.locations = resp;
        this.isLoading = false;
      }, 
      error: () => {
        this.isLoading = false;
      }
    });
    
  }

  addLocation() {
    let dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '500px',
      data: {
        action: Action.ADD
      }
    })

    dialogRef.afterClosed().subscribe(newLocation => {
      if (newLocation.data) {
        this.locationService.addLocation(newLocation.data).subscribe(resp => {
          this.notificationService.showSuccessNotification("Location added!");
          this.getAllLocations();
        });
      }
    });
  }

  editLocation(location: Location) {
    let dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '500px',
      data: {
        action: Action.UPDATE,
        location: location
      }
    })

    dialogRef.afterClosed().subscribe(updatedLocation => {
      if(updatedLocation.data) {
        this.locationService.updateLocation(updatedLocation.data).subscribe({
          next: resp => {
            this.notificationService.showSuccessNotification("Location updated!");
            this.getAllLocations();
          },
          error: () => {
            this.notificationService.showErrorNotification("Location update failed!");
          }
        });
      }
    });
  }

  addImage(location: Location) {
    let dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '500px',
      data: {
        location: location
      }
    })
  }

  deleteLocation(location: Location) {
    let dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '500px',
      data: {
        action: Action.DELETE,
        location: location
      }
    })

    dialogRef.afterClosed().subscribe(locationId => {
      if(locationId.data) {
        this.locationService.deleteLocation(locationId.data).subscribe({
          next: resp => {
            this.notificationService.showSuccessNotification("Location deleted!");
            this.getAllLocations();
          },
          error: () => {
            this.notificationService.showErrorNotification("Location deletion failed!");
          }
        });
      }
    });
  }
}
