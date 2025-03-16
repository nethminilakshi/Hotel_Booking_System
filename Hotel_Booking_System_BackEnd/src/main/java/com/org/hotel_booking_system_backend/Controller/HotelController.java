package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Service.HotelService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/v1/hotel")
@CrossOrigin
public class HotelController {
    private List<HotelDTO> hotelDTOList;
    static Logger logger = LoggerFactory.getLogger(HotelController.class);
    @Autowired
    private HotelService hotelService;

    @PostMapping(path = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseUtil saveHotel(@Valid
                                  @RequestPart("hotelName") String hotelName,
                                  @RequestPart("location") String location,
                                  @RequestPart("description") String description,
                                  @RequestPart("image") MultipartFile image,
                                  @RequestPart("manager_id")String managerId){

        try{
            String base64Image = AppUtil.toBase64FieldImage1(image);
            var hotelDTO = new HotelDTO();
            hotelDTO.setHotelId(AppUtil.createHotelCode());
            hotelDTO.setName(hotelName);
            hotelDTO.setLocation(location);
            hotelDTO.setDescription(location);
            hotelDTO.setImage(base64Image);
            hotelDTO.setManager(managerId);

            hotelService.save(hotelDTO);
            logger.info("hotel saved :" + hotelDTO);
            return new ResponseUtil(HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseUtil(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(path = "getAll",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getHotels(){
        hotelService.getAll(); // Add this line to check the returned data
        return new ResponseUtil(200, "Success",hotelService.getAll());
    }

    @GetMapping(value = "/{hotelId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public HotelDTO getSelectedId(@PathVariable("hotelId") String hotelId){
        return hotelService.getHotelId(hotelId);
    }
    @PutMapping("update")
    public ResponseUtil updateHotel(@ModelAttribute HotelDTO hotelDTO) throws IOException {
        hotelService.update(hotelDTO);
        return new ResponseUtil(200, "Hotel details are updated", null);
    }

    @DeleteMapping(value = "/{hotelId}")
    public ResponseUtil delete(@PathVariable("hotelId") String hotelId) {
        try {
            hotelService.delete(hotelId);
            logger.info("Hotel deleted :" + hotelId);
            return new ResponseUtil(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseUtil(HttpStatus.NOT_FOUND);
        }
    }
    }
