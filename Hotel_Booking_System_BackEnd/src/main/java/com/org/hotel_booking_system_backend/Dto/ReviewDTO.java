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
    private UUID hotelId;
    private int rating; // 1-5 stars
    private String comment;
    private String createdAt; // LocalDateTime as String for simplicity
}
