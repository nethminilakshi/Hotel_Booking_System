package com.org.hotel_booking_system_backend.Advicer;

import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@CrossOrigin
public class AppWideExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseUtil exceptionHandler(Exception ex){

       return new ResponseUtil(500, ex.getMessage(), null);
    }
}
