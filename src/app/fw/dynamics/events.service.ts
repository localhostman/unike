import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  login$: Subject<void> = new Subject<void>();
  loginStateChange$ = new BehaviorSubject<boolean | undefined>(undefined);
  languageChange$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  showAlert$: Subject<string> = new Subject<string>();
  showCompanyInfo$ = new Subject<number>();
  showMenu$ = new Subject<boolean>();

  constructor() { }

}
