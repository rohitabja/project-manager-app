import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpclientHelperService {

  private baseUrl = "http://localhost:8081/api";

  constructor(private http: HttpClient) { }

  getCall(url: string, operation: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const constructUrl = `${this.baseUrl}/${url}`;

    return this.http.get<any>(constructUrl, httpOptions)
                    .pipe(catchError(this.handleError(operation, [])));
  }

  postCall(url: string, requestBody: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const constructUrl = `${this.baseUrl}/${url}`;

    return this.http.post<any>(constructUrl, requestBody, httpOptions)
                    .pipe(catchError(err => {
                      console.error('Error occurred while submitting request: ', err.error.message);
                      return throwError(err);
                    }));
  }

  deleteCall(url: string): void {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const constructUrl = `${this.baseUrl}/${url}`;

    this.http.delete(constructUrl, httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return(errResp: any): Observable<T> => {
      console.error('Error occurred in operation, ' + operation + ': ' + errResp.error.message);
      return of(result as T);
    }
  }
}
