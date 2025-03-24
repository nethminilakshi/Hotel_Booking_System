package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, String> {
}
