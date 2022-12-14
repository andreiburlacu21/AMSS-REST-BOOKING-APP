import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input('rating') rating: number = 0;
  @Input('readonly') readonly: boolean = true;
  starCount: number = 5;
  currentRating: number = 0;
  @Output() ratingUpdated = new EventEmitter<{rating: number}>();

  snackBarDuration: number = 2000;
  ratingArr: number[] = [];

  constructor() {}

  ngOnInit() {
    this.currentRating = this.rating
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  
  onClick(index: number) {
    if(!this.readonly) {
      if(this.currentRating === index) {
        this.currentRating = 0;
      } else {
        this.currentRating = index;
      }
    }
    this.ratingUpdated.emit({
      rating: this.currentRating
    });
    return false;
  }
}
