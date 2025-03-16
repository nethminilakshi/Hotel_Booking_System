package com.org.hotel_booking_system_backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class HotelDTO {

    private String hotelId;
    private String name;
    private String location; // Different locations (branches)
    private String description;
    private String image;
    private String Manager; // Reference to User entity

}
