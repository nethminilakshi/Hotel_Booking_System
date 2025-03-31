package com.org.hotel_booking_system_backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HotelDTO {

    private UUID hotelId;
    private String name;
    private String location; // Different locations (branches)
    private String description;
    private String image;
    private String managerId; // Correct reference to User entity
}
