package com.org.hotel_booking_system_backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReviewDTO implements Serializable {

private UUID reviewId;
    private UUID userId;
    private String userName;
    private UUID hotelId;
    private String location;
    private int rating; // 1-5 stars
    private String comment;
    private String reviewDate; // LocalDateTime as String for simplicity
}
