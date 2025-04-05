package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.ReviewDTO;
import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Entity.Review;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Repo.ReviewRepo;
import com.org.hotel_booking_system_backend.Service.ReviewService;
import com.org.hotel_booking_system_backend.Util.Mapping;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private Mapping mapper;

    @Override
    public Review saveReview(ReviewDTO reviewDTO) {

        Review review = mapper.convertToReviewEntity(reviewDTO);
        reviewRepo.save(review);

        return review;
    }

    @Override
    public List<ReviewDTO> getAllReviews() {
        List<Review> getReviews = reviewRepo.findAll();
        return mapper.convertReviewToDTOList(getReviews);

    }

    @Override
    public void updateReview(ReviewDTO reviewDTO) {
        Review review = mapper.convertToReviewEntity(reviewDTO);
        if (reviewRepo.existsById(review.getReviewId())) {
            reviewRepo.save(review);
        } else {
            throw new RuntimeException("Review not Found");
        }

    }
}
