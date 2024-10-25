import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Budget, Module, ModuleType, Zone } from '../models/budget';
import { ServiceService } from '../service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit {

    service = inject(ServiceService);
    moduleTypes: ModuleType[] = [];
    zones = Object.values(Zone);
  
    
    form = new FormGroup({
      client: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      modules: new FormArray([] , [Validators.required , Validators.minLength(5)])
    });
  
    ngOnInit(): void {
      this.getModuleTypes();
    }
  
    get modules() {
      return this.form.get('modules') as FormArray;
    }
  

    addModule() {

      const moduleForm = new FormGroup({
        id: new FormControl(''),
        price: new FormControl(''),
        slots: new FormControl(''),
        zone: new FormControl('', Validators.required)
      });
  
      this.modules.push(moduleForm);
    }
  
    // detecta cambios en el select de tipo de modulo y setea los valores de precio y slots
    onModuleChange(index: number) {

      const moduleType = this.modules.at(index).value;

        this.getModulesById(moduleType.id).subscribe({

          next: (moduleType) => {
            
            this.modules.at(index).patchValue({
              price: moduleType.price,
              slots: moduleType.slots,
            });
          },
          error: (err) => console.error(err),
        });
      

      
    }
  
    quitarModule(index: number) {
      this.modules.removeAt(index);
    }  

 getModuleTypes() {
  this.service.getModuleTypes().subscribe({
    next: (types) => {
      this.moduleTypes = types
      console.log(this.moduleTypes);
    } ,
    error: (err) => console.error(err)
  });
 }

 // obtiene el modulo por su id
 getModulesById(id : number) {
  return this.service.getModulesById(id);
 }


 submitForm() {

  if (this.form.valid && this.modules.length >= 5) {
  
    // crea el objeto de budget con los valores del formualario
    const budget: Budget = {
      id: '',
      client: this.form.value.client || '',
      date: new Date(this.form.value.date || new Date()),
      modules: this.form.value.modules || []
    };


  if(this.form.valid) {
    console.log(budget);

   this.service.postBuget(budget).subscribe({  
     next: (data) => {
      alert('Cotización guardada con exito!' + data);
     },
     error: (err) => console.error(err)
   })
  }

}
}
}
