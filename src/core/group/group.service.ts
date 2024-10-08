import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './group.model';
import { environment } from '../../environment/environment';
import { Paged } from '../common/models/pages.model';
import { Lesson } from '../lesson/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiPath = environment.apiUrl + 'group';

  constructor(private http: HttpClient) {}

  getGroups(page: number = 1, pageSize = 20): Observable<Paged<Group>> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('pageSize', pageSize);
    return this.http.get<Paged<Group>>(this.apiPath, { params: params });
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }

  addGroup(model: { name: string }): Observable<Group> {
    return this.http.post<Group>(this.apiPath, model);
  }

  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiPath}/${id}`);
  }

  updateGroup(id: number, model: { name: string }): Observable<void> {
    return this.http.put<void>(`${this.apiPath}/${id}`, model);
  }

  checkGroupUsage(
    groupId: number
  ): Observable<{ used: boolean; lessons: Lesson[] }> {
    return this.http.get<{ used: boolean; lessons: Lesson[] }>(
      `${this.apiPath}/check-deletion/${groupId}`
    );
  }
}
