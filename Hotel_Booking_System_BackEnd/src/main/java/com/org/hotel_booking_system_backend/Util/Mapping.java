package com.org.hotel_booking_system_backend.Util;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Entity.Room;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Entity.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Mapping {
    @Autowired
    private ModelMapper modelMapper;

    public Mapping() {
        this.modelMapper = new ModelMapper();
        configureMappings(); // Call the method to configure mappings
    }

    private void configureMappings() {
        //  User to UserDTO mapping
        modelMapper.addMappings(new PropertyMap<User, UserDTO>() {
            @Override
            protected void configure() {
                map().setUserId(source.getUserId()); // Assuming UserDTO has a userId field
                map().setUsername(source.getUsername()); // Add more fields if needed
            }
        });

        // ✅ Hotel to HotelDTO mapping (Fixing managerId mapping)
        modelMapper.addMappings(new PropertyMap<Hotel, HotelDTO>() {
            @Override
            protected void configure() {
                map().setHotelId(source.getHotelId());
                map().setName(source.getName());
                map().setLocation(source.getLocation());
                map().setDescription(source.getDescription());
                map().setImage(source.getImage());

                //  Correctly map managerId from User
                using(ctx -> ctx.getSource() == null ? null : ((User) ctx.getSource()).getUserId())
                        .map(source.getManager(), destination.getManagerId());
            }
        });

        //  RoomType to RoomTypeDTO mapping
        modelMapper.addMappings(new PropertyMap<RoomType, RoomTypeDTO>() {
            @Override
            protected void configure() {
                map().setTypeId(source.getTypeId());// Assuming roomTypeId exists in RoomTypeDTO
                map().setDescription(source.getDescription());
                map().setPrice(source.getPrice());
                map().setQtyOnHand(source.getQtyOnHand());
                map().setImage(source.getImage());
            }
        });

        // ✅ Room to RoomDTO mapping
        modelMapper.addMappings(new PropertyMap<Room, RoomDTO>() {
            @Override
            protected void configure() {
                map().setRoomId(source.getRoomId()); // Assuming roomId exists in RoomDTO
                map().setAvailability(source.getAvailability());
                map().setRoomType(source.getRoomType());
                map().setHotel(source.getHotel());
            }
        });
    }

    // ✅ RoomType and DTO conversions
    public RoomTypeDTO convertToRoomTypeDTO(RoomType roomType) {
        return modelMapper.map(roomType, RoomTypeDTO.class);
    }

    public RoomType convertToRoomTypeEntity(RoomTypeDTO dto) {
        return modelMapper.map(dto, RoomType.class);
    }

    public List<RoomTypeDTO> convertRoomTypeToDTOList(List<RoomType> roomTypes) {
        return modelMapper.map(roomTypes, new TypeToken<List<RoomTypeDTO>>() {}.getType());
    }

    // ✅ Hotel and DTO conversions
    public HotelDTO convertToHotelDTO(Hotel hotel) {
        return modelMapper.map(hotel, HotelDTO.class);
    }

    public Hotel convertToHotelEntity(HotelDTO dto) {
        return modelMapper.map(dto, Hotel.class);
    }

    public List<HotelDTO> convertHotelToDTOList(List<Hotel> hotels) {
        return modelMapper.map(hotels, new TypeToken<List<HotelDTO>>() {}.getType());
    }

    // ✅ User and DTO conversions
    public UserDTO convertToUserDTO(User user) {
        return user == null ? null : modelMapper.map(user, UserDTO.class);
    }

    public User convertToUserEntity(UserDTO dto) {
        return modelMapper.map(dto, User.class);
    }

    public List<UserDTO> convertUserToDTOList(List<User> users) {
        return modelMapper.map(users, new TypeToken<List<UserDTO>>() {}.getType());
    }

    // ✅ Room and DTO conversions
    public RoomDTO convertToRoomDTO(Room room) {
        return modelMapper.map(room, RoomDTO.class);
    }

    public Room convertToRoomEntity(RoomDTO dto) {
        return modelMapper.map(dto, Room.class);
    }

    public List<RoomDTO> convertRoomToDTOList(List<Room> rooms) {
        return modelMapper.map(rooms, new TypeToken<List<RoomDTO>>() {}.getType());
    }
}
