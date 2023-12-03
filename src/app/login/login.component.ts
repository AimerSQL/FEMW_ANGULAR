import { Component } from '@angular/core';
import { UfoBattleService } from '../shared/services/ufo-battle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  token: string = '';

  isFormValid(): boolean {
    return !!this.username && !!this.password;
  }

  constructor(private conex: UfoBattleService, private router: Router) {}

  dologin(): void {
    this.conex.login(this.username, this.password).subscribe(
      (response: any) => {
          this.token = response;
          sessionStorage.setItem('token', this.token);
          sessionStorage.setItem('username', this.username);
          this.router.navigate(['/home']);
      },
      (error) => {
        if (error.status === 400) {
          console.error('Login failed: Missing username or password.');
        } else if (error.status === 401) {
          console.error('Login failed: Invalid username or password.');
        } else if (error.status === 500) {
          console.error('Login failed: Internal server error.');
        } else {
          console.error('Login failed:', error);
        }
        
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
      }
    );
  }
}
