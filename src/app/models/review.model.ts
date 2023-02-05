import { ReviewEntity } from "./review-entity.model";

export class Review {
    reviewId?: number;
    bookingId?: number;
    grade?: number;
    description?: string;
}