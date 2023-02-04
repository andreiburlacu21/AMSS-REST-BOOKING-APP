import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from 'src/app/models/menu.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Menu";
  }

  getAllMenus(): Observable<Menu[]> {
    return this.httpClient.get<Menu[]>(this.reqPath + "/all");
  }

  addMenu(menu: Menu): Observable<Menu> {
    return this.httpClient.post<Menu>(this.reqPath + "/insert", menu);
  }

  updateMenu(menu: Menu): Observable<Menu> {
    return this.httpClient.put<Menu>(this.reqPath + "/update", menu);
  }

  deleteMenu(menuId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.reqPath + "/" + menuId);
  }
}
