package com.org.hotel_booking_system_backend.Repo;

import com.org.hotel_booking_system_backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {
    @Query("SELECT u.userId FROM User u")
    List<String> findAllUserIds();

    User findByEmail(String email);

    boolean existsByEmail(String email);

    void deleteByEmail(String email);

    boolean existsByContact(String contact);
}
