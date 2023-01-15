import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { Location } from 'src/app/models/location.model';

@Component({
  selector: 'app-restaurants-dialog',
  templateUrl: './restaurants-dialog.component.html',
  styleUrls: ['./restaurants-dialog.component.scss']
})

export class RestaurantsDialogComponent implements OnInit {
  action: Action = Action.ADD;
  locations: Location[] = [];
  restaurant: Restaurant = new Restaurant();
  nameFormControl = new FormControl('', [Validators.required]);
  ratingFormControl = new FormControl(0);
  descriptionFormControl = new FormControl('', [Validators.required]);
  locationIdFormControl = new FormControl(0, [Validators.required]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RestaurantsDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();
  }

  private getPassedData() {
    this.action = this.data.action;
    if(this.action === Action.ADD) {
      this.locations = this.data.locations;
    }

    if (this.action !== Action.ADD) {
      this.restaurant = this.data.restaurant;
    }

    if (this.action === Action.UPDATE) {
      this.nameFormControl.setValue(this.restaurant.name!!);
      this.ratingFormControl.setValue(this.restaurant.rating!!);
      this.descriptionFormControl.setValue(this.restaurant.description!!);
      this.locationIdFormControl.setValue(this.restaurant.locationId!!);
    }
  }

  selectedLocation(location: Location) {
    this.locationIdFormControl.setValue(location.id!!)
  }

  addRestaurant() {
    let newrestaurant: Restaurant = new Restaurant();
    newrestaurant.name = this.nameFormControl.getRawValue() ?? "";
    newrestaurant.rating = 0; 
    newrestaurant.description = this.descriptionFormControl.getRawValue() ?? "";
    newrestaurant.locationId = this.locationIdFormControl.getRawValue() ?? 0;

    this.dialogRef.close({ event: 'Add', data: newrestaurant });
  }

  updateRestaurant() {
    let newrestaurant: Restaurant = new Restaurant();
    newrestaurant.id = this.restaurant.id;
    newrestaurant.name = this.nameFormControl.getRawValue() ?? "";
    newrestaurant.rating = 0; 
    newrestaurant.description = this.descriptionFormControl.getRawValue() ?? "";
    newrestaurant.locationId = this.locationIdFormControl.getRawValue() ?? 0;
    
    this.dialogRef.close({ event: 'Update', data: newrestaurant });
  }

  deleteRestaurant() {
    this.dialogRef.close({ event: 'Delete', data: this.restaurant.id })
  }
}
