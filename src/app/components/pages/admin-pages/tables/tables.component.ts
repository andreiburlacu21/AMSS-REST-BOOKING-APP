import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Table } from 'src/app/models/table.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { RestaurantService } from 'src/app/services/restaurant-service/restaurant.service';
import { TableService } from 'src/app/services/table-service/table.service';
import { Action } from 'src/app/utils/interceptor/admin-actions';
import { TableDialogComponent } from './table-dialog/table-dialog.component';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})

export class TablesComponent implements OnInit {
  isLoading: boolean = false;
  restaurantsAreLoading: boolean = false;
  restaurants: Restaurant[] = [];
  tables: Table[] = [];

  constructor(private tableService: TableService,
    private restaurantService: RestaurantService,
    private notificationService: NotificationService,
    private readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllTables();
    this.getAllRestaurants()
  }

  private getAllTables() {
    this.isLoading = true;
    this.tables = [];

    this.tableService.getAllTables().subscribe({
      next: resp => {
        this.tables = resp;
        this.isLoading = false;
      },
      error: err => {
        this.notificationService.showErrorNotification("There was a problem while fetching existing tables!");
        this.isLoading = false;
        console.log(err);
      }
    });
  }
  
  private getAllRestaurants() {
    this.restaurantsAreLoading = true;
    this.restaurants = [];

    this.restaurantService.getAllRestaurants().subscribe({
      next: resp => {
        this.restaurants = resp;
        this.restaurantsAreLoading = false;
      },
      error: err => {
        this.notificationService.showErrorNotification("There was a problem while fetching existing restaurants!");
        this.restaurantsAreLoading = false;
        console.log(err);
      }
    });
  }

  addTable() {
    let dialogRef = this.dialog.open(TableDialogComponent, {
      width: '500px',
      data: {
        action: Action.ADD,
        restaurants: this.restaurants
      }
    })

    dialogRef.afterClosed().subscribe(newTable => {
      if (newTable.data) {
        this.tableService.addTable(newTable.data).subscribe(
        {
          next: () => {
            this.notificationService.showSuccessNotification("Table added!");
            this.getAllTables();
          },
          error: (err) => {
            console.log(err);
            this.notificationService.showErrorNotification("There was an error while adding the new table!");
          }
        });
      }
    });
  }

  editTable(table: Table) {
    let dialogRef = this.dialog.open(TableDialogComponent, {
      width: '500px',
      data: {
        action: Action.UPDATE,
        table: table,
        restaurants: this.restaurants
      }
    })

    dialogRef.afterClosed().subscribe(updatedTable => {
      if (updatedTable.data) {
        console.log(updatedTable.data);
        this.tableService.updateTable(updatedTable.data).subscribe(
        {
          next: () => {
            this.notificationService.showSuccessNotification("Table updated!");
            this.getAllTables();
          },
          error: (err) => {
            console.log(err);
            this.notificationService.showErrorNotification("There was an error while updating the table!");
          }
        });
      }
    });
  }

  deleteTable(table: Table) {
    let dialogRef = this.dialog.open(TableDialogComponent, {
      width: '500px',
      data: {
        action: Action.DELETE,
        table: table,
        restaurants: this.restaurants
      }
    })

    dialogRef.afterClosed().subscribe(tableId => {
      if (tableId.data) {
        this.tableService.deleteTable(tableId.data).subscribe({
          next: resp => {
            this.notificationService.showSuccessNotification("Table deleted!");
            this.getAllTables();
          },
          error: () => {
            this.notificationService.showErrorNotification("Table deletion failed!");
          }
        });
      }
    });
  }

  getRestaurantNameOfTheTable(restaurantId: number) {
    let restaurant = this.restaurants.find(rest => rest.restaurantId === restaurantId);

    if(restaurant) {
      return restaurant.name;
    }

    return "Unknown";
  }
}
