package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Service.HotelService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/hotelController")
@CrossOrigin(origins = "http://localhost:63342")
public class AdminHotelController {
    private List<HotelDTO> hotelDTOList;
    static Logger logger = LoggerFactory.getLogger(ManagerHotelController.class);
    @Autowired
    private HotelService hotelService;

    @GetMapping(path = "getAll",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getHotels(){
        List<HotelDTO> hotelDTOS = hotelService.getAll();
        for (HotelDTO hotel : hotelDTOS) {
            System.out.println("Hotel ID: " + hotel.getHotelId()); //  Debugging
        }
        return new ResponseUtil(200, "Success", hotelDTOS);    }


}
