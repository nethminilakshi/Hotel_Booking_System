package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Service.BookingService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/Booking")
@CrossOrigin(origins = "http://localhost:63342")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("getAllHotelBookings")
    public ResponseUtil getBookingsByHotel(Long hotelID) {
        List<BookingDetailsDTO> bookings = bookingService.getAll();
        return new ResponseUtil(200, "booking details retrieved", bookings);
    }
}
