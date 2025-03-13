package lk.ijse.back_end.exception;

public class ImageExtractionFailedException extends RuntimeException {
    public ImageExtractionFailedException(String imageId) {
        super("Failed to extract image with id: " + imageId);
    }
}
