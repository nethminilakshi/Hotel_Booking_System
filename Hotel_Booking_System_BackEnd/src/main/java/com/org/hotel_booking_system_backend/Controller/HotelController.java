package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Service.HotelService;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/hotel")
@CrossOrigin
public class HotelController {
    private List<HotelDTO> hotelDTOList;
    @Autowired
    private HotelService hotelService;

    @PostMapping(path = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseUtil saveHotel(@ModelAttribute HotelDTO hotelDTO) throws IOException {
        hotelService.save(hotelDTO);
        return new ResponseUtil(201,"Hotel details saved",null);
    }

    @GetMapping(path = "getAll")
    public ResponseUtil getHotels(){
        return new ResponseUtil(200, "Success",hotelService.getAll());
    }

    @PutMapping("update")
    public ResponseUtil updateHotel(@ModelAttribute HotelDTO hotelDTO) throws IOException {
        hotelService.update(hotelDTO);
        return new ResponseUtil(200, "Hotel details are updated", null);
    }
}
