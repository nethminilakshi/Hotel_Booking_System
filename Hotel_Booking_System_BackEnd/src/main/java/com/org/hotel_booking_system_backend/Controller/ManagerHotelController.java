package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.HotelDTO;
import com.org.hotel_booking_system_backend.Service.HotelService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/hotel")
@CrossOrigin(origins = "http://localhost:63342")
public class ManagerHotelController {
    private List<HotelDTO> hotelDTOList;
    static Logger logger = LoggerFactory.getLogger(ManagerHotelController.class);
    @Autowired
    private HotelService hotelService;

    @PostMapping(path = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseUtil saveHotel(@Valid
                                  @RequestPart("name") String hotelName,
                                  @RequestPart("location") String location,
                                  @RequestPart("description") String description,
                                  @RequestPart("image") MultipartFile image,
                                  @RequestPart("manager_id") String managerId) {
        try {
            // Log incoming data
            logger.info("Received hotel details - Name: {}, Location: {}, Description: {}, Manager ID: {}",
                    hotelName, location, description, managerId);


            // save file into path

            // Convert image to Base64
            String base64Image = AppUtil.toBase64FieldImage1(image);
            logger.info("Converted image to Base64");

            // Set up hotel DTO
            var hotelDTO = new HotelDTO();
            hotelDTO.setName(hotelName);
            hotelDTO.setLocation(location);
            hotelDTO.setDescription(description);
            hotelDTO.setImage(base64Image);
            hotelDTO.setManagerId(managerId);

            // Save the hotel
            hotelService.save(hotelDTO);

            //  Return a proper response
            logger.info("Hotel saved successfully: " + hotelDTO);
            return new ResponseUtil(200, "Success", hotelDTO);

        } catch (Exception e) {
            logger.error("Error while saving hotel: ", e);
            return new ResponseUtil(500, "Failed to save hotel: " + e.getMessage(), null);
        }
    }



    @GetMapping(path = "getAll",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getHotels(){
        List<HotelDTO> hotelDTOS = hotelService.getAll();
        for (HotelDTO hotel : hotelDTOS) {
            System.out.println("Hotel ID: " + hotel.getHotelId()); //  Debugging
        }
        return new ResponseUtil(200, "Success", hotelDTOS);    }

    @GetMapping(value = "/{hotelId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public HotelDTO getSelectedId(@PathVariable("hotelId") UUID hotelId){
        return hotelService.getHotelId(hotelId);
    }

    @PutMapping(value = "update/{hotelId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseUtil update(
            @PathVariable("hotelId") String hotelId,
            @RequestPart("hotelName") String hotelName,
            @RequestPart("location") String location,
            @RequestPart("description") String description,
            @RequestPart(value = "image", required = false) MultipartFile updatedImage,
            @RequestPart("manager_id") String manager_id
    ) {
        try {
            logger.info("Updating Hotel ID: " + hotelId); //  Debugging

            String updateBase64CropImage = null;
            if (updatedImage != null && !updatedImage.isEmpty()) {
                updateBase64CropImage = AppUtil.toBase64CropImage(updatedImage);
            }

            var updateHotelDTO = new HotelDTO();
            updateHotelDTO.setName(hotelName);
            updateHotelDTO.setLocation(location);
            updateHotelDTO.setDescription(description);
            updateHotelDTO.setManagerId(manager_id);

            if (updateBase64CropImage != null) {
                updateHotelDTO.setImage(updateBase64CropImage);
            }

            hotelService.update(updateHotelDTO);
            logger.info("Hotel details Updated: " + updateHotelDTO);

            return new ResponseUtil(200, "Success", updateHotelDTO);
        } catch (Exception e) {
            logger.error("Error updating hotel: " + e.getMessage());
            return new ResponseUtil(500, "Error updating hotel: " + e.getMessage(), null);
        }
    }

    @DeleteMapping(value = "delete/{hotelId}")
    public ResponseUtil delete(@PathVariable("hotelId") UUID hotelId) {
        try {
            hotelService.delete(hotelId);
            logger.info("Hotel deleted :" + hotelId);
            return new ResponseUtil(200, "Hotel Deleted Successfully", null);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseUtil(500, "Error deleting hotel: " + e.getMessage(), null);
        }
    }
    }
