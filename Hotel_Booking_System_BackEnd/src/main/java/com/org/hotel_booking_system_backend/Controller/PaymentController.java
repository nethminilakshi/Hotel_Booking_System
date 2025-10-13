package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.PaymentDTO;
import com.org.hotel_booking_system_backend.Dto.RoomDTO;
import com.org.hotel_booking_system_backend.Service.PaymentService;
import com.org.hotel_booking_system_backend.Service.RoomService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/payment")
@CrossOrigin(origins = "http://localhost:63342")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("getAll")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseUtil getAllPayments(){

        List<PaymentDTO> paymentDTOS = paymentService.getAll();
        return new ResponseUtil(200, "Payment details retrieved", paymentDTOS);
    }
}
