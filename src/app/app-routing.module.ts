import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{ path: 'people', loadChildren: () => import('./people/people.module').then(m => m.PeopleModule) }, { path: 'planets', loadChildren: () => import('./planets/planets.module').then(m => m.PlanetsModule) }, { path: 'films', loadChildren: () => import('./films/films.module').then(m => m.FilmsModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
