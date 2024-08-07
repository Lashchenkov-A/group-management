import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from './teacher.model';
import { environment } from '../../environment/environment';
import { Paged } from '../common/models/pages.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiPath = environment.apiUrl + 'teachers';

  constructor(private http: HttpClient) {}

  getTeachers(page: number = 1, pageSize = 2): Observable<Paged<Teacher>> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('pageSize', pageSize);
    return this.http.get<Paged<Teacher>>(this.apiPath, { params: params });
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }

  addTeacher(model: {
    firstName: string;
    secondName: string;
    lastName: string;
    jobRole: string;
  }): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiPath, model);
  }

  getTeacher(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiPath}/${id}`);
  }

  updateTeacher(
    id: number,
    model: {
      firstName: string;
      secondName: string;
      lastName: string;
      jobRole: string;
    }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiPath}/${id}`, model);
  }
}
