package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getSelectedUser(UUID userId);


    Object getAllUserIds();

    int save(UserDTO user, String role);

    int deleteUserByEmail(String email);

    int saveUser( UserDTO userDTO);

    int saveAdmin(UserDTO userDTO);

    int updateUser(String email, UserDTO userDTO);

    List<UserDTO> getAllAdmins();
    UserDTO existsByEmailAndContact(String email, String contact);

    UserDTO getUserByEmail(String email);

    void deleteAdmin(String email);
}
