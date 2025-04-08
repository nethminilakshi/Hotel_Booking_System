package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface BookingRepo extends JpaRepository<Booking, UUID> {
    @Query("SELECT COALESCE(SUM(b.roomCount), 0) FROM Booking b " +
            "JOIN b.room r " +
            "JOIN r.roomType rt " +
            "WHERE r.hotel.hotelId = :hotelId " +
            "AND rt.typeId = :roomTypeId " +
            "AND b.checkIn < :checkoutDate " +
            "AND b.checkOut > :checkinDate " +
            "AND b.time = :time " +
            "AND b.status = 'CONFIRMED'")
    int countBookingsByHotelAndRoomTypeAndDateRange(@Param("hotelId") UUID hotelId,
                         @Param("roomTypeId") UUID roomTypeId,
                         @Param("checkinDate") LocalDate checkinDate,
                         @Param("checkoutDate") LocalDate checkoutDate,
                         @Param("time") String time);


}
