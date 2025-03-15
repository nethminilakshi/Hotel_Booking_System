package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.*;
import java.util.UUID;

@Repository
public interface RoomTypeRepo extends JpaRepository<RoomType, String> {
}
