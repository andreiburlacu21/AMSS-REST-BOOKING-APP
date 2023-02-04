import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Menu } from 'src/app/models/menu.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Action } from 'src/app/utils/interceptor/admin-actions';

@Component({
  selector: 'app-menus-dialog',
  templateUrl: './menus-dialog.component.html',
  styleUrls: ['./menus-dialog.component.scss']
})

export class MenusDialogComponent implements OnInit {
  action: Action = Action.ADD;
  menu: Menu = new Menu();
  restaurants: Restaurant[] = [];
  restaurantIdFormControl = new FormControl(0, [Validators.required]);
  contentFormControl = new FormControl('', [Validators.required]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MenusDialogComponent>) { }

  ngOnInit(): void {
    this.getPassedData();
    console.log(this.restaurants);
  }

  private getPassedData() {
    this.action = this.data.action;
    if(this.action === Action.ADD) {
      this.restaurants = this.data.restaurants;
    }

    if (this.action !== Action.ADD) {
      this.menu = this.data.menu;
    }

    if (this.action === Action.UPDATE) {
      this.restaurantIdFormControl.setValue(this.menu.restaurantId!!);
      this.contentFormControl.setValue(this.menu.content!!);
    }
  }

  selectedRestaurant(restaurant: Restaurant) {
    this.restaurantIdFormControl.setValue(restaurant.restaurantId!!)
  }

  addMenu() {
    let newMenu: Menu = new Menu();
    newMenu.restaurantId = this.restaurantIdFormControl.getRawValue() ?? 0;
    newMenu.content = this.contentFormControl.getRawValue() ?? "";

    this.dialogRef.close({ event: 'Add', data: newMenu });
  }

  updateMenu() {
    let newMenu: Menu = new Menu();
    newMenu.menuId = this.menu.menuId;
    newMenu.restaurantId = this.restaurantIdFormControl.getRawValue() ?? 0;
    newMenu.content = this.contentFormControl.getRawValue() ?? "";

    this.dialogRef.close({ event: 'Update', data: newMenu });
  }

  deleteMenu() {
    this.dialogRef.close({ event: 'Delete', data: this.menu.menuId });
  }
}
