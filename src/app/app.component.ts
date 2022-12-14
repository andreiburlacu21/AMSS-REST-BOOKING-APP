import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './services/account-service/account.service';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { NotificationService } from './services/notification-service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'RESTAURANTS-BOOKING';
  openSideMenu: boolean = false;
  isUserLoggedId: boolean = false;
  theme: string = 'LIGHT';
  hideSidenav: boolean = false;

  constructor(private _overlayContainer: OverlayContainer,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService) {
    if (!localStorage.getItem('theme') === null) {
      this.updateThemeInLocalStorage();
    } else {
      this.theme = localStorage.getItem('theme') as string;
      if (this.theme === 'LIGHT') {
        this.changeThemeInOverlayContainer('light-theme');
      } else {
        this.changeThemeInOverlayContainer('dark-theme');
      }
    }

    this.checkIfUserIsLoggedIn();
  }

  @HostListener('document:click', ['$event'])
  documentClick() {
    this.hideSidenav = environment.hideSidenav;
  }

  openOrCloseTheSideMenu(eventData: { openSideMenu: boolean }) {
    this.openSideMenu = eventData.openSideMenu;
  }

  private changeThemeInOverlayContainer(theme: 'dark-theme' | 'light-theme'): void {
    const overlayContainerClasses = this._overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses);
    themeClassesToRemove.filter((item: string) => item.includes('-theme'));

    if (overlayContainerClasses.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(theme);
  }

  changeTheme(eventData: { changeToDarkMode: boolean }): void {
    if (eventData.changeToDarkMode) {
      this.theme = 'DARK';
      this.updateThemeInLocalStorage();
      this.changeThemeInOverlayContainer('dark-theme');
    } else {
      this.theme = 'LIGHT';
      this.updateThemeInLocalStorage();
      this.changeThemeInOverlayContainer('light-theme')
    }
    environment.theme = this.theme;
  }

  private updateThemeInLocalStorage() {
    localStorage.setItem('theme', this.theme);
  }

  userLoggedIn(eventData: { loggedIn: boolean }) {
    if (eventData.loggedIn) {
      this.isUserLoggedId = true;
      if (this.authenticationService.isAdmin()) {
        environment.isAdmin = true;
      }
    }
  }

  checkIfUserIsLoggedIn(): void {
    if (this.authenticationService.loggedIn()) {
      this.isUserLoggedId = true;
      if (this.authenticationService.isAdmin()) {
        environment.isAdmin = true;
      }
      this.notificationService.showSuccessNotification("Welcome!");
    }
  }

  logout() {
    this.authenticationService.logOut();
    this.notificationService.showSuccessNotification("See you soon!");
    this.isUserLoggedId = false;
  }
}
