import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/general-components/side-menu/side-menu.component';
import { AngularMaterialModule } from './modules/angular-material-module';
import { ToolbarComponent } from './components/general-components/toolbar/toolbar.component';
import { LogoComponent } from './components/general-components/logo/logo.component';
import { LoginOrRegisterComponent } from './components/pages/login-or-register/login-or-register.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './utils/interceptor/Interceptor';
import { AccountsComponent } from './components/pages/admin-pages/accounts/accounts.component';
import { BookingsComponent } from './components/pages/admin-pages/bookings/bookings.component';
import { LocationsComponent } from './components/pages/admin-pages/locations/locations.component';
import { ReviewsComponent } from './components/pages/admin-pages/reviews/reviews.component';
import { AccountDialogComponent } from './components/pages/admin-pages/accounts/account-dialog/account-dialog.component';
import { BookingDialogComponent } from './components/pages/admin-pages/bookings/booking-dialog/booking-dialog.component';
import { LocationDialogComponent } from './components/pages/admin-pages/locations/location-dialog/location-dialog.component';
import { ReviewDialogComponent } from './components/pages/admin-pages/reviews/review-dialog/review-dialog.component';
import { ImageDialogComponent } from './components/pages/admin-pages/locations/image-dialog/image-dialog.component';
import { StarRatingComponent } from './components/general-components/star-rating/star-rating.component';
import { LocationPageComponent } from './components/pages/location-page/location-page.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { WriteAReviewComponent } from './components/pages/location-page/write-a-review/write-a-review.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { MakeAReservationComponent } from './components/pages/location-page/make-a-reservation/make-a-reservation.component';
import { TableComponent } from './components/general-components/table/table.component';
import { RestaurantsComponent } from './components/pages/admin-pages/restaurants/restaurants.component';
import { MenusComponent } from './components/pages/admin-pages/menus/menus.component';
import { MenusDialogComponent } from './components/pages/admin-pages/menus/menus-dialog/menus-dialog.component';
import { RestaurantsDialogComponent } from './components/pages/admin-pages/restaurants/restaurants-dialog/restaurants-dialog.component';
import { TablesComponent } from './components/pages/admin-pages/tables/tables.component';
import { TableDialogComponent } from './components/pages/admin-pages/tables/table-dialog/table-dialog.component';
import { MenuButtomSheetComponent } from './components/pages/admin-pages/menus/menu-buttom-sheet/menu-buttom-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    ToolbarComponent,
    LogoComponent,
    LoginOrRegisterComponent,
    HomeComponent,
    AccountsComponent,
    BookingsComponent,
    LocationsComponent,
    ReviewsComponent,
    AccountDialogComponent,
    BookingDialogComponent,
    LocationDialogComponent,
    ReviewDialogComponent,
    ImageDialogComponent,
    StarRatingComponent,
    LocationPageComponent,
    WriteAReviewComponent,
    ProfileComponent,
    MakeAReservationComponent,
    TableComponent,
    RestaurantsComponent,
    MenusComponent,
    MenusDialogComponent,
    RestaurantsDialogComponent,
    TablesComponent,
    TableDialogComponent,
    MenuButtomSheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    NgImageSliderModule,
    GoogleMapsModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
