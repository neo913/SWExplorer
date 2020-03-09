import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Person } from '../model';
import * as Repository from '../repository';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material';
import { PeopleService } from './people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  
  curPerson: Person;
  curIndex: number = 0;

  constructor(private appService: AppService, private peopleService: PeopleService, private _snackBar: MatSnackBar, private route: ActivatedRoute, private modal: MatDialog) { }

  ngOnInit() {
    if(Repository.peopleIndex) { this.curIndex = Repository.peopleIndex; }
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.curIndex = (params['id'] - 1);
      }
    });
    if(!Repository.peopleTotal) { this.getTotalPeopleCount() };
    this.getPerson();
  }

  getPerson() {

    if(Repository.peopleData && Repository.peopleData.length > 0 ) {
      let target = Repository.dataFinder("people", null, (this.curIndex + 1));
      if(target) {
        if(!this.peopleService.personUpdated(target)) {
          target = this.peopleService.personUpdator(target);
          Repository.dataAdder(target);
        }
        this.curPerson = target;
      }
    }

    if(!this.curPerson || this.curPerson.getter('_id') != (this.curIndex + 1)) {
      this.appService.getAPI("people", (this.curIndex + 1)).subscribe(person => {
        if(person) {
          let personObj = this.peopleService.personUpdator(Repository.parseJSON(person));
          Repository.dataAdder(personObj);
          this.curPerson = personObj;
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

  share() {
    let el = document.createElement('textarea');
    el.value = window.location.origin;
    if(typeof this.curIndex) { el.value += "/people/" + (this.curIndex + 1); }
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this._snackBar.open('URL is copied!', 'OK', {
      duration: 2000,
    });
  }

  openModal(data: any) {
    const dialogRef = this.modal.open(ModalComponent, {
      width: '40%', data: data
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed');
    //   // console.log(result);
    // });
  }

  dataFinder(url: string) {
    return Repository.dataFinder(Repository.typeFinder(url), url);
  }
  
}
