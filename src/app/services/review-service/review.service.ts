import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewEntity } from 'src/app/models/review-entity.model';
import { Review } from 'src/app/models/review.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ReviewService {
  private reqPath: string = "";

  constructor(private httpClient: HttpClient) {
    this.reqPath = environment.apiBaseUrl + "Reviews";
  }

  getAllReviews(): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.reqPath + "/all");
  }

  getReviewEntityById(reviewId: number): Observable<ReviewEntity> {
    return this.httpClient.get<ReviewEntity>(this.reqPath + "/Entity/" + reviewId);
  }

  addReview(review: Review): Observable<Review> {
    return this.httpClient.post<Review>(this.reqPath + "/insert", review);
  }

  updateReview(review: Review): Observable<Review> {
    return this.httpClient.put<Review>(this.reqPath + "/update", review);
  }

  deleteReview(reviewId: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.reqPath + "/" + reviewId);
  }
}
