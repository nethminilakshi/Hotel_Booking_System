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
    private String customerId;
    private String customerName;
    private String PhoneNumber;
    private String email;
    private String hotelId;
    private int roomCount;
    private String roomTypeId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String time;
    private String status;


}
