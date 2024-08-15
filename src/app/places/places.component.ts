import { Component, input, output } from '@angular/core';

import { Place } from './place.model';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<Place[]>();
  selectPlace = output<Place>();//evento para el contenedor padre

  //emite cuando se selecciona un elemento
  onSelectPlace(place: Place) {
    //console.log("clickeado");
    
    this.selectPlace.emit(place);//vamos a emitir este objeto
  }
}
