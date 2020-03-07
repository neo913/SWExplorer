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
    if(Repository.peopleData && Repository.peopleData.length > 0) {
      let target = Repository.dataFinder("people", null, this.curIndex + 1);
      if(target) {
        this.curPerson = target;
      }
    }
    if(!this.curPerson || this.curPerson.getter('_id') != this.curIndex + 1) {
      this.appService.getAPI("people", this.curIndex + 1).subscribe(person => {
        if(person) {
          this.curPerson = Repository.parseJSON(person, "people");
          // homeworld update // No API call when this finds object in Repository
          if(Repository.dataFinder("planets", person["homeworld"])) {
            this.curPerson.setter('homeworld', Repository.dataFinder("planets", person["homeworld"]).getter('name'));
          } else {
            this.appService.getAPIwithExactPath(person["homeworld"]).subscribe(planet => {
              if(planet) {
                this.curPerson.setter('homeworld', planet["name"]);
              }
            });
          }
          // films update // No API call when this finds objects in Repository
          let filmsList = new Array<string>();
          if(Repository.filmsData && Repository.filmsData.length > 0) {
            person["films"].map(filmUrl => {
              // if(Repository.dataFinder("films", filmUrl)) { }  // Unnecessary 
              filmsList.push(Repository.dataFinder("films", filmUrl).getter('title'));
            });
          }
          if(person["films"].length !== filmsList.length) {
            filmsList = new Array<string>();
            this.curPerson.getter('films').map(film => {
              this.appService.getAPIwithExactPath(film).subscribe(filmData => {
                if(filmData) {
                  filmsList.push(filmData["title"]);
                }
              })
            });
          }

          this.curPerson.setter('films', filmsList)
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
