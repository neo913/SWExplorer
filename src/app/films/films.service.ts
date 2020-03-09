import { Injectable } from '@angular/core';
import { Film } from '../model';
import { AppService } from '../app.service';
import * as Repository from '../repository';

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  constructor(private appService: AppService) { }

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
