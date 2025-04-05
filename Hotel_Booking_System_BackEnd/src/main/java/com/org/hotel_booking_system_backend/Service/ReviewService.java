package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.ReviewDTO;
import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Review;

import java.util.List;

public interface ReviewService {
    Review saveReview(ReviewDTO reviewDTO);

    List<ReviewDTO> getAllReviews();

    void updateReview(ReviewDTO reviewDTO);
}
