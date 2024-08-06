import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private apiPath = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLessons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPath}lesson`);
  }

  getLookupData(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPath}lookup/${type}`);
  }

  getTeachers(): Observable<any> {
    return this.http.get(environment.apiUrl + 'teacher');
  }

  getGroups(): Observable<any> {
    return this.http.get(environment.apiUrl + 'group');
  }

  getSubjects(): Observable<any> {
    return this.http.get(environment.apiUrl + 'subjects');
  }

  getOffices(): Observable<any> {
    return this.http.get(environment.apiUrl + 'office');
  }

  addLesson(lesson: any): Observable<any> {
    return this.http.post<any>(`${this.apiPath}lesson`, lesson);
  }

  editLesson(id: number, lessonData: any): Observable<any> {
    return this.http.put(`${this.apiPath}/${id}`, lessonData);
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}lesson/${id}`);
  }

  getLessonDetails(lessonId: number): Observable<any> {
    return this.http.get<any>(`${this.apiPath}lesson/${lessonId}`);
  }
}
