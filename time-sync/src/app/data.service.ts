import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getNumVisitors(): Observable<any> {
    return this.http.get('https://localhost:5000/num-visitors');
  }

  sendTime(payload: any): Observable<any> {
    return this.http.post('https://localhost:3000/update-time', payload);
  }

  getMaxTime(): Observable<any> {
    return this.http.get('https://localhost:5000/max-time');
  }
}
