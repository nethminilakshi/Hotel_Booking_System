package com.org.hotel_booking_system_backend.Util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

public class AppUtil {
    private static int roomTypeCount = 0;
    private static int hotelCount = 0;

    public static synchronized String createRoomTypeCode(){
        roomTypeCount++;
        return String.format("RT%03d", roomTypeCount);
    }

    public static synchronized String createHotelCode(){
        hotelCount++;
        return String.format("H%03d", hotelCount);
    }
    public static String toBase64CropImage(MultipartFile cropImage) throws IOException {
        if (cropImage == null || cropImage.isEmpty()) {
            return null;
        }
        return Base64.getEncoder().encodeToString(cropImage.getBytes());
    }

    public static String toBase64FieldImage1(MultipartFile fieldImage1) throws IOException{
        if (fieldImage1 == null || fieldImage1.isEmpty()){
            return null;
        }
        return Base64.getEncoder().encodeToString(fieldImage1.getBytes());
    }

    public static String toBase64FieldImage2(MultipartFile fieldImage2) throws IOException{
        if (fieldImage2 == null || fieldImage2.isEmpty()){
            return null;
        }
        return Base64.getEncoder().encodeToString(fieldImage2.getBytes());
    }

    public static String toBase64ObservedImage(MultipartFile observedImage) {
        try {
            if (observedImage == null || observedImage.isEmpty()) {
                return "";
            }
            return Base64.getEncoder().encodeToString(observedImage.getBytes());
        } catch (IOException e) {
            return "";
        }
    }



}
