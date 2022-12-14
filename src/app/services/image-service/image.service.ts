import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Pictures";
  }

  uploadImage(image: FormData): Observable<any> {
    return this.httpClient.post(this.reqPath + "/UpdateImage", image);
  }

  getImages(type: string, id: number): Observable<string[]> {
    return this.httpClient.get<string[]>(this.reqPath + "/GetImages/" + type + "/" + id);
  }
}
