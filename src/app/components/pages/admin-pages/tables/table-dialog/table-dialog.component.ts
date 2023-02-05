import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Table } from 'src/app/models/table.model';
import { Action } from 'src/app/utils/interceptor/admin-actions';

@Component({
  selector: 'app-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.scss']
})

export class TableDialogComponent implements OnInit {
  action: Action = Action.ADD;
  table: Table = new Table();
  restaurants: Restaurant[] = [];
  restaurantIdFormControl = new FormControl(0, [Validators.required]);
  numberOfSeatsFormControl = new FormControl(1, [Validators.required, Validators.min(1), Validators.max(15)]);
  isAnOutdoorsTable: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TableDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();
  }

  private getPassedData() {
    this.action = this.data.action;
    if (this.action === Action.ADD) {
      this.restaurants = this.data.restaurants;
    }

    if (this.action !== Action.ADD) {
      this.table = this.data.table;
      this.restaurants = this.data.restaurants
      this.isAnOutdoorsTable = this.table.outdoor!!;
    }

    if (this.action === Action.UPDATE) {
      this.restaurantIdFormControl.setValue(this.table.restaurantId!!);
      this.numberOfSeatsFormControl.setValue(this.table.numberOfSeats!!);
    }
  }

  selectedRestaurant(restaurant: Restaurant) {
    this.restaurantIdFormControl.setValue(restaurant.restaurantId!!)
  }

  getRestaurantNameFromId(restaurantId: number): string {
    let restaurant = this.restaurants.find(rest => rest.restaurantId === restaurantId);

    if(restaurant) {
      return restaurant.name!!;
    }

    return "Unknown";
  }

  addTable() {
    let newTable: Table = new Table();
    newTable.restaurantId = this.restaurantIdFormControl.getRawValue() ?? 0;
    newTable.numberOfSeats = this.numberOfSeatsFormControl.getRawValue() ?? 0;
    newTable.outdoor = this.isAnOutdoorsTable;

    this.dialogRef.close({ event: 'Add', data: newTable });
  }

  updateTable() {
    let newTable: Table = new Table();
    newTable.tableId = this.table.tableId;
    newTable.restaurantId = this.restaurantIdFormControl.getRawValue() ?? 0;
    newTable.numberOfSeats = this.numberOfSeatsFormControl.getRawValue() ?? 0;
    newTable.outdoor = this.isAnOutdoorsTable;

    this.dialogRef.close({ event: 'Update', data: newTable });
  }

  deleteTable() {
    this.dialogRef.close({ event: 'Delete', data: this.table.tableId });
  }
}
