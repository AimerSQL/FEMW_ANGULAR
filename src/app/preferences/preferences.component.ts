import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent {
  selectedRange: string = '1';
  selectedTime: string = '60';
  constructor(private router: Router){}
  savePreferences() {
    localStorage.setItem('rangePreference', this.selectedRange);
    localStorage.setItem('timePreference', this.selectedTime);
    this.router.navigate(['/play']);
  }
}
