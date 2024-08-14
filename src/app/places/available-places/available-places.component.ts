import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map, subscribeOn } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
 
  //con signal
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef);;//para cerrar algun observable

  private httpClient = inject(HttpClient);

  isFetching = signal(false);

  // constructor(private httpClient: HttpClient){}

  error = signal('');

  /**
   * metodo que se ejecuta al inicio
   */
  ngOnInit()  {
    this.isFetching.set(true);//actualizamos a true

    //dos en uno realizamos la peticion http, y tambien la subscripcion al observable
    const subscripcion = this.httpClient
    .get<{places: Place[]}>('http://localhost:3000/places',
      // {observe: 'response'}
    )
    .pipe(
      map((resData)=> resData.places)
    )
    .subscribe({
      //next seria el que seria el objeto de exito, si todo bien se dispara este
      next: (response) =>{
        console.log(response);
        //console.log(response.places);
        
        // console.log(response.body?.places);
        this.places.set(response);
        //this.places = response.places;
      },
      error: (error) =>{

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
