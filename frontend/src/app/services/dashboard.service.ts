// import { Injectable } from '@angular/core';

// import { HttpClient } from '@angular/common/http';

// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class DashboardService {

//   private apiUrl = 'http://localhost:8080/api/dashboard';

//   constructor(
//     private http: HttpClient
//   ) {}

//   getDashboard(): Observable<any> {

//     return this.http.get(this.apiUrl);

//   }

//   updateAvailability(body: any): Observable<any> {

//     return this.http.put(
//       `${this.apiUrl}/availability`,
//       body
//     );

//   }

// }