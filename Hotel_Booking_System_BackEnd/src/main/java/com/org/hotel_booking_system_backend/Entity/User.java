package com.org.hotel_booking_system_backend.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String role; // ADMIN, HOTEL_OWNER, HOTEL_MANAGER

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL)
    private List<Hotel> managedHotels;

    
    public User() {
    }

    public User(Long userId, String username, String email, String password, String role, List<Hotel> managedHotels) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.managedHotels = managedHotels;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Hotel> getManagedHotels() {
        return managedHotels;
    }

    public void setManagedHotels(List<Hotel> managedHotels) {
        this.managedHotels = managedHotels;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                ", managedHotels=" + managedHotels +
                '}';
    }
}
