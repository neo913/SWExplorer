import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Film } from '../model';
import * as Repository from '../repository';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsComponent implements OnInit {

  allFilms: Film[];
  curIndex: number;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.getAllFilms();
  }

  getAllFilms() {
    this.allFilms = new Array<Film>();
    if(Repository.filmsData && Repository.filmsData.length > 0) {
      this.allFilms = Repository.filmsData;
    } else {
      this.appService.getAPI("films").subscribe(data => {
        if(data) {
          data["results"].map(result => {
            // characters update // No API call when this finds objects in Repository
            let charactersList = new Array<string>();
            if(Repository.peopleData && Repository.peopleData.length) {
              result["characters"].map(charUrl => {
                if(Repository.dataFinder("people", charUrl)) {
                  charactersList.push(Repository.dataFinder("people", charUrl).getter('name'));
                }
              });
            }
            if(result["characters"].length !== charactersList.length) {
              charactersList = new Array<string>();
              result["characters"].map(character => {
                this.appService.getAPIwithExactPath(character).subscribe(charData => {
                  charactersList.push(charData["name"]);
                });
              });
              result["characters"] = charactersList;
            }
            // planets update // No API call when this finds objects in Repository
            let planetsList = new Array<string>();
            if(Repository.planetsData && Repository.planetsData.length > 0) {
              result["planets"].map(planetUrl => {
                if(Repository.dataFinder("planets", planetUrl)) {
                  planetsList.push(Repository.dataFinder("planets", planetUrl).getter('name'));
                }
              });
            }
            if(result["planets"].length !== planetsList.length) {
              planetsList = new Array<string>();
              result["planets"].map(planet => {
                this.appService.getAPIwithExactPath(planet).subscribe(planetData => {
                  planetsList.push(planetData["name"]);
                });
              });
            }
            result["planets"] = planetsList;

            Repository.filmsDataAdder(result);
          });

          // sort by _id
          Repository.filmsData.sort((a, b) => {
            return a.getter('_id') - b.getter('_id');
          });
          Repository.filmsData.map(film => {
            this.allFilms.push(film);
          });
        }
      });
    }
  }

}
