import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  constructor (
    private httpClient : HttpClient,
    private errorService: ErrorService
  ){

  }
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places','Algo salio mas buscando nuevos lugares, Intentalo despues mas tarde')
  }

  loadUserPlaces(): Observable<Place[]>  {
    return this.fetchPlaces('http://localhost:3000/user-places','Algo salio mal buscando tus lugares favoritos, Intentalo despues mas tarde').pipe(tap({
      next:(userPlaces)=>{return this.userPlaces.set(userPlaces)}
    }))//tap() va a ejecutar algun codigo cmo se haria en subscribe pero sin subscribe
    //actualizar algunos datos en este servicio
  }

  /**
   * metodo para agregar un place  al objeto de places favoritos
   * @param place 
   */
  addPlaceToUserPlaces(selectedPlace: Place): Observable<any> {
    const prevPlaces = this.userPlaces();//leemos nuestro signal

    //validamos si tal place ya estaba en el array de places no lo agregue , si no esta si lo agregue
    if (!prevPlaces.some((place) => place.id === selectedPlace.id)) {
      this.userPlaces.set([...prevPlaces, selectedPlace])//lo agregamos y se actualiza
    }

    //*esto actualizara el objeto y emitira a todos los interesados
    //this.userPlaces.update((prevPlaces)=>{ return [...prevPlaces, selectedPlace]})//!si actualizamos antes de que se realice en el bakend va a dar error, aqui no tiene q ir, con el set de arriba vasta

    return this.httpClient.put('http://localhost:3000/user-places',{placeId: selectedPlace.id}).pipe(
    //podemos cachar si es que ocurriera un error  
    catchError(error =>{
        this.userPlaces.set(prevPlaces)
        this.errorService.showError('fallo al guardar lugar seleccionado');
        return throwError(()=> new Error('fallo al guardar lugar seleccionado'))
      })
    )
  }

  /**
   * 
   * @param place 
   */
  removeUserPlace(placee: Place) {
    const prevPlaces = this.userPlaces();
    //validar que si este en la lista de favoritos
    if(prevPlaces.some((place) => place.id === placee.id)){
       
      this.userPlaces.set(prevPlaces.filter(p => p.id !== placee.id))//filtramos haciendo que nos regrese el array sin ese id
      
    }
    //realizar la peticion a la ruta de delete con el id a borrar
      //catchar si es que hubiera algun error
      return this.httpClient.delete('http://localhost:3000/user-places/'+placee.id).pipe(
      //podemos cachar si es que ocurriera un error  
      catchError(error =>{
        this.userPlaces.set(prevPlaces)
        this.errorService.showError('fallo al borrar lugar seleccionado');
        return throwError(()=> new Error('fallo al borrar lugar seleccionado'))
      }))
   
  }

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
