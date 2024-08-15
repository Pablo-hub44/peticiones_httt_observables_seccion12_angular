import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandler, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * 
 * @param request peticion
 * @param next se valla a siguiente
 * @returns la peticion
 */
function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn){
    
    //podemos tener una copia de la request original
    const req = request.clone({
        //establecerle otra cabecera, esta es prueba dara error jeje
        headers: request.headers.set('X-DEUBG','TESTING')
    })
    
    console.log('[outgoing request]');
    console.log(request);
    
    //haci podemos hacer para interceptar responses en convinacion con interceptores de peticion
    return next(request).pipe(
        tap({
            next:event =>{
                if (event.type === HttpEventType.Response) {
                    console.log('[Incoming response]');
                    console.log(event.status);
                    console.log(event.body);
                    
                }
            }
        })
    );
}

bootstrapApplication(AppComponent, {providers: [provideHttpClient(
    withInterceptors([loggingInterceptor])
    //withInterceptorsFromDi()
)]}).catch((err) => console.error(err));
