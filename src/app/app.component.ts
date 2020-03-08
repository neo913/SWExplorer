import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';
import * as Repository from './repository';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'Star Wars Explorer';
  
  constructor(public spinner: SpinnerService, private router: Router) { }

  mainChecker() {
    if(this.router.url !== '/') { return true; }
  }
}
