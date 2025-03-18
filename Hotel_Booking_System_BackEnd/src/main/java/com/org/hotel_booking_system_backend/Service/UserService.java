package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import jakarta.validation.Valid;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getSelectedUser(String userId);

    Object getAllUserIds();

    void save(UserDTO user);
}
