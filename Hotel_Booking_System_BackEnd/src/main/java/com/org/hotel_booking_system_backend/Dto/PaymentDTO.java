package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.Entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentDTO {

    private String paymentId;
    private Booking booking;
    private Double amount;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String status ;


}
