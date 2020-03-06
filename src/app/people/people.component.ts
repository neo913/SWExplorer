import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  constructor(private http: HttpClient, private appService: AppService) { }

  ngOnInit() {
    this.http.get('https://swapi.co/api/people').subscribe(data =>{
      console.log(data);
    });
    this.appService.getAPI().subscribe(data => {
      console.log(data);
    });

  }


}
