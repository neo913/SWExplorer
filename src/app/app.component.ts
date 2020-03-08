import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';
import * as Repository from './repository';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'SWExplorer';
  
  constructor(public spinner: SpinnerService) { }

  test () { Repository.test() }
}
