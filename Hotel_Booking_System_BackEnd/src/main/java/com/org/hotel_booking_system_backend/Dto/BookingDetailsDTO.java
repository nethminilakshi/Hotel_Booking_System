package com.org.hotel_booking_system_backend.Dto;

import com.org.hotel_booking_system_backend.Entity.Customer;
import com.org.hotel_booking_system_backend.Entity.Payment;
import com.org.hotel_booking_system_backend.Entity.Room;
import jakarta.persistence.*;

import java.time.LocalDate;

public class BookingDetailsDTO {

    private Long bookingId;
    private Customer customer;
    private Room room;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private Payment payment;

    public BookingDetailsDTO() {
    }

    public BookingDetailsDTO(Long bookingId, Customer customer, Room room, LocalDate checkIn, LocalDate checkOut, String status, Payment payment) {
        this.bookingId = bookingId;
        this.customer = customer;
        this.room = room;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        this.payment = payment;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    @Override
    public String toString() {
        return "BookingDetailsDTO{" +
                "bookingId=" + bookingId +
                ", customer=" + customer +
                ", room=" + room +
                ", checkIn=" + checkIn +
                ", checkOut=" + checkOut +
                ", status='" + status + '\'' +
                ", payment=" + payment +
                '}';
    }
}
