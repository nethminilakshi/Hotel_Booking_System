package com.org.hotel_booking_system_backend.Util;

import com.org.hotel_booking_system_backend.Dto.*;
import com.org.hotel_booking_system_backend.Entity.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

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
                map().setName(source.getName()); // Add more fields if needed
            }
        });

        //  Hotel to HotelDTO mapping (Fixing managerId mapping)
        modelMapper.addMappings(new PropertyMap<Hotel, HotelDTO>() {
            @Override
            protected void configure() {
                map().setHotelId(source.getHotelId()); // Assuming HotelDTO has a hotelId field
                map().setName(String.valueOf(source.getName()));
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

        //  Room to RoomDTO mapping
        modelMapper.addMappings(new PropertyMap<Room, RoomDTO>() {
            @Override
            protected void configure() {
                map().setRoomId(source.getRoomId()); // Assuming roomId exists in RoomDTO
                map().setHotelId(String.valueOf(source.getHotel().getHotelId())); // Assuming RoomDTO has a hotel field
            }
        });
    }

    //  RoomType and DTO conversions
    public RoomTypeDTO convertToRoomTypeDTO(RoomType roomType) {
        return modelMapper.map(roomType, RoomTypeDTO.class);
    }

    public RoomType convertToRoomTypeEntity(RoomTypeDTO dto) {
        return modelMapper.map(dto, RoomType.class);
    }

    public List<RoomTypeDTO> convertRoomTypeToDTOList(List<RoomType> roomTypes) {
        return modelMapper.map(roomTypes, new TypeToken<List<RoomTypeDTO>>() {}.getType());
    }

    //  Hotel and DTO conversions
    public HotelDTO convertToHotelDTO(Hotel hotel) {
        return modelMapper.map(hotel, HotelDTO.class);
    }

    public Hotel convertToHotelEntity(HotelDTO dto) {
        return modelMapper.map(dto, Hotel.class);
    }

    public List<HotelDTO> convertHotelToDTOList(List<Hotel> hotels) {
        return modelMapper.map(hotels, new TypeToken<List<HotelDTO>>() {}.getType());
    }

    //  User and DTO conversions
    public UserDTO convertToUserDTO(User user) {
        return user == null ? null : modelMapper.map(user, UserDTO.class);
    }

    public User convertToUserEntity(UserDTO dto) {
        return modelMapper.map(dto, User.class);
    }

    public List<UserDTO> convertUserToDTOList(List<User> users) {
        return modelMapper.map(users, new TypeToken<List<UserDTO>>() {}.getType());
    }

    //  Room and DTO conversions
    public RoomDTO convertToRoomDTO(Room room) {
        return modelMapper.map(room, RoomDTO.class);
    }

    public Room convertToRoomEntity(RoomDTO dto) {
        Room room = new Room();
        room.setRoomId(dto.getRoomId());
        room.setFloorNumber(dto.getFloorNumber());

        // Set RoomType
        RoomType roomType = new RoomType();
        roomType.setTypeId(UUID.fromString(dto.getRoomTypeId()));
        room.setRoomType(roomType);

        //  Set Hotel using hotelId from DTO
        Hotel hotel = new Hotel();
        hotel.setHotelId(UUID.fromString(dto.getHotelId()));
        room.setHotel(hotel);

        return room;
    }


    public List<RoomDTO> convertRoomToDTOList(List<Room> rooms) {
        return modelMapper.map(rooms, new TypeToken<List<RoomDTO>>() {}.getType());
    }

    // payment to paymentDTO
    public PaymentDTO convertToPaymentDTO(Payment payment) {
        return modelMapper.map(payment, PaymentDTO.class);
    }

    public Payment convertToPaymentEntity(PaymentDTO dto) {
        return modelMapper.map(dto, Payment.class);
    }

    public List<PaymentDTO> convertPaymentToDTOList(List<Payment> payments) {
        return modelMapper.map(payments, new TypeToken<List<PaymentDTO>>() {}.getType());
    }

    // booking to bookingDTO
    public BookingDetailsDTO convertToBookingDTO(Booking booking) {
        return modelMapper.map(booking, BookingDetailsDTO.class);

    }
public List<BookingDetailsDTO> convertBookingToDTOList(List<Booking> bookings) {
        return modelMapper.map(bookings, new TypeToken<List<BookingDetailsDTO>>() {}.getType());
    }

    public Booking convertToBookingEntity(BookingDetailsDTO dto) {
        return modelMapper.map(dto, Booking.class);
    }

    // review to reviewDTO
    public ReviewDTO convertToReviewDTO(Review review) {
        return modelMapper.map(review, ReviewDTO.class);
    }
    public Review convertToReviewEntity(ReviewDTO dto) {
        return modelMapper.map(dto, Review.class);
    }
    public List<ReviewDTO> convertReviewToDTOList(List<Review> reviews) {
        return modelMapper.map(reviews, new TypeToken<List<ReviewDTO>>() {}.getType());
    }


}
