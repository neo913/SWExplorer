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
            // Residents update
            let residentsList = new Array<string>();
            planet["residents"].map(resident => {
              this.appService.getAPIwithExactPath(resident).subscribe(residentData => {
                residentsList.push(residentData["name"]);
              });
            });
            planet["residents"] = residentsList;
            // Films update
            let filmsList = new Array<string>();
            planet["films"].map(film => {
              this.appService.getAPIwithExactPath(film).subscribe(filmData => {
                filmsList.push(filmData["title"]);
              });
            });
            planet["films"] = filmsList;
            Repository.planetsDataAdder(planet);
          });
          this.curPlanets = Repository.planetsData;
        }
      });
    } else {
      this.curPlanets = Repository.planetsData.filter(planet => {
        return planet.getter('_id') >= 1 && planet.getter('_id') <= 10
      });
    }
  }

  onPaginateChange(event) {
   this.getPlanets(event.pageIndex);
  }

  getPlanets(pageIndex: number) {
    let first = (pageIndex + 1) * 10 -9;
    let last = (pageIndex + 1) * 10;
    if(last > Repository.planetsTotal) { last = Repository.planetsTotal; }

    if(Repository.planetsData && Repository.planetsData.length > 0) { // if Repository has data
      this.curPlanets = Repository.planetsData.filter(planet => {
        return planet.getter('_id') >= first && planet.getter('_id') <= last
      });
      if(this.curPlanets.length < 10 && pageIndex != Repository.planetsTotal / 10 - 1) { // if data doesn't exist in Repository, get next page from API
        this.appService.getAPIwithParam("planets/?page="+(pageIndex+1)).subscribe(planetsData => {
          if(planetsData) {
            planetsData["results"].map(planet => {
              Repository.planetsDataAdder(planet);
            });
            this.curPlanets = Repository.planetsData.filter(planet => {
              return planet.getter('_id') >= first && planet.getter('_id') <= last
            });
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


  // /**
  //  * Search starts from 2nd character
  //  */
  // planetFilter() {
  //   if(!this.searchStr || this.searchStr.length < 2) {
  //     return this.allPlanets;
  //   } else {
  //     return this.allPlanets.filter(planet => 
  //       JSON.stringify(planet).toLowerCase().search(this.searchStr.toLowerCase()) != -1
  //     );
  //   }
  // }

}
