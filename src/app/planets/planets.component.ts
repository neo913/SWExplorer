import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import * as Repository from '../repository';
import { Planet } from '../model';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.scss']
})
export class PlanetsComponent implements OnInit {

  panelOpenState: boolean;
  curPlanets: Planet[];
  total: number;
  searchStr: string;

  constructor(private appService: AppService) { }

  ngOnInit() {
    if(Repository.planetsTotal) { this.total = Repository.planetsTotal; }
    this.getInitPlanets();
  }

/**
 * get initial data from API (default 10 items)
 */
  getInitPlanets() {
    this.curPlanets = new Array<Planet>();
    if(!Repository.planetsData || Repository.planetsData.length == 0) {
      this.appService.getAPI("planets").subscribe(planetsData => {
        if(planetsData) {
          Repository.valueSetter("planetsTotal", planetsData["count"]);
          this.total = Repository.planetsTotal;
          if(!Repository.planetsTotal) { Repository.valueSetter("planetsTotal", planetsData["count"]); }
          planetsData["results"].map(planet => {
            // residents update // No API call when this finds objects in Repository
            let residentsList = new Array<string>();
            if(Repository.peopleData && Repository.peopleData.length > 0) {
              planet["residents"].map(residentUrl => {
                if(Repository.dataFinder("people", residentUrl)) {
                  residentsList.push(Repository.dataFinder("people", residentUrl).getter('name'));
                }
              });
            }
            if(planet["residents"].length !== residentsList.length) {
              residentsList = new Array<string>();
              planet["residents"].map(resident => {
                this.appService.getAPIwithExactPath(resident).subscribe(residentData => {
                  residentsList.push(residentData["name"]);
                });
              });
            }
            planet["residents"] = residentsList;
            // films update // No API call when this finds objects in Repository
            let filmsList = new Array<string>();
            if(Repository.filmsData && Repository.filmsData.length > 0) {
              planet["films"].map(filmsUrl => {
                if(Repository.dataFinder("films", filmsUrl)) {
                  filmsList.push(Repository.dataFinder("films", filmsUrl).getter('title'));
                }
              });
            }
            if(planet["films"].length !== filmsList) {
              filmsList = new Array<string>();
              planet["films"].map(film => {
                this.appService.getAPIwithExactPath(film).subscribe(filmData => {
                  filmsList.push(filmData["title"]);
                });
              });
            }
            planet["films"] = filmsList;

            Repository.planetsDataAdder(planet);
          });
          this.curPlanets = Repository.planetsData;
        }
      });
    } else {
      this.curPlanets = Repository.planetsData.filter((planet, i) => { return i >= 0 && i < 10 });
    }
  }

  onPaginateChange(event) {
   this.getPlanets(event.pageIndex);
  }

  getPlanets(pageIndex: number) {
    let first = (pageIndex + 1) * 10 -10;
    let last = (pageIndex + 1) * 10 - 1;
    if(last > Repository.planetsTotal - 1) { last = Repository.planetsTotal; }
    
    // if Repository has data
    if(Repository.planetsData && Repository.planetsData.length > 0) { 
      this.curPlanets = Repository.planetsData.filter((planet, i) => { return i >= first && i <= last });
      if(this.curPlanets.length < 10 && pageIndex != Repository.planetsTotal / 10 - 1) { 
        this.appService.getAPIwithParam("planets/?page="+(pageIndex+1)).subscribe(planetsData => {
          if(planetsData) {
            planetsData["results"].map(planet => {
              // residents update // if data doesn't exist in Repository, get next page from API
              let residentsList = new Array<string>();
            if(Repository.peopleData && Repository.peopleData.length > 0) {
              planet["residents"].map(residentUrl => {
                if(Repository.dataFinder("people", residentUrl)) {
                  residentsList.push(Repository.dataFinder("people", residentUrl).getter('name'));
                }
              });
            }
            if(planet["residents"].length !== residentsList.length) {
              residentsList = new Array<string>();
              planet["residents"].map(resident => {
                this.appService.getAPIwithExactPath(resident).subscribe(residentData => {
                  residentsList.push(residentData["name"]);
                });
              });
            }
            planet["residents"] = residentsList;
            // films update // No API call when this finds objects in Repository
            let filmsList = new Array<string>();
            if(Repository.filmsData && Repository.filmsData.length > 0) {
              planet["films"].map(filmsUrl => {
                if(Repository.dataFinder("films", filmsUrl)) {
                  filmsList.push(Repository.dataFinder("films", filmsUrl).getter('title'));
                }
              });
            }
            if(planet["films"].length !== filmsList) {
              filmsList = new Array<string>();
              planet["films"].map(film => {
                this.appService.getAPIwithExactPath(film).subscribe(filmData => {
                  filmsList.push(filmData["title"]);
                });
              });
            }
            planet["films"] = filmsList;
              
              Repository.planetsDataAdder(planet);
            });
            this.curPlanets = Repository.planetsData.filter((planet, i) => { return i >= first && i <= last });
          }
        });
      }
    }
  }

  spellChecker(name: string) {
    let result = "";
    switch(name.substr(0,1)) {
      case "a":
      case "e":
      case "i":
      case "o":
      case "u": result += "An "; break;
      default: result += "A "; break;
    }
    result += name + " Planet"
    return result
  }

  planetSearch() {
    if(!this.searchStr || this.searchStr.length == 0) {
      this.getInitPlanets();
    } else {
      this.appService.getAPIwithParam("planets/?search="+this.searchStr).subscribe(data =>{
        this.curPlanets = new Array<Planet>();
        if(data["results"]) {
          data["results"].map(result => {
            this.curPlanets.push(Repository.parseJSON(result, "planets"));
          });
        }
      });
    }
  }

}
