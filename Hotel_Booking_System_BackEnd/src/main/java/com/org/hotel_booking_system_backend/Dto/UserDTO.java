package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    private UUID userId;
    private String name;
    private String email;
    private String contact;
    private String password;
    private String role; // ADMIN, HOTEL_OWNER, HOTEL_MANAGER


}
