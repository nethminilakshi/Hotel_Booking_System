package com.org.hotel_booking_system_backend.exception;

public class ImageExtractionFailedException extends RuntimeException {
    public ImageExtractionFailedException(String imageId) {
        super("Failed to extract image with id: " + imageId);
    }
}
