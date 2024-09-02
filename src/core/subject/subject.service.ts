import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subjects } from './subject.model';
import { environment } from '../../environment/environment';
import { Paged } from '../common/models/pages.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiPath = environment.apiUrl + 'subjects';

  constructor(private http: HttpClient) {}

  getSubjects(page: number = 1, pageSize = 20): Observable<Paged<Subjects>> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('pageSize', pageSize);
    return this.http.get<Paged<Subjects>>(this.apiPath, { params: params });
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }

  addSubject(model: { name: string }): Observable<Subjects> {
    return this.http.post<Subjects>(this.apiPath, model);
  }

  getSubject(id: number): Observable<Subjects> {
    return this.http.get<Subjects>(`${this.apiPath}/${id}`);
  }

  updateSubject(id: number, model: { name: string }): Observable<void> {
    return this.http.put<void>(`${this.apiPath}/${id}`, model);
  }
}
