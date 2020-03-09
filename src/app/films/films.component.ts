import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AppService } from '../app.service';
import { Film } from '../model';
import * as Repository from '../repository';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material';
import { FilmsService } from './films.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsComponent implements OnInit, AfterViewChecked {
  
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;
  
  allFilms: Film[];
  curIndex: number = 0;

  constructor(private appService: AppService, private filmsService: FilmsService, private _snackBar: MatSnackBar, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.curIndex = (params['id'] - 1);
      }
    });
    this.getAllFilms();
  }

  ngAfterViewChecked() {
    this.tabGroup.selectedIndex = this.curIndex;
  }

  getAllFilms() {
    
    this.allFilms = new Array<Film>();
    
    if(!Repository.filmsTotal || !Repository.filmsData || Repository.filmsData.length == 0) {
      this.appService.getAPI("films").subscribe(data => {
        if(data) {
          Repository.valueSetter("filmsTotal", data["count"]);

          data["results"].map(film => {
            let filmObj = this.filmsService.filmUpdator(Repository.parseJSON(film));
            Repository.dataAdder(filmObj);
            this.allFilms = Repository.filmsData;
          });
        }
      });
    } else {
      if(Repository.filmsData && Repository.filmsData.length > 0) {
  
        if(Repository.filmsData.length == Repository.filmsTotal) {
          Repository.filmsData.map(film => {
            if(!this.filmsService.filmUpdated(film)) {
              film = this.filmsService.filmUpdator(film);
              Repository.dataAdder(film);
            }
            this.allFilms.push(film);
          });
        } else {
          for(let i=0; i < Repository.filmsTotal; i++) {
            if(!Repository.dataFinder("films", null, i+ 1 )) {
              this.appService.getAPI("films", i + 1).subscribe(film => {
                let filmObj = this.filmsService.filmUpdator(Repository.parseJSON(film));
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

  share() {
    let el = document.createElement('textarea');
    el.value = window.location.origin;
    if(typeof this.curIndex) { el.value += "/films/" + (this.curIndex + 1); }
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this._snackBar.open('URL is copied!', 'OK', {
      duration: 2000,
    });
  }
  
  dataFinder(url: string) {
    return Repository.dataFinder(Repository.typeFinder(url), url);
  }
}
