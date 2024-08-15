import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  //signal privado
  private _error = signal('');

  //exponemos el signal de solo lectura
  error = this._error.asReadonly();

  /**
   * asignar un mensaje de error
   * @param message 
   */
  showError(message: string) {
    console.log(message);
    this._error.set(message);
  }

  /**
   * limpiar el string del error
   */
  clearError() {
    this._error.set('');
  }
}
