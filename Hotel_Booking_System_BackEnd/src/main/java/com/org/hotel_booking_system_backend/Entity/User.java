package com.org.hotel_booking_system_backend.Entity;

import com.org.hotel_booking_system_backend.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    private String userId;

    @Column(nullable = false, unique = true)
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
