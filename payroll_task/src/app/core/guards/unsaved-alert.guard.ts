import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface canComponentDeactivate{
  canDeactivate: () =>boolean | Observable<boolean> | Promise<boolean>;
}

export const unsavedAlertGuard: CanDeactivateFn<canComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
