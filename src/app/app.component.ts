import { Component, inject } from '@angular/core';

import { AvailablePlacesComponent } from './places/available-places/available-places.component';
import { UserPlacesComponent } from './places/user-places/user-places.component';
import { ErrorService } from './shared/error.service';
import { ErrorModalComponent } from "./shared/modal/error-modal/error-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [AvailablePlacesComponent, UserPlacesComponent, ErrorModalComponent],
})
export class AppComponent {
  private errorService = inject(ErrorService);

  //conseguimos el error si es que hay, este es el componente padre asi que estara en todos los hijos
  error = this.errorService.error
}
