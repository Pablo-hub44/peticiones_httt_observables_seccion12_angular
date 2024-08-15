import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  constructor (
    private httpClient : HttpClient
  ){

  }
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places','Algo salio mas buscando nuevos lugares, Intentalo despues mas tarde')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places','Algo salio mal buscando tus lugares favoritos, Intentalo despues mas tarde').pipe(tap({
      next:(userPlaces)=>{return this.userPlaces.set(userPlaces)}
    }))//tap() va a ejecutar algun codigo cmo se haria en subscribe pero sin subscribe
    //actualizar algunos datos en este servicio
  }

  /**
   * 
   * @param place 
   */
  addPlaceToUserPlaces(selectedPlace: Place): Observable<any> {
    return this.httpClient.put('http://localhost:3000/user-places',{placeId: selectedPlace.id})
  }

  removeUserPlace(place: Place) {}

  //buscar lugares
  /**
   * 
   * @param url 
   * @param errorMessage 
   * @returns 
   */
  private fetchPlaces(url:string, errorMessage:string): Observable<any>{
    return this.httpClient
    .get<{places: Place[]}>(url,
      // {observe: 'response'}
    )
    .pipe(
      map((resData)=> resData.places), catchError((error) =>{
        console.log(error);
        return throwError(()=>new Error(errorMessage))})
    )
  }
}
