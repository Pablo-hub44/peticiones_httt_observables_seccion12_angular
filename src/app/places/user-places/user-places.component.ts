import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{

  constructor(
    private placesService : PlacesService
  ){}
    //con signal
    //places = signal<Place[] | undefined>(undefined); //ya no
    private destroyRef = inject(DestroyRef);;//para cerrar algun observable

    //conseguimos los places por el service, el atributo de solo lectura, tiene que ser del de lectura pk sino va a dar error
    places = this.placesService.loadedUserPlaces;
     // Convertimos el Observable a un Signal
    //places = toSignal(this.placesService.loadUserPlaces());


    //private httpClient = inject(HttpClient);
  
    isFetching = signal(false);
  
    // constructor(private httpClient: HttpClient){}
  
    error = signal('');
    
  /**
   * metodo que se ejecuta al inicio
   */
  ngOnInit()  {
    this.isFetching.set(true);//actualizamos a true

    //dos en uno realizamos la peticion http, y tambien la subscripcion al observable
    const subscripcion = 
    this.placesService.loadUserPlaces().subscribe({
      //next seria el que seria el objeto de exito, si todo bien se dispara este, el next esta puesto en el service
      // next: (response) =>{
      //   console.log(response);
      //   //console.log(response.places);
        
      //   // console.log(response.body?.places);
      //   this.places.set(response);
      //   //this.places = response.places;
      // }, puesto en el service
      error: (error:Error) =>{
        console.error(error.message);//error.message
        
        //this.error.set("")
      },
      complete: ()=>{
        this.isFetching.set(false); //cuando se complete asignamos si valor otra ves a false
      }
    });

    //no es necesario pero es una buena idea
    this.destroyRef.onDestroy(() =>{
      subscripcion.unsubscribe();
    })
  }


}
