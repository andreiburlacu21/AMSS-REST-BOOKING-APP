import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from 'src/app/models/account.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Accounts";
  }

  getAllAccounts(): Observable<Account[]> {
    return this.httpClient.get<Account[]>(this.reqPath + "/all");
  }

  getMyData(): Observable<Account> {
    return this.httpClient.get<Account>(this.reqPath + "/myProfile");
  }

  addAccount(account: Account): Observable<Account> {
    return this.httpClient.post<Account>(this.reqPath + "/insert", account);
  }

  updateAccount(account: Account): Observable<Account> {
    return this.httpClient.put<Account>(this.reqPath + "/update", account);
  }

  deleteAccount(accountId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.reqPath + "/" + accountId);
  }
}