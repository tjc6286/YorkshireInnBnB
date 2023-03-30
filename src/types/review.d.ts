export type Review = {
    _id: string;
    rating: number;
    authorName: string;
    reviewText: string;
    date: Date;
    isPublic: boolean;
    isApproved: boolean;
}