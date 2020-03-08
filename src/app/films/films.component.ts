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
    
    if(!Repository.filmsTotal || !Repository.filmsData || Repository.filmsData.length == 0) {
      this.appService.getAPI("films").subscribe(data => {
        if(data) {
          Repository.valueSetter("filmsTotal", data["count"]);

          data["results"].map(film => {
            let filmObj = this.filmUpdator(Repository.parseJSON(film));
            Repository.dataAdder(filmObj);
            this.allFilms = Repository.filmsData;
          });
        }
      });
    } else {
      if(Repository.filmsData && Repository.filmsData.length > 0) {
  
        if(Repository.filmsData.length == Repository.filmsTotal) {
          Repository.filmsData.map(film => {
            if(!this.filmUpdated(film)) {
              film = this.filmUpdator(film);
              Repository.dataAdder(film);
            }
            this.allFilms.push(film);
          });
        } else {
          for(let i=0; i < Repository.filmsTotal; i++) {
            if(!Repository.dataFinder("films", null, i+ 1 )) {
              this.appService.getAPI("films", i + 1).subscribe(film => {
                let filmObj = this.filmUpdator(Repository.parseJSON(film));
                Repository.dataAdder(filmObj)
                this.allFilms = Repository.filmsData;
              });
            }
          }
        }
      }
    } 
    Repository.dataSort("films");
    this.allFilms = Repository.filmsData;
  }

  filmUpdated(data: Film) {
    if( data.getter('characters').length !== data.getter('charactersList').length || data.getter('planets').length !== data.getter('planetsList').length) {
      return false;
    }
    return true;
  }

  filmUpdator(data: Film) {
    
    if(data.getter('characters').length !== data.getter('charactersList').length) {
      data.setter('charactersList', new Array<string>());
      data.getter('characters').map(personUrl => {
        if(Repository.dataFinder("characters", personUrl)) {
          data.getter('charactersList').push(Repository.dataFinder("people", personUrl).getter('name'));
        } else {
          this.appService.getAPIwithExactPath(personUrl).subscribe(person => {
            data.getter('charactersList').push(person["name"]);
            Repository.dataAdder(Repository.parseJSON(person));
          });
        }
      });
    }

    if(data.getter('planets').length !== data.getter('planetsList').length) {
      data.setter('planetsList', new Array<string>());
      data.getter('planets').map(planetUrl => {
        if(Repository.dataFinder("planets", planetUrl)) {
          data.getter('planetsList').push(Repository.dataFinder("planets", planetUrl).getter('name'));
        } else {
          this.appService.getAPIwithExactPath(planetUrl).subscribe(planet => {
            data.getter('planetsList').push(planet["name"]);
            Repository.dataAdder(Repository.parseJSON(planet));
          });
        }
      });
    }

    return data;
  }

}
