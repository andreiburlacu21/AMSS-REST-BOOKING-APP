import { ReviewEntity } from "./review-entity.model";

export class Review {
    reviewId?: number;
    accountId?: number;
    locationId?: number;
    grade?: number;
    description?: string;
    date?: string;
    reviewEntity?: ReviewEntity;
}