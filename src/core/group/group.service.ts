import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './group.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiPath = environment.apiUrl + 'group';

  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiPath);
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
}
