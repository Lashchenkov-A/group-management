import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    pageSize: number = 20
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

  addTeacher(model: TeacherFormModel): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiPath, model);
  }

  updateTeacher(
    teacherId: number,
    teacherData: TeacherFormModel
  ): Observable<void> {
    return this.http.put<void>(`${this.apiPath}/${teacherId}`, teacherData);
  }

  uploadTeacherPhoto(file: File): Observable<{ photoPath: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<{ photoPath: string }>(
      `${this.apiPath}/upload-photo`,
      formData
    );
  }
}
