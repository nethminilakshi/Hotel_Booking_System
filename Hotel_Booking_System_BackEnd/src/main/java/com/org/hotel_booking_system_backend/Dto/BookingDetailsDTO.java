package com.org.hotel_booking_system_backend.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingDetailsDTO {

    private String bookingId;
    private String customerId;
    private String customerName;
    private String PhoneNumber;
    private String email;
    private String roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String time;
    private String status;


}
