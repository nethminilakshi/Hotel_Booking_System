package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.Entity.Customer;
import com.org.hotel_booking_system_backend.Entity.Payment;
import com.org.hotel_booking_system_backend.Entity.Room;
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
    private String roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String PhoneNumber;
    private String status;


}
