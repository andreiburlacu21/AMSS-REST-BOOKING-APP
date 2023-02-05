import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from 'src/app/models/table.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TableService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Table";
  }

  getAllTables(): Observable<Table[]> {
    return this.httpClient.get<Table[]>(this.reqPath + "/all");
  }

  addTable(table: Table): Observable<Table> {
    return this.httpClient.post<Table>(this.reqPath + "/insert", table);
  }

  updateTable(table: Table): Observable<Table> {
    return this.httpClient.put<Table>(this.reqPath + "/update", table);
  }

  deleteTable(tableId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.reqPath + "/" + tableId);
  }
}
