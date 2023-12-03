import { Component } from '@angular/core';
import { UfoBattleService } from '../shared/services/ufo-battle.service';
import { records } from '../shared/models/record.model';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
  myRecords: records[] = [];
  userRecords: records[] = [];
  constructor(private conex: UfoBattleService) {}

  getRecords() {
    this.conex.getRecords().subscribe((value: any) => {
      this.myRecords = value;
    });
  }

  getRecordsByUser() {
    this.conex.getRecordsByUser(localStorage.getItem('username')).subscribe((value: any) => {
      this.userRecords = value;
    });
  }


  ngOnInit() {
    this.getRecords();
    this.getRecordsByUser();
  }
}
