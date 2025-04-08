package com.org.hotel_booking_system_backend.Controller;

import com.org.hotel_booking_system_backend.Dto.RoomTypeDTO;
import com.org.hotel_booking_system_backend.Service.RoomTypeService;
import com.org.hotel_booking_system_backend.Util.AppUtil;
import com.org.hotel_booking_system_backend.Util.ResponseUtil;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("api/v1/roomType")
@CrossOrigin(origins = "http://localhost:63342")
public class ManagerRoomTypeController {
    private List<RoomTypeDTO> roomTypeDTOList;
    @Autowired
    private RoomTypeService roomTypeService;
    static Logger logger = LoggerFactory.getLogger(ManagerRoomTypeController.class);

    @PostMapping(path = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseUtil saveRoomType(@Valid
                                         @RequestParam("name") String name,
                                     @RequestParam("description") String description,
                                     @RequestParam("price") Double price,
                                     @RequestParam("qtyOnHand") Integer qtyOnHand,
                                     @RequestParam("noOfPersons") Integer noOfPersons,
                                     @RequestParam(value = "image") MultipartFile image) {

        try {
        logger.info("Saving Room Type...");
            // Convert image to Base64 if provided
            String base64Image = null;
            if (image != null && !image.isEmpty()) {
                logger.info("Processing image...");
                base64Image = AppUtil.toBase64CropImage(image);
                logger.info("Image converted successfully.");
            }

            // Create DTO
            RoomTypeDTO roomTypeDTO = new RoomTypeDTO();
            roomTypeDTO.setName(name);
            roomTypeDTO.setDescription(description);
            roomTypeDTO.setPrice(price);
            roomTypeDTO.setQtyOnHand(qtyOnHand);
            roomTypeDTO.setNoOfPersons(noOfPersons);
            roomTypeDTO.setImage(base64Image);

            logger.info("Saving RoomTypeDTO: {}", roomTypeDTO);

            // Call service to save
            roomTypeService.save(roomTypeDTO);
            logger.info("RoomType saved successfully.");

            return new ResponseUtil(201, "Room Type saved successfully", null);
        } catch (Exception e) {
            logger.error("Error saving Room Type: " + e.getMessage(), e);
            return new ResponseUtil(500, "Error saving Room Type: " + e.getMessage(), null);
        }
    }

    @GetMapping(path = "getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getRoomTypes() {
        List<RoomTypeDTO> roomTypes = roomTypeService.getAll();
        for (RoomTypeDTO room : roomTypes) {
            System.out.println("Room ID: " + room.getTypeId()); //  Debugging
        }
        return new ResponseUtil(200, "Success", roomTypes);
    }

    @DeleteMapping(value = "delete/{id}")
    public ResponseUtil deleteRoomType(@PathVariable(value = "id") UUID id) {
        try{
            roomTypeService.delete(id);
            logger.info("room removed :" + id);
return new ResponseUtil(200, "RoomType Deleted Successfully", null);
        }catch (Exception e){
            logger.error(e.getMessage());
            return new ResponseUtil(500, "Error deleting RoomType: " + e.getMessage(), null);
        }
    }


    @GetMapping(value = "/{roomTypeCode}", produces = MediaType.APPLICATION_JSON_VALUE)
    public RoomTypeDTO getSelectedType(@PathVariable("roomTypeCode") UUID roomTypeCode) {
        return roomTypeService.getSelectedType(roomTypeCode);
    }


    @PutMapping(path = "update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseUtil update(
            @PathVariable("id") UUID roomTypeId,
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart("price") String price,
            @RequestPart("qtyOnHand") Integer qtyOnHand,
            @RequestPart("noOfPersons") Integer noOfPersons,
            @RequestPart(value = "image", required = false) MultipartFile updatedImage

    ) {
        try {
            logger.info("Updating RoomType ID: " + roomTypeId); //  Debugging

            String updateBase64Image = null;
            if (updatedImage != null && !updatedImage.isEmpty()) {
                updateBase64Image = AppUtil.toBase64CropImage(updatedImage);
            }

            var updateRoomTypeDTO = new RoomTypeDTO();
            updateRoomTypeDTO.setName(name);
            updateRoomTypeDTO.setDescription(description);
            updateRoomTypeDTO.setPrice(Double.parseDouble(price));
            updateRoomTypeDTO.setQtyOnHand(qtyOnHand);
            updateRoomTypeDTO.setNoOfPersons(noOfPersons);

            if (updateBase64Image != null) {
                updateRoomTypeDTO.setImage(updateBase64Image);
            }

            roomTypeService.update(updateRoomTypeDTO);
            logger.info("RoomType Updated :" + updateRoomTypeDTO);
            return new ResponseUtil(200, "RoomType Updated Successfully", null);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseUtil(500, "Error updating RoomType: " + e.getMessage(), null);
        }
    }

}

