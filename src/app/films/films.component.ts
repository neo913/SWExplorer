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
            // Replace characters
            let characters = new Array<string>();
            result["characters"].map(character => {
              this.appService.getAPIwithExactPath(character).subscribe(charData => {
                characters.push(charData["name"]);
              });
            });
            result["characters"] = characters;
            // Replace planets
            let planets = new Array<string>();
            result["planets"].map(planet => {
              this.appService.getAPIwithExactPath(planet).subscribe(planetData => {
                planets.push(planetData["name"]);
              });
            });
            result["planets"] = planets;
            Repository.filmsDataAdder(result);
          });
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
