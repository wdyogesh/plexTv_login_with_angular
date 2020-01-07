import { Component, OnInit } from '@angular/core';
import { Deferred } from 'jquery';
import { UserLoginService } from '../user-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private timer;
  plex_oauth_window = null;
  polling = null;
  $: any;
  jQuery: any;
  options = {
    keyboard : false,
    contentHeight : 450,
    contentWidth : 700
  };

  p = {
    name: 'Unknown',
    version: 'Unknown',
    os: 'Unknown'
  };
  authenticated = false;
  constructor(public UserLoginService: UserLoginService) {
  }
  
  ngOnInit() {
     
  }
  
  signInPlex() {
      this.getPlexOAuthPin()
  }
  
  getPlexOAuthPin() {
    this.plex_oauth_window = this.PopupCenter('', 'Plex-OAuth', 600, 700);
    this.UserLoginService.doLogin().subscribe((result) => {
        if (result['clientIdentifier'] != '' ||  result['code'] != '' ) {
          console.log(result['code']);
          var oauth_params = {
            'clientID': false,
            'context[device][product]': 'Tautulli',
            'context[device][version]': 'Plex OAuth',
            'context[device][platform]': 'p.name',
            'context[device][platformVersion]': 'p.version',
            'context[device][device]': 'p.os',
            'context[device][deviceName]': 'p.name',
            'context[device][model]': 'Plex OAuth',
            'context[device][screenResolution]': window.screen.width + 'x' + window.screen.height,
            'context[device][layout]': 'desktop',
            'code': result['code']
        }
        this.plex_oauth_window.location = 'https://app.plex.tv/auth/#!?' + this.encodeData(oauth_params);
        let _this = this;
        poll(result['id']);
        function poll(id) {
          _this.UserLoginService.sendPin(id).subscribe((data) => {
            if (data['authToken']) {
                 console.log(data['authToken']);
                _this.closePlexOAuthWindow();
            } else {
               if (!_this.plex_oauth_window.closed){
                  setTimeout(() => {poll(id);}, 1000);
               }
            }
          });
        }
        } else {
            console.log('Some thing Went wrong !! ');
            this.closePlexOAuthWindow();
        }
     });
  }
  
  closePlexOAuthWindow() {
    if (this.plex_oauth_window) {
        this.plex_oauth_window.close();
    }
  }

  PopupCenter(url, title, w, h) {
    // Fixes dual-screen position  Most browsers Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    // Puts focus on the new in window
    return newWindow;
  }

  // Encode the data
  encodeData(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }
}