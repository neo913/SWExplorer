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
    if(!Repository.peopleTotal) { this.getTotalPeopleCount() };
    this.getPerson();
  }

  getPerson() {

    if(Repository.peopleData && Repository.peopleData.length > 0 ) {
      let target = Repository.dataFinder("people", null, this.curIndex + 1);
      if(target) {
        if(!this.personUpdated(target)) {
          target = this.personUpdator(target);
          Repository.dataAdder(target);
        }
        this.curPerson = target;
      }
    }

    if(!this.curPerson || this.curPerson.getter('_id') != this.curIndex + 1) {
      this.appService.getAPI("people", this.curIndex + 1).subscribe(person => {
        if(person) {
          let personObj = this.personUpdator(Repository.parseJSON(person));
          Repository.dataAdder(personObj);
          this.curPerson = personObj;
        }
      });
    }
    Repository.valueSetter("peopleIndex", this.curIndex);
  }

  personUpdated(data: Person) {
    if(!data.getter('homeworldName') || !data.getter('filmsList') || data.getter('filmsList').length == 0) {
     return false; 
    }
    return true;
  }

  personUpdator(data: Person) {
    
    if(!data.getter('homeworldName')) {
      if(Repository.dataFinder("planets", data.getter('homeworld'))) {
        data.setter('homeworldName', Repository.dataFinder("planets", data.getter("homeworld")).getter('name'));
      } else {
        this.appService.getAPIwithExactPath(data.getter('homeworld')).subscribe(planet => {
          data.setter('homeworldName', planet["name"]);
          Repository.dataAdder(Repository.parseJSON(planet));
        });
      }
    }

    if(data.getter('films').length !== data.getter('filmsList').length) {
      data.setter('filmsList', new Array<string>());
      data.getter('films').map(filmUrl => {
        if(Repository.dataFinder('films', filmUrl)) {
          data.getter('filmsList').push(Repository.dataFinder('films', filmUrl).getter('title'));
        } else {
          this.appService.getAPIwithExactPath(filmUrl).subscribe(film => {
            data.getter('filmsList').push(film["title"]);
            Repository.dataAdder(Repository.parseJSON(film));
          });
        }
      });
    }
    
    return data;
  }

  getTotalPeopleCount() {
    this.appService.getAPI("people").subscribe(data => {
      if(data && data["count"]) {
        Repository.valueSetter("peopleTotal", data["count"]);
      }
    });
  }

  callNextPerson() {
    if(this.curIndex == 15) { this.curIndex++; }  // API doesn't provide https://swapi.co/people/17 (404)
    if(this.curIndex == Repository.peopleTotal - 1) {
      this.curIndex = 0;
    } else {
      this.curIndex += 1;
    }
    this.getPerson();
  }
  
  callPrevPerson() {
    if(this.curIndex == 17) { this.curIndex--; }  // API doesn't provide https://swapi.co/people/17 (404)
    if(this.curIndex == 0) {
      this.curIndex = Repository.peopleTotal - 1;
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
