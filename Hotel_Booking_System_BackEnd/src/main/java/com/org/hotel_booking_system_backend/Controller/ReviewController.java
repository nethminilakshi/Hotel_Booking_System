package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.ReviewDTO;
import com.org.hotel_booking_system_backend.Entity.Review;
import com.org.hotel_booking_system_backend.Service.ReviewService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/review")
@CrossOrigin(origins = "http://localhost:63342")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;


     @PostMapping("/save")
     public ResponseUtil addReview(@RequestBody ReviewDTO reviewDTO) {
         try {
             Review savedReview = reviewService.saveReview(reviewDTO);
             return new ResponseUtil(201, "Review added", savedReview);
         } catch (Exception e) {
             return new ResponseUtil(500, e.getMessage(), null);
         }
     }

         @GetMapping("getAll")
         public ResponseUtil getAllReviews(){
             List<ReviewDTO> rooms = reviewService.getAllReviews();
             return new ResponseUtil(200, "Reviews are retrieved", rooms);
         }

    @PutMapping("update")
    public ResponseUtil updateRoom(@RequestBody ReviewDTO reviewDTO){
        reviewService.updateReview(reviewDTO);
        return new ResponseUtil(200, "Review is updated", null);
    }

     }
