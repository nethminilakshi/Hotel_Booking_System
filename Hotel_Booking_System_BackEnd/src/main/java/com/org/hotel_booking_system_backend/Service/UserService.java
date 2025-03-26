package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getSelectedUser(String userId);

    Object getAllUserIds();

    int save(UserDTO user);

    void deleteUser(String email);
}
