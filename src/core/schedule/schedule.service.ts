import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = 'https://localhost:44330/api';

  constructor(private http: HttpClient) {}

  getSchedule(year: number, week: number, groupId: number): Observable<any> {
    const params = new HttpParams()
      .set('year', year)
      .set('week', week)
      .set('groupId', groupId);

    return this.http.get<any>(`${this.apiUrl}/lesson/search`, { params });
  }

  findGroupByNumber(groupNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group/search`, {
      params: {
        name: groupNumber,
      },
    });
  }
}
