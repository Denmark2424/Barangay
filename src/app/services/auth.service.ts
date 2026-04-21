import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  get isLoggedIn(): boolean {
    return this._isLoggedIn.getValue();
  }

  login(): void {
    this._isLoggedIn.next(true);
  }

  logout(): void {
    this._isLoggedIn.next(false);
  }
}
