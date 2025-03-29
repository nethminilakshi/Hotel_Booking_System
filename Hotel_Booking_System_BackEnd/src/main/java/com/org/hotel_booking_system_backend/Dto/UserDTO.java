package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    private String userId;
    private String name;
    private String email;
    private String contact;
    private String password;
    private String role; // ADMIN, HOTEL_OWNER, HOTEL_MANAGER


}
