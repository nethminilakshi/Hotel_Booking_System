package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepo extends JpaRepository<Booking, String> {
}
