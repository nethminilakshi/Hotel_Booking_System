package com.org.hotel_booking_system_backend.Service;

public interface EmailService {
     void sendBookingConfirmationEmail(String to, String subject, String body) throws Exception;

    }
