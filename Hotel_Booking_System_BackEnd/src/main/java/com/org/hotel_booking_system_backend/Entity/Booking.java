package com.org.hotel_booking_system_backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    private String bookingId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false)
    private LocalDate checkIn;

    @Column(nullable = false)
    private LocalDate checkOut;

    @Column(nullable = false)
    private String PhoneNumber;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, CONFIRMED, CANCELLED

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;

    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED
    }

}
