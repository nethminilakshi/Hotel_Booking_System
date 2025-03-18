package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Entity.User;
import com.org.hotel_booking_system_backend.Repo.UserRepo;
import com.org.hotel_booking_system_backend.Service.UserService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.Mapping;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private Mapping mapping;
    @Autowired
    private ModelMapper modelMapper;

    public UserServiceImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;

        // Define your mappings here
        modelMapper.addMappings(new PropertyMap<User, UserDTO>() {
            @Override
            protected void configure() {
                map().setUserId(source.getUserId());
            }
        });
    }


    @Override
    public List<UserDTO> getAllUsers() {
        List<User> getAllUsers = userRepo.findAll();
        return mapping.convertUserToDTOList(getAllUsers);
    }

    @Override
    public UserDTO getSelectedUser(String userId) {
        if (userRepo.existsById(userId)) {
            User userEntityByID = userRepo.getReferenceById(userId);
            return mapping.convertToUserDTO(userEntityByID);
        } else {
            throw new RuntimeException("User not Found");
        }
    }

    @Override
    public List<String> getAllUserIds() {
        return userRepo.findAllUserIds();

    }

    @Override
    public void save(UserDTO userDTO) {
        User user1 = mapping.convertToUserEntity(userDTO);

        if (user1.getUserId() == null || user1.getUserId().isEmpty()) {
            user1.setUserId(AppUtil.createRoomTypeCode());
        }

        userRepo.save(user1);
    }

}


