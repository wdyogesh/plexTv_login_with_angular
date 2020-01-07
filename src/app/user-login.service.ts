import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  httpHeaders = new HttpHeaders ({
    'Accept': 'application/json',
    'X-Plex-Product': 'Tautulli',
    'X-Plex-Version': 'Plex OAuth',
    'X-Plex-Client-Identifier': 'false', // 'false', //'0a329e5a-2fec-4893-9f2e-6da6d1f0a6e8',
    'X-Plex-Platform': 'unknown',
    'X-Plex-Platform-Version': 'unknown',
    'X-Plex-Model': 'Plex OAuth',
    'X-Plex-Device': 'unknown',
    'X-Plex-Device-Name': 'unknown',
    'X-Plex-Device-Screen-Resolution': window.screen.width + 'x' + window.screen.height,
    'X-Plex-Language': 'en'
  });
  constructor(private http: HttpClient) {  }
  // Do login
  doLogin() {
    return this.http.post('https://plex.tv/api/v2/pins?strong=true', null, { headers: this.httpHeaders });
  }

  sendPin(pin) {
    return this.http.get('https://plex.tv/api/v2/pins/'+pin, { headers: this.httpHeaders });
  }
}