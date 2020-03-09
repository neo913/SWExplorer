import { Injectable } from '@angular/core';
import { Planet } from '../model';
import * as Repository from '../repository';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetsService {

  constructor(private appService: AppService) { }

  planetUpdator(data: Planet) {
      
    if(data.getter('residents').length !== data.getter('residentsList').length) {
      data.setter('residnetsList', new Array<string>());
      data.getter('residents').map(personUrl => {
        if(Repository.dataFinder("people", personUrl)) {
          data.getter('residentsList').push(Repository.dataFinder("people", personUrl).getter('name'));
        } else {
          this.appService.getAPIwithExactPath(personUrl).subscribe(person => {
            data.getter('residentsList').push(person["name"]);
            Repository.dataAdder(Repository.parseJSON(person));
          });
        }
      });
    }

    if(data.getter('films').length !== data.getter('filmsList').length) {
      data.setter('filmsList', new Array<string>());
      data.getter('films').map(filmUrl => {
        if(Repository.dataFinder('films', filmUrl)) {
          data.getter('filmsList').push(Repository.dataFinder('films', filmUrl).getter('title'));
        } else {
          this.appService.getAPIwithExactPath(filmUrl).subscribe(film => {
            data.getter('filmsList').push(film["title"]);
            Repository.dataAdder(Repository.parseJSON(film));
          });
        }
      });
    }

    return data;
  }
}
