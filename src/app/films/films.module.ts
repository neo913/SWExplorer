import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MaterialModule} from '../material.module';

import { FilmsRoutingModule } from './films-routing.module';
import { FilmsComponent } from './films.component';


@NgModule({
  declarations: [FilmsComponent],
  imports: [
    CommonModule,
    FilmsRoutingModule,
    MaterialModule
  ]
})
export class FilmsModule { }
