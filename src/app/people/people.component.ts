import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Person } from '../model';
import * as Repository from '../repository';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  
  curPerson: Person;
  curIndex: number = 0;

  constructor(private appService: AppService) { }

  ngOnInit() {
    if(Repository.peopleIndex) { this.curIndex = Repository.peopleIndex; }
    this.getPerson();
  }

  getPerson() {
    if(Repository.peopleData && Repository.peopleData.length > 0) {
      let target = Repository.dataFinder("people", null, this.curIndex + 1);
      if(target) {
        this.curPerson = target;
      }
    }
    if(!this.curPerson || this.curPerson.getter('_id') != this.curIndex + 1) {
      this.appService.getAPI("people", this.curIndex + 1).subscribe(data => {
        if(data) {
          this.curPerson = Repository.parseJSON(data, "people");
          Repository.peopleDataAdder(this.curPerson);
        }
      });
    }
    Repository.valueSetter("peopleIndex", this.curIndex);
  }

  getTotalPeopleCount() {
    this.appService.getAPI("people").subscribe(data => {
      if(data && data["count"]) {
        Repository.valueSetter("peopleTotal", data["count"]);
      }
    });
  }

  callNextPerson() {
    if(!Repository.peopleTotal) { this.getTotalPeopleCount() };
    if(this.curIndex + 1 == Repository.peopleTotal) {
      this.curIndex = 1;
    } else {
      this.curIndex += 1;
    }
    this.getPerson();
  }
  
  callPrevPerson() {
    if(!Repository.peopleTotal) { this.getTotalPeopleCount() };
    if(this.curIndex == 0) {
      this.curIndex = Repository.peopleTotal;
    } else {
      this.curIndex -= 1;
    }
    this.getPerson();
  }

  genderChecker() {
    switch(this.curPerson.getter('gender')) {
      case "male": return "A Man";
      case "feamle": return "An Woman";
      case "unknown": return "An Unknown";
      default: return "Someone";
    }
  }

}
