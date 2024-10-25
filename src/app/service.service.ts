import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Budget, ModuleType } from './models/budget';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor() { }

  private readonly http = inject(HttpClient);

  getModuleTypes() : Observable<ModuleType[]> {
    return this.http.get<ModuleType[]>('http://localhost:3000/module-types');
  }

  // siempre recordar que deben ser Observables
  getModulesById(id : number): Observable<ModuleType> {
    return this.http.get<ModuleType>('http://localhost:3000/module-types/' + id);
  }

  postBuget(budget : Budget) : Observable<Budget> {
    return this.http.post<Budget>('http://localhost:3000/budgets', budget);
  }
}
