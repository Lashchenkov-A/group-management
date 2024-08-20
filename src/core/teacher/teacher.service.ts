import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from './teacher.model';
import { environment } from '../../environment/environment';
import { Paged } from '../common/models/pages.model';
import { TeacherFormModel } from '../../app/teacher/component/teacher-form/teacher-form.component';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiPath = environment.apiUrl + 'teachers';

  constructor(private http: HttpClient) {}

  getTeachers(
    page: number = 1,
    pageSize: number = 2
  ): Observable<Paged<Teacher>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<Paged<Teacher>>(this.apiPath, { params });
  }

  getTeacher(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiPath}/${id}`);
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }

  addTeacher(model: TeacherFormModel, file?: File): Observable<Teacher> {
    const formData = new FormData();
    formData.append('firstName', model.firstName);
    formData.append('secondName', model.secondName);
    formData.append('lastName', model.lastName);
    formData.append('jobRole', model.jobRole);
    if (file) {
      formData.append('photo', file);
    }
    return this.http.post<Teacher>(this.apiPath, formData);
  }

  updateTeacher(teacherId: number, teacherData: TeacherFormModel) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Teacher>(`${this.apiPath}/${teacherId}`, teacherData, {
      headers,
    });
  }

  uploadTeacherPhoto(
    id: number,
    file: File
  ): Observable<{ photoPath: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<{ photoPath: string }>(
      `${this.apiPath}/upload-photo/${id}`,
      formData
    );
  }
}
