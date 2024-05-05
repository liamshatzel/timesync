import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getNumVisitors(): Observable<any> {
    console.log('Getting number of visitors');
    console.log(this.http.get('http://localhost:3000/num-visitors'));
    return this.http.get('http://localhost:3000/num-visitors');
  }

  sendTime(payload: any): Observable<any> {
    return this.http.post('http://localhost:3000/update-time', payload);
  }

  getMaxTime(): Observable<any> {
    return this.http.get('http://localhost:3000/max-time');
  }
}
