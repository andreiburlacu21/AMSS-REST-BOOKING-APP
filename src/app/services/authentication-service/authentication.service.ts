import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from 'src/app/models/account.model';
import Authentication from 'src/app/models/authentication.model';
import { environment } from 'src/environments/environment';
import jwtDecode from 'jwt-decode';
import { Token } from 'src/app/models/token.interface';
import TokenData from 'src/app/models/tokendata.model';
import { Role } from 'src/app/models/role';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private AUTH: string = "loggedIn";
  private URL: string = environment.apiBaseUrl + "Authentication/";
  private AUTH_REQUEST: string = this.URL;
  private REGISTER_REQUEST: string = this.URL + "register";

  constructor(private http: HttpClient) { }

  // register wi
  register(user: Account): Observable<boolean> {
    return this.http.post<boolean>(this.REGISTER_REQUEST, user);
  }

  authenticate(auth: Authentication) {
    return this.http.post<TokenData>(this.AUTH_REQUEST, auth);
  }

  isAdmin(): boolean {

    if (this.getAccessToken() == "NULL") return false;

    var tokenData = jwtDecode<Token>(this.getAccessToken());

    return tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == Role[Role.Admin];
  }

  getAccessToken(): string {
    const value = localStorage.getItem(this.AUTH);

    if (value !== 'undefined' && value ) {
      return (JSON.parse(value) as TokenData).accessToken;
    }

    return "NULL";
  }

  setAuth(tokenData: TokenData) {
    if (tokenData.userName == "" && tokenData.accessToken == "")
      localStorage.removeItem(this.AUTH);
    else {
      localStorage.setItem(this.AUTH, JSON.stringify(tokenData));
    }
  }

  loggedIn(): boolean {
    if (this.getAccessToken() == "NULL") return false;
    return true;
  }

  getId(): number {
    if (this.getAccessToken() == "NULL") return -1;
    var TokenData = jwtDecode<Token>(this.getAccessToken());
    return TokenData.Identifier;
  }

  public checkTokenData(): void {
    if (this.getAccessToken() !== "NULL") {

      this.http.get<boolean>(this.URL + 'checkLogin').subscribe(x => {
        if (!x)
          this.logOut();
      });
    }
  }

  logOut() {
    localStorage.removeItem(this.AUTH);
    window.location.reload();
  }
}
