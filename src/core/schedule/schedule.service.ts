import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiPath = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSchedule(year: number, week: number, groupId: number): Observable<any> {
    const params = new HttpParams()
      .set('year', year)
      .set('week', week)
      .set('groupId', groupId);

    return this.http.get<any>(`${this.apiPath}lesson/search`, { params });
  }

  findGroupByNumber(groupNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiPath}group/search`, {
      params: {
        name: groupNumber,
      },
    });
  }
}
