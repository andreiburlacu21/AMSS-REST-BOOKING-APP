import { Component, Input, OnInit } from '@angular/core';
import { Table } from 'src/app/models/table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() numberOfSeats: number = 0;
  @Input() isSelected!: boolean;
  @Input() isOccupied!: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}
