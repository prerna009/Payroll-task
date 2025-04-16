import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { SharedModule } from './core/shared/modules/shared.module';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { CUSTOM_DATE_FORMATS, CustomDateAdaptor } from './core/date-adaptor/custom-date-adaptor';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: DateAdapter, useClass: CustomDateAdaptor },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
