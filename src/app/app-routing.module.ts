import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {PlayComponent} from './play/play.component';
import {PreferencesComponent} from './preferences/preferences.component';
import {RecordsComponent} from './records/records.component';
import {RegisterComponent} from './register/register.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'play', component: PlayComponent },
  { path: 'records', component: RecordsComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo:'home', pathMatch: 'full' },
  { path: '**', redirectTo:'/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
