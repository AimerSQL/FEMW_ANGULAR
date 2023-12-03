import { Component } from '@angular/core';
import { UfoBattleService } from '../shared/services/ufo-battle.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  passwordCheck: string = '';
  exits:boolean = false;

  constructor(private conex: UfoBattleService) {}

  isFormValid(): boolean {
    return !!this.username && !!this.email && !!this.password && !!this.passwordCheck;
  }
  
  register() {
    if (this.password !== this.passwordCheck) {
      alert('Passwords do not match.');
      return;
    }

    this.checkUsernameAvailability();

    if(this.exits) {
      return
    };

    this.conex.registerUser(this.username, this.email, this.password).subscribe(
      () => {
        alert('Registration successful!')
      },
      (error) => {
        if (error.status === 400) {
          console.error('Registration failed: Missing username, email, or password.');
        } else if (error.status === 409) {
          console.error('Registration failed: Duplicate username.');
        } else if (error.status === 500) {
          console.error('Registration failed: Internal server error.');
        } else {
          console.error('Registration failed:', error);
        }
      }
    );
  }

  checkUsernameAvailability() {
    this.conex.getUserInfo(this.username).subscribe(
      () => {
        this.exits = true
      },
      (error) => {
        if (error.status === 404) {
          console.log(error);
        }
      }
    );
  }
}
