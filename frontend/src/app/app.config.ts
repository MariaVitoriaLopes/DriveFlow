import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { provideRouter } from '@angular/router';

import {provideHttpClient, withFetch} from '@angular/common/http';

import { routes } from './app.routes';

import { LucideAngularModule, Menu, X } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(LucideAngularModule.pick({X, Menu}))
  ]
};
