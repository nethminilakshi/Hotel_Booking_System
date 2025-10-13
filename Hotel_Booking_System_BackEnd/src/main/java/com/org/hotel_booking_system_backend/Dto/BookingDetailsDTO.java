package com.org.hotel_booking_system_backend.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingDetailsDTO {

    private UUID bookingId;
   private UserDTO user;
    private String email;
    private String contact;
    private HotelDTO hotel;
    private UUID hotelId;
    private int roomCount;
    private RoomTypeDTO roomType;
    private UUID roomTypeId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String time;
    private String status;

}
