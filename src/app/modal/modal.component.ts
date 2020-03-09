import { Component, OnInit, Inject, Injector, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import * as Repository from '../repository';
import { Person, Planet, Film } from '../model';
import { AppService } from '../app.service';
import { PeopleService } from '../people/people.service';
import { PlanetsService } from '../planets/planets.service';
import { FilmsService } from '../films/films.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [PeopleService, PlanetsService, FilmsService]
})
export class ModalComponent implements OnInit, AfterViewInit {

  modalData: any;
  dataType: string;

  constructor(public dialogRef: MatDialogRef<ModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService,
    private peopleService: PeopleService,
    private planetsService: PlanetsService,
    private filmsService: FilmsService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit() {

    if(/^[https]/.test(this.data)) {
      this.dataType = Repository.typeFinder(this.data);
      this.modalData = this.getSingleData(this.data);
    }
    // switch(this.data) {
    //   case 'peopleList': this.modalData = this.getListItems("people", 1);
      
    //   default: // this.modalData = this.data; break;
    // }
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

  getListItems(target: string, page?: number) {
    let results;
    let jsonData;
    this.appService.getAPI(target, page).subscribe(data => {
      if(data && data["results"] && data["results"].length > 0) {
        jsonData = data["results"];
      }
    });

    switch(target) {
      case "people": 
                      results = new Array<Person>();
                      jsonData.map(data => {
                        let personObj = this.peopleService.personUpdator(Repository.parseJSON(data));
                        Repository.dataAdder(personObj);
                        results.push(personObj);
                      });
      break;
      case "planets": 
                      results = new Array<Planet>();
                      jsonData.map(data => {
                        let planetObj = this.planetsService.planetUpdator(Repository.parseJSON(data));
                        Repository.dataAdder(planetObj);
                        results.push(planetObj);
                      });
      break;
      case "films": 
                      results = new Array<Film>();
                      jsonData.map(data => {
                        let filmObj = this.filmsService.filmUpdator(Repository.parseJSON(data));
                        Repository.dataAdder(filmObj);
                        results.push(filmObj);
                      });
      break;
      default: break;
    }
    return results;
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

}
