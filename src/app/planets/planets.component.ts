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
    if(!Repository.planetsData || Repository.planetsData.length == 0) {
      this.appService.getAPI("planets").subscribe(planetsData => {
        if(planetsData) {
          Repository.valueSetter("planetsTotal", planetsData["count"]);
          this.total = Repository.planetsTotal;
          if(!Repository.planetsTotal) { Repository.valueSetter("planetsTotal", planetsData["count"]); }
          planetsData["results"].map(planet => {
            Repository.planetsDataAdder(planet);
          });
          this.curPlanets = Repository.planetsData;
        }
      });
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
