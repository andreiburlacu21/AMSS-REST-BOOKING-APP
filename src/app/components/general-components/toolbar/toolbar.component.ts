import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {
  @Output() needToOpenSideMenu = new EventEmitter<{ openSideMenu: boolean }>();
  openSideMenu: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  expandSideMenu() {
    this.openSideMenu = !this.openSideMenu;
    this.needToOpenSideMenu.emit({
      openSideMenu: this.openSideMenu
    });
  }
}