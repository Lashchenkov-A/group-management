import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Office } from './office.model';
import { environment } from '../../environment/environment';
import { Paged } from '../common/models/pages.model';

@Injectable({
  providedIn: 'root',
})
export class OfficeService {
  private apiPath = environment.apiUrl + 'office';

  constructor(private http: HttpClient) {}

  getOffices(page: number = 1, pageSize = 2): Observable<Paged<Office>> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('pageSize', pageSize);
    return this.http.get<Paged<Office>>(this.apiPath, { params: params });
  }

  deleteOffice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath}/${id}`);
  }

  addOffice(model: {
    corpusNumber: number;
    classroomNumber: number;
  }): Observable<Office> {
    return this.http.post<Office>(this.apiPath, model);
  }

  getOffice(id: number): Observable<Office> {
    return this.http.get<Office>(`${this.apiPath}/${id}`);
  }

  updateOffice(
    id: number,
    model: { corpusNumber: number; classroomNumber: number }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiPath}/${id}`, model);
  }
}
