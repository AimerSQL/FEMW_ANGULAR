import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FEM_Angular';

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.router.navigate(['/home']);
  }
}
