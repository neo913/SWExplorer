import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import * as Repository from '../repository';
import { Planet } from '../model';
import { PlanetsService } from './planets.service';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private appService: AppService, private planetsService: PlanetsService, private modal: MatDialog, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['keyword']) {
        this.searchStr = params['keyword'];
        this.planetSearch();
      }
    });
    
    if(!this.searchStr && !this.curPlanets) {
      if(Repository.planetsTotal) { this.total = Repository.planetsTotal; }
      this.getInitPlanets();
    }
  }

/**
 * get initial data from API (default 10 items)
 */
  getInitPlanets() {
    this.curPlanets = new Array<Planet>();
    if(!Repository.planetsData || Repository.planetsData.length < 10) {
      this.appService.getAPI("planets").subscribe(planetsData => {
        if(planetsData) {
          Repository.valueSetter("planetsTotal", planetsData["count"]);
          this.total = Repository.planetsTotal;
          
          planetsData["results"].map(planet => {
            let planetObj = this.planetsService.planetUpdator(Repository.parseJSON(planet));
            Repository.dataAdder(planetObj);
          });
          Repository.dataSort("planets");
          Repository.planetsData.map(planet => {
            planet = this.planetsService.planetUpdator(planet);
          });
          this.curPlanets = Repository.planetsData;
        }
      });
    } else {
      Repository.dataSort("planets");
      this.curPlanets = Repository.planetsData.filter((planet, i) => { return i >= 0 && i < 10 });
      this.curPlanets.map(planet => {
        planet = this.planetsService.planetUpdator(planet);
      });
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
              let planetObj = this.planetsService.planetUpdator(Repository.parseJSON(planet));
              Repository.dataAdder(planetObj);
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
          data["results"].map(planet => {
            let planetObj = this.planetsService.planetUpdator(Repository.parseJSON(planet));
            this.curPlanets.push(planetObj);
          });
        }
      });
    }
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
