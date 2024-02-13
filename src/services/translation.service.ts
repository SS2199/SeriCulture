import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly key = '563e7369cb4a42599ba282ebc6842be0';
  private readonly endpoint = 'https://api.cognitive.microsofttranslator.com';

  constructor(private http: HttpClient) { }

  translateText(text: string, targetLanguage: string): Observable<string> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': this.key,
      'Content-type': 'application/json',
      'X-ClientTraceId': this.generateGuid()
    });

    const body = [{
      'text': text
    }];

    return this.http.post<any>(
      `${this.endpoint}/translate?api-version=3.0&to=${targetLanguage}`,
      body,
      { headers }
    ).pipe(
      map(response => response[0].translations[0].text),
      catchError(error => {
        console.error('Error translating text:', error);
        return throwError('Translation failed');
      })
    );
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
