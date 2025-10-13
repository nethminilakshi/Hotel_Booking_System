package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.BookingDetailsDTO;
import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Dto.UserDTO;
import com.org.hotel_booking_system_backend.Entity.Booking;
import com.org.hotel_booking_system_backend.Service.BookingService;
import com.org.hotel_booking_system_backend.Service.EmailService;
import com.org.hotel_booking_system_backend.Service.HotelService;
import com.org.hotel_booking_system_backend.Service.Impl.EmailServiceImpl;
import com.org.hotel_booking_system_backend.Service.Impl.UserServiceImpl;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.JwtUtil;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import com.org.hotel_booking_system_backend.Util.VarList;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/Booking")
@CrossOrigin(origins = "http://localhost:63342")
public class BookingController {

    @Autowired
    private BookingService bookingService;
@Autowired
private HotelService hotelService;
    @Autowired
    private RoomTypeService roomTypeService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserServiceImpl userServiceImpl;
    @Autowired
    EmailServiceImpl emailService;


    @GetMapping("getAllHotelBookings")
    public ResponseUtil getBookingsByHotel(UUID hotelID) {
        List<BookingDetailsDTO> bookings = bookingService.getAll();
        return new ResponseUtil(200, "booking details retrieved", bookings);
    }

    @GetMapping("getAll")
    public ResponseUtil getAllBookings() {
        List<BookingDetailsDTO> bookings = bookingService.getAll();
        return new ResponseUtil(201, "booking details retrieved", bookings);
    }



    @PostMapping("/save")
    public ResponseUtil saveBooking(@Valid @RequestBody BookingDetailsDTO bookingDTO) {
        try {
            // Fix: The frontend sends 'quantity' but we expect 'roomCount'
            // If quantity exists in the DTO, make sure to handle it appropriately
            if (bookingDTO.getRoomCount() <= 0) {
                return new ResponseUtil(400, "Room count must be at least 1", null);
            }

            System.out.println("Incoming roomCount: " + bookingDTO.getRoomCount());

            UserDTO userDTO = userServiceImpl.existsByEmailAndContact(bookingDTO.getEmail(), bookingDTO.getContact());
            if (userDTO == null) {
                return new ResponseUtil(404, "User not found, please register first.", null);
            }

            HotelDTO hotelDTO = hotelService.getHotelById(bookingDTO.getHotelId());
            if (hotelDTO == null) {
                return new ResponseUtil(400, "Hotel not found", null);
            }

            RoomTypeDTO roomTypeDTO = roomTypeService.getRoomTypeById(bookingDTO.getRoomTypeId());
            if (roomTypeDTO == null) {
                return new ResponseUtil(400, "Room type not found", null);
            }

            // Fill booking details
            bookingDTO.setUser(userDTO);
            bookingDTO.setHotel(hotelDTO);
            bookingDTO.setRoomType(roomTypeDTO);

            // Save the booking
            Booking savedBooking = bookingService.save(bookingDTO);

            // Check if booking was saved successfully
            if (savedBooking == null) {
                return new ResponseUtil(500, "Failed to save booking", null);
            }
            roomTypeService.updateRoomTypeQuantity(bookingDTO.getRoomTypeId(), bookingDTO.getRoomCount());


            // Send confirmation email
            String userEmail = bookingDTO.getEmail();
            String userName = userDTO.getName();
            LocalDate checkInDate = bookingDTO.getCheckIn();
            LocalDate checkOutDate = bookingDTO.getCheckOut();
            String time = bookingDTO.getTime();
            String roomTypeName = roomTypeDTO.getName();
            String hotelName = hotelDTO.getName();

            try {
                emailService.sendBookingConfirmationEmail(
                        userEmail,
                        "Booking Confirmation",
                        "Dear " + userName + ",\n\n" +
                                "Your booking has been confirmed!\n\n" +
                                "📍 Hotel: " + hotelName + "\n" +
                                "🛏️ Room Type: " + roomTypeName + "\n" +
                                "📅 Check-in Date: " + checkInDate + "\n" +
                                "📅 Check-out Date: " + checkOutDate + "\n" +
                                "Time:" + time + "\n" +
                                "🆔 Booking ID: " + savedBooking.getBookingId() + "\n\n" +
                                "Room count: " + bookingDTO.getRoomCount() + "\n" +
                                "👉 To secure your booking, please proceed to payment by clicking the link below:\n" +
                                "https://example.com/payment?bookingId=" + savedBooking.getBookingId() + "\n\n" +
                                "If you have any questions, feel free to contact us at  041-2265762.\n\n" +
                                "Thank you for choosing us!\n" +
                                "Best regards,\n"
                );
            } catch (MessagingException e) {
                e.printStackTrace();
                // Don't return here, just log the error and continue
                System.out.println("Failed to send confirmation email: " + e.getMessage());
            }

            // Return success response
            return new ResponseUtil(200, "Booking saved successfully for " + userDTO.getName(), savedBooking);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseUtil(500, "An error occurred: " + e.getMessage(), null);
        }
    }
    @GetMapping("/availability")
    public ResponseUtil getRoomAvailability(@RequestParam UUID hotelId,
                                            @RequestParam UUID roomTypeId,
                                            @RequestParam String checkinDate,
                                            @RequestParam String checkoutDate,
                                            @RequestParam String time) {
        try {
            // Parse dates and validate
            LocalDate checkin = LocalDate.parse(checkinDate);
            LocalDate checkout = LocalDate.parse(checkoutDate);

            if (checkin.isAfter(checkout)) {
                return new ResponseUtil(400, "Check-in date must be before check-out date", null);
            }

            // Validate that check-in date is not in the past
            if (checkin.isBefore(LocalDate.now())) {
                return new ResponseUtil(400, "Check-in date cannot be in the past", null);
            }

            // Validate time parameter (should be either "day" or "night")
            if (!time.equalsIgnoreCase("day") && !time.equalsIgnoreCase("night")) {
                return new ResponseUtil(400, "Invalid time. Must be 'day' or 'night'", null);
            }

            // Get room type details
            RoomTypeDTO roomType = roomTypeService.getRoomTypeById(roomTypeId);
            if (roomType == null) {
                return new ResponseUtil(404, "Room type not found", null);
            }

            // Get total rooms available for this room type
            int totalRooms = roomType.getQtyOnHand();
            if (totalRooms <= 0) {
                return new ResponseUtil(400, "No rooms of this type exist", 0);
            }

            try {
                // Find the maximum number of rooms booked for any single date in the range
                int maxBookedRooms = 0;
                LocalDate currentDate = checkin;

                while (!currentDate.isAfter(checkout.minusDays(1))) {
                    int bookedForDate = bookingService.countBookedRoomsForDateAndTime(
                            hotelId,
                            roomTypeId,
                            currentDate,
                            time.toLowerCase()
                    );

                    maxBookedRooms = Math.max(maxBookedRooms, bookedForDate);
                    currentDate = currentDate.plusDays(1);
                }

                // Calculate available rooms
                int available = totalRooms - maxBookedRooms;
                available = Math.max(0, available);

                // Return availability response
                if (available > 0) {
                    return new ResponseUtil(200, "Room available", available);
                } else {
                    return new ResponseUtil(400, "No rooms available for selected dates and time", 0);
                }
            } catch (Exception e) {
                System.err.println("Error calculating booked rooms: " + e.getMessage());
                e.printStackTrace();
                return new ResponseUtil(500, "Error calculating room availability", null);
            }
        } catch (DateTimeParseException e) {
            return new ResponseUtil(400, "Invalid date format. Please use YYYY-MM-DD format", null);
        } catch (Exception e) {
            System.err.println("Unexpected error in availability check: " + e.getMessage());
            e.printStackTrace();
            return new ResponseUtil(500, "An error occurred: " + e.getMessage(), null);
        }
    }
}
