package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;
import com.org.hotel_booking_system_backend.Entity.RoomType;
import com.org.hotel_booking_system_backend.Entity.User;
import com.org.hotel_booking_system_backend.Repo.UserRepo;
import com.org.hotel_booking_system_backend.Service.BookingService;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.JwtUtil;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import com.org.hotel_booking_system_backend.Util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/Booking")
@CrossOrigin(origins = "http://localhost:63342")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomTypeService roomTypeService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepo userRepo;

    @GetMapping("getAllHotelBookings")
    public ResponseUtil getBookingsByHotel(UUID hotelID) {
        List<BookingDetailsDTO> bookings = bookingService.getAll();
        return new ResponseUtil(200, "booking details retrieved", bookings);
    }

    @PostMapping("/save")
    public ResponseUtil saveBooking(@RequestBody BookingDetailsDTO bookingDTO,
                                    @RequestHeader("Authorization") String authHeader) {
        try {
            //  Check if Authorization header is valid
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return new ResponseUtil(VarList.Unauthorized, "Authorization header missing or invalid", null);
            }

            //  Extract JWT token
            String token = authHeader.substring(7);

            //  Extract email from token
            String email = jwtUtil.extractEmailFromToken(token);
            if (email == null || email.isEmpty()) {
                return new ResponseUtil(VarList.Unauthorized, "Invalid token. Please log in again.", null);
            }

            //  Get user from DB
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not registered. Please sign up."));

            //  Set user-related fields from DB into DTO
            bookingDTO.setEmail(user.getEmail());
            bookingDTO.setPhoneNumber(user.getContact());
            bookingDTO.setCustomerName(user.getName());

            //  Save booking
            bookingService.save(bookingDTO);

            return new ResponseUtil(VarList.Created, "Booking successful", bookingDTO);

        } catch (Exception e) {
            return new ResponseUtil(VarList.Internal_Server_Error, "Booking failed: " + e.getMessage(), null);
        }
    }


    @GetMapping("/availability")
    public ResponseUtil getRoomAvailability(@RequestParam UUID hotelId,
                                            @RequestParam UUID roomTypeId,
                                            @RequestParam String checkinDate,
                                            @RequestParam String checkoutDate,
                                            @RequestParam String time) {
        try {
            LocalDate checkin = LocalDate.parse(checkinDate);
            LocalDate checkout = LocalDate.parse(checkoutDate);

            if (checkin.isAfter(checkout)) {
                return new ResponseUtil(400, "Check-in date must be before check-out date", null);
            }

            RoomType roomType = roomTypeService.getRoomTypeById(roomTypeId);

            System.out.println("Room Type Name: " + roomType.getName());
            System.out.println("Total Qty On Hand: " + roomType.getQtyOnHand());
            // Get total rooms available
            int totalRooms = roomType.getQtyOnHand();

            // Count booked rooms
            int bookedRooms = bookingService.countBookedRooms(hotelId, roomTypeId, checkin, checkout, time);
            System.out.println("Booked Rooms: " + bookedRooms);

            int available = totalRooms - bookedRooms;
            System.out.println("Available Rooms: " + available);

            // Return availability response
            if (available > 0) {
                return new ResponseUtil(200, "Room available", available);
            } else {
                return new ResponseUtil(400, "No rooms available", null);
            }
        } catch (DateTimeParseException e) {
            return new ResponseUtil(400, "Invalid date format", null);
        } catch (Exception e) {
            return new ResponseUtil(500, "An error occurred: " + e.getMessage(), null);
        }
    }



}
