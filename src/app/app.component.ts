import { Component, OnInit } from '@angular/core';
declare var device;
declare var navigator;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'apacs-client';

  ngOnInit() {
    document.addEventListener("deviceready", function() { 
      alert("CIAO"); 
      //navigator.splashscreen.hide();
    }, false); 
  }
}
