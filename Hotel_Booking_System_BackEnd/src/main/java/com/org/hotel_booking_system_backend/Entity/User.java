package com.org.hotel_booking_system_backend.Entity;

import com.org.hotel_booking_system_backend.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String contact;


    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ADMIN, CUSTOMER, MANAGER


    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL)
    private List<Hotel> managedHotels;



}
