package com.org.hotel_booking_system_backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "hotels")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID hotelId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location; // Different locations (branches)

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id",nullable = false) // Managed by a Hotel Manager (User)
    private User manager;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    private List<Room> rooms;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;


}
