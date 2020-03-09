import { Component, OnInit, Inject, Injector, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import * as Repository from '../repository';
import { Person, Planet, Film } from '../model';
import { AppService } from '../app.service';
import { PeopleService } from '../people/people.service';
import { PlanetsService } from '../planets/planets.service';
import { FilmsService } from '../films/films.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [PeopleService, PlanetsService, FilmsService]
})
export class ModalComponent implements OnInit, AfterViewInit {

  modalData: any;
  dataType: string;
  personDetail: Person;
  peopleTotal: number;
  personSearchStr: string;
  peopleIndex: number = 0;

  constructor(public dialogRef: MatDialogRef<ModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService,
    private peopleService: PeopleService,
    private planetsService: PlanetsService,
    private filmsService: FilmsService,
    private _snackBar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {

    if(typeof this.data == 'string' && /^[https]/.test(this.data)) {
      this.dataType = Repository.typeFinder(this.data);
      this.modalData = this.getSingleData(this.data);
    } else if(this.data instanceof Array) {
      this.dataType = "peopleList";
      this.modalData = this.data;
      this.peopleTotal = Repository.peopleTotal;
    }
    
  }

  closeModal() {
    this.dialogRef.close();
  }
  
  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }
  
  getSingleData(url: string) {
    let obj;
    let type = Repository.typeFinder(url);
    switch(type){
      case 'people':  
                      if(Repository.peopleData && Repository.peopleData.length > 0) {
                        obj = Repository.dataFinder("people", url);
                      }
                      if(obj) {
                        if(!this.peopleService.personUpdated(obj)) {
                          obj = this.peopleService.personUpdator(obj);
                          Repository.dataAdder(obj);
                        }
                      } else {
                        obj = this.appService.getAPIwithExactPath(url).subscribe(person => {
                          if(person) {
                            let personObj = this.peopleService.personUpdator(Repository.parseJSON(person));
                            Repository.dataAdder(personObj);
                            obj = personObj;
                          }
                        });
                      }
                      break;
      case 'planets': 
                      if(Repository.planetsData && Repository.planetsData.length > 0) {
                        obj = Repository.dataFinder("planets", url);
                      }
                      if(obj) {
                        obj = this.planetsService.planetUpdator(obj);
                      } else {
                        this.appService.getAPIwithExactPath(url).subscribe(planet => {
                          if(planet) {
                            let planetObj = this.planetsService.planetUpdator(Repository.parseJSON(planet));
                            Repository.dataAdder(planetObj);
                            obj = planetObj;
                            console.log(obj);
                          }
                        });
                      }
                      break;
      case 'films':   
                      if(Repository.filmsData && Repository.filmsData.length > 0) {
                        obj = Repository.dataFinder("films", url);
                      }
                      if(obj) {
                        if(!this.filmsService.filmUpdated(obj)) {
                          obj = this.filmsService.filmUpdator(obj);
                          Repository.dataAdder(obj);
                        }
                      } else {
                        obj = this.appService.getAPIwithExactPath(url).subscribe(film => {
                          if(film) {
                            let filmObj = this.filmsService.filmUpdator(Repository.parseJSON(film));
                            Repository.dataAdder(filmObj);
                            obj = filmObj;
                          }
                        });
                      }
                    break;
      default: break;
    }
    return obj;
  }

   getPersonDetail(url: string) {
    this.personDetail = new Person();
    if(Repository.dataFinder(url)) {
      this.personDetail = this.peopleService.personUpdator(Repository.dataFinder(url));
    } else {
      this.personDetail = this.modalData.find(person => person.getter('url') == url);
    }
  }

  share() {
    let el = document.createElement('textarea');
    el.value = window.location.origin;
    switch(this.dataType) {
      case 'people':  el.value += '/people/' + this.modalData.getter('_id'); break;
      // case 'planets': el.value += '/planets/'; break;
      case 'films':   el.value += '/films/' + this.modalData.getter('_id');;break;
      default: break;
    }
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this._snackBar.open('URL is copied!', 'OK', {
      duration: 2000,
    });
  }

  targetNavigator(url?: string) {
    let desination = "/"
    if(url) {
      if(Repository.typeFinder(url) == "planets") {
        this.router.navigate(["/planets", this.personDetail.getter('homeworldName')]);
        this.closeModal();
        return;
      }
      desination += Repository.typeFinder(url) + "/" + Repository.getNumber(url);
    } else {
      desination += this.dataType + "/" + this.modalData.getter('_id');
    }
    this.closeModal();
    this.router.navigate([desination]);
  }

  dataFinder(url: string) {
    return Repository.dataFinder(Repository.typeFinder(url), url);
  }

  getNumber(url: string) {
    return Repository.getNumber(url);
  }

  onPaginateChange(event) {
    this.modalData = new Array<Person>();
    this.appService.getAPIwithParam("people/?page="+(event.pageIndex + 1)).subscribe(data => {
      if(data["results"]) {   
        data["results"].map(person => {
          let personObj = this.peopleService.personUpdator(Repository.parseJSON(person));
          this.modalData.push(personObj);
        });
      }
    });
  }

  personSearch() {
    if(!this.personSearchStr || this.personSearchStr.length == 0) {
      if(Repository.peopleTotal && Repository.peopleData && Repository.peopleData.length >= 10) {
        this.modalData = Repository.peopleData.filter((person, i) => { return i >= 0 && i < 10 });
      } else {
        this.appService.getAPI("people").subscribe(person => {
          let personObj = this.peopleService.personUpdator(Repository.parseJSON(person));
            this.modalData.push(personObj);
        });
      }
    } else {
      this.modalData = new Array<Person>();
      this.appService.getAPIwithParam("people/?search="+this.personSearchStr).subscribe(data => {
        if(data["results"]) {
          data["results"].map(person => {
            let personObj = this.peopleService.personUpdator(Repository.parseJSON(person));
            this.modalData.push(personObj);
          });
        }
      });
    }
    this.personDetail = null;
  }

}
