package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepo extends JpaRepository<Hotel, Long> {
}
