import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UfoBattleService {
   private baseurl = 'http://fenw.etsisi.upm.es:10000';

  constructor(private http: HttpClient) { }

  getRecords() {
    return this.http.get (this.baseurl + '/records');
  }

  getRecordsByUser(username: string | null) {
    const url = `${this.baseurl}/records/${username}`;
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': sessionStorage.getItem('token') || '',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  
    return this.http.get(url, { headers });
  }
  
  

  login(username: string, password: string) {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
  
    return this.http.get(this.baseurl + '/users/login', { params });
  }

  registerUser(username: string, email: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('email', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(`${this.baseurl}/users`, body.toString(), { headers });
  }
  
  getUserInfo(username: string) {
    return this.http.get(`${this.baseurl}${username}`);
  }

  save(punctuation: number, ufos: number, disposedTime: number) {
    const url = `${this.baseurl}/records`;
  
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': sessionStorage.getItem('token') || '',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  
    const body = `punctuation=${punctuation}&ufos=${ufos}&disposedTime=${disposedTime}`;
  
    return this.http.post(url, body, { headers });
  }
  
}
