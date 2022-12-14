import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from 'src/app/models/location.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})

export class LocationDialogComponent implements OnInit {
  action: Action = Action.ADD;
  location: Location = new Location();
  nameFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
  imageLocationFormControl = new FormControl('', [Validators.required]);
  pricePerHourFormControl = new FormControl(0, [Validators.required]);
  locationXFormControl = new FormControl(0, [Validators.required]);
  locationYFormControl = new FormControl(0, [Validators.required]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly notificationService: NotificationService,
    public dialogRef: MatDialogRef<LocationDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();
  }

  private getPassedData() {
    this.action = this.data.action;
    if (this.action !== Action.ADD) {
      this.location = this.data.location;
    }

    if (this.action === Action.UPDATE) {
      this.nameFormControl.setValue(this.location.locationName!!);
      this.imageLocationFormControl.setValue(this.location.imageLocation!!);
      this.addressFormControl.setValue(this.location.address!!);
      this.pricePerHourFormControl.setValue(this.location.pricePerHour!!);
      this.locationXFormControl.setValue(this.location.locationX!!);
      this.locationYFormControl.setValue(this.location.locationY!!);
    }
  }

  addLocation() {
    let newLocation: Location = new Location();
    newLocation.locationName = this.nameFormControl.getRawValue() ?? "";
    newLocation.imageLocation = "location";
    newLocation.address = this.addressFormControl.getRawValue() ?? ""; 
    newLocation.pricePerHour = this.pricePerHourFormControl.getRawValue() ?? 0;
    newLocation.locationX = this.locationXFormControl.getRawValue() ?? 0;
    newLocation.locationY = this.locationYFormControl.getRawValue() ?? 0;

    this.dialogRef.close({ event: 'Add', data: newLocation });
  }

  updateLocation() {
    let newLocation: Location = new Location();
    newLocation.locationId = this.location.locationId;
    newLocation.locationName = this.nameFormControl.getRawValue() ?? "";
    newLocation.address = this.addressFormControl.getRawValue() ?? ""; 
    newLocation.imageLocation = "location";
    newLocation.pricePerHour = this.pricePerHourFormControl.getRawValue() ?? 0;
    newLocation.locationX = this.locationXFormControl.getRawValue() ?? 0;
    newLocation.locationY = this.locationYFormControl.getRawValue() ?? 0;
    
    this.dialogRef.close({ event: 'Update', data: newLocation });
  }

  deleteLocation() {
    this.dialogRef.close({ event: 'Delete', data: this.location.locationId })
  }
}
