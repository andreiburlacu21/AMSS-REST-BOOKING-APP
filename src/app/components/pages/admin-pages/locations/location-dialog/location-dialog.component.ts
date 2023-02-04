import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from 'src/app/models/location.model';
import { Action } from 'src/app/utils/interceptor/admin-actions';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.scss']
})

export class LocationDialogComponent implements OnInit {
  action: Action = Action.ADD;
  location: Location = new Location();
  addressFormControl = new FormControl('', [Validators.required]);
  locationXFormControl = new FormControl(0, [Validators.required]);
  locationYFormControl = new FormControl(0, [Validators.required]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
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
      this.addressFormControl.setValue(this.location.address!!);
      this.locationXFormControl.setValue(this.location.x!!);
      this.locationYFormControl.setValue(this.location.y!!);
    }
  }

  addLocation() {
    let newLocation: Location = new Location();
    newLocation.address = this.addressFormControl.getRawValue() ?? ""; 
    newLocation.x = this.locationXFormControl.getRawValue() ?? 0;
    newLocation.y = this.locationYFormControl.getRawValue() ?? 0;

    this.dialogRef.close({ event: 'Add', data: newLocation });
  }

  updateLocation() {
    let newLocation: Location = new Location();
    newLocation.locationId = this.location.locationId;
    newLocation.address = this.addressFormControl.getRawValue() ?? ""; 
    newLocation.x = this.locationXFormControl.getRawValue() ?? 0;
    newLocation.y = this.locationYFormControl.getRawValue() ?? 0;
    
    this.dialogRef.close({ event: 'Update', data: newLocation });
  }

  deleteLocation() {
    this.dialogRef.close({ event: 'Delete', data: this.location.locationId })
  }
}
