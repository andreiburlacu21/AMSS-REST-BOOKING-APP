import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Menu } from 'src/app/models/menu.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { MenuService } from 'src/app/services/menu-service/menu.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { RestaurantService } from 'src/app/services/restaurant-service/restaurant.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { MenuButtomSheetComponent } from './menu-buttom-sheet/menu-buttom-sheet.component';
import { MenusDialogComponent } from './menus-dialog/menus-dialog.component';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})

export class MenusComponent implements OnInit {
  isLoading: boolean = false;
  restaurantsAreLoading: boolean = false;
  menus: Menu[] = [];
  restaurants: Restaurant[] = []

  constructor(private readonly menuService: MenuService,
    private readonly restaurantService: RestaurantService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog,
    private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    this.getAllMenus();
    this.getAllRestaurants();
  }

  private getAllMenus() {
    this.isLoading = true;

    this.menuService.getAllMenus().subscribe({
      next: resp => {
        this.menus = resp;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.notificationService.showErrorNotification("There was an error while loading existing menus!");
        this.isLoading = false;
      }
    });
  }

  getRestaurantOfTheMenu(restaurantId: number) {
    return this.restaurants.find(rest => rest.restaurantId === restaurantId);
  }

  private getAllRestaurants() {
    this.restaurantsAreLoading = true;

    this.restaurantService.getAllRestaurants().subscribe({
      next: resp => {
        this.restaurants = resp;
        this.restaurantsAreLoading = false;
      },
      error: err => {
        console.log(err);
        this.notificationService.showErrorNotification("There was an error while loading existing restaurants!");
        this.restaurantsAreLoading = false;
      }
    });
  }

  addMenu() {
    let dialogRef = this.dialog.open(MenusDialogComponent, {
      width: '500px',
      data: {
        action: Action.ADD,
        restaurants: this.restaurants
      }
    })

    dialogRef.afterClosed().subscribe(newMenu => {
      if (newMenu.data) {
        this.menuService.addMenu(newMenu.data).subscribe(resp => {
          this.notificationService.showSuccessNotification("Menu added!");
          this.getAllMenus();
        });
      }
    });
  }

  editMenu(menu: Menu) {
    let dialogRef = this.dialog.open(MenusDialogComponent, {
      width: '500px',
      data: {
        action: Action.UPDATE,
        menu: menu
      }
    })

    dialogRef.afterClosed().subscribe(updatedMenu => {
      if (updatedMenu.data) {
        this.menuService.updateMenu(updatedMenu.data).subscribe({
          next: resp => {
            this.notificationService.showSuccessNotification("Menu updated!");
            this.getAllMenus();
          },
          error: () => {
            this.notificationService.showErrorNotification("Menu update failed!");
          }
        });
      }
    });
  }

  deleteMenu(menu: Menu) {
    let dialogRef = this.dialog.open(MenusDialogComponent, {
      width: '500px',
      data: {
        action: Action.DELETE,
        menu: menu
      }
    })

    dialogRef.afterClosed().subscribe(MenuId => {
      if (MenuId.data) {
        this.menuService.deleteMenu(MenuId.data).subscribe({
          next: resp => {
            this.notificationService.showSuccessNotification("Menu deleted!");
            this.getAllMenus();
          },
          error: () => {
            this.notificationService.showErrorNotification("Menu deletion failed!");
          }
        });
      }
    });
  }

  openMenu(menu: Menu) {
    const config: MatBottomSheetConfig = { data: { menu: menu } };
    this._bottomSheet.open(MenuButtomSheetComponent, config);
  }
}
