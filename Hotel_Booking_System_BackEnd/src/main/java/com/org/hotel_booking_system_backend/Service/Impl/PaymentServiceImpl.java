package com.org.hotel_booking_system_backend.Service.Impl;

import com.org.hotel_booking_system_backend.Dto.PaymentDTO;
import com.org.hotel_booking_system_backend.Entity.Hotel;
import com.org.hotel_booking_system_backend.Entity.Payment;
import com.org.hotel_booking_system_backend.Repo.PaymentRepo;
import com.org.hotel_booking_system_backend.Repo.RoomRepo;
import com.org.hotel_booking_system_backend.Service.PaymentService;
import com.org.hotel_booking_system_backend.Util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;
    @Autowired
    private Mapping mapper;

    @Override
    public List<PaymentDTO> getAll() {
        List<Payment> getAllPayments = paymentRepo.findAll();
        return mapper.convertPaymentToDTOList(getAllPayments);    }
}
