package com.org.hotel_booking_system_backend.Config;

import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
    @Bean
    public ResponseUtil responseUtil() {
        return new ResponseUtil();
    }
}
