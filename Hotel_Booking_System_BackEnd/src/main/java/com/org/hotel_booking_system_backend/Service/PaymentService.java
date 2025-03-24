package com.org.hotel_booking_system_backend.Service;

import com.org.hotel_booking_system_backend.Dto.PaymentDTO;

import java.util.List;

public interface PaymentService {
    List<PaymentDTO> getAll();
}
