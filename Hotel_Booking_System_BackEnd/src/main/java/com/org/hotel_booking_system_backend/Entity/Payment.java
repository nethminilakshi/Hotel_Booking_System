package com.org.hotel_booking_system_backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    private String paymentId;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // CREDIT_CARD, PAYPAL, STRIPE

    @Enumerated(EnumType.STRING)
    private PaymentStatus status ; // SUCCESS, FAILED


    public enum PaymentMethod {
        CREDIT_CARD, PAYPAL, STRIPE
    }

    public enum PaymentStatus {
        SUCCESS, FAILED
    }
}
