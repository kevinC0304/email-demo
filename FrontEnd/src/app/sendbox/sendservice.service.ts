import { Injectable } from '@angular/core';
import { email } from './email';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SendserviceService {

  constructor(private http : HttpClient) { }

  sendEmail(newEmail : email)  
  {
      return this.http.post('http://localhost:63056/api/values/send', newEmail);
  }
   downloadFile(file: string): Observable<HttpEvent<Blob>> {
    return this.http.request(new HttpRequest(
      'GET',
      `${"http://localhost:63056/api/values/Download"}?file=${file}`,
      null,
      {
        reportProgress: true,
        responseType: 'blob'
      }));
  }

}
