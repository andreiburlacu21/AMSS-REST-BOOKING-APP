import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './components/pages/admin-pages/accounts/accounts.component';
import { BookingsComponent } from './components/pages/admin-pages/bookings/bookings.component';
import { LocationsComponent } from './components/pages/admin-pages/locations/locations.component';
import { ReviewsComponent } from './components/pages/admin-pages/reviews/reviews.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LocationPageComponent } from './components/pages/location-page/location-page.component';
import { LoginOrRegisterComponent } from './components/pages/login-or-register/login-or-register.component';
import { ProfileComponent } from './components/pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login-or-register',
    component: LoginOrRegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'accounts',
    component: AccountsComponent
  },
  {
    path: 'bookings',
    component: BookingsComponent
  },  
  {
    path: 'locations',
    component: LocationsComponent
  },
  {
    path: 'reviews',
    component: ReviewsComponent
  },
  {
    path: 'location-page',
    component: LocationPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
