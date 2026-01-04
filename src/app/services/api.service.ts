import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'HX-Request': 'true'
    })

    if (token) {
      return headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  /**
   * Get HTML fragment for users list
   */
  getUsersList(): Observable<string> {
    return this.http.get(`${this.apiUrl}/users/list`, {
      headers: this.getHeaders(),
      responseType: 'text'
    })
  }

  /**
   * Get HTML fragment for user form (create)
   */
  getUserForm(): Observable<string> {
    return this.http.get(`${this.apiUrl}/users/form`, {
      headers: this.getHeaders(),
      responseType: 'text'
    })
  }

  /**
   * Get HTML fragment for user form (edit)
   */
  getUserEditForm(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/users/${id}/form`, {
      headers: this.getHeaders(),
      responseType: 'text'
    })
  }

  /**
   * Get HTML fragment for user row
   */
  getUserRow(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/users/${id}/row`, {
      headers: this.getHeaders(),
      responseType: 'text'
    })
  }

  /**
   * Get HTML fragment for delete confirmation
   */
  getDeleteConfirmation(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/users/${id}/delete-confirm`, {
      headers: this.getHeaders(),
      responseType: 'text'
    })
  }
}

