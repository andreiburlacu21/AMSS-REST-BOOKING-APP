import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Menu } from 'src/app/models/menu.model';

@Component({
  selector: 'app-menu-buttom-sheet',
  templateUrl: './menu-buttom-sheet.component.html',
  styleUrls: ['./menu-buttom-sheet.component.scss']
})
export class MenuButtomSheetComponent implements OnInit {
  menu: Menu = new Menu();

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<MatBottomSheetRef>) { }

  ngOnInit(): void {
    this.menu = this.data.menu;
  }
}
