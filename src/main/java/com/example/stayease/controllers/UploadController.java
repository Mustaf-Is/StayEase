package com.example.stayease.controllers;

import com.example.stayease.models.Image;
import com.example.stayease.services.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    @Autowired
    private UploadService uploadService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadImages(@RequestParam("images") List<MultipartFile> files) {
        try {
            // Validate number of files
            if (files.size() > 20) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Maximum 20 images allowed"
                ));
            }

            // Upload images to the local file system
            List<String> imageUrls = uploadService.uploadImages(files);

            // Return success response with image URLs (file paths)
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageUrls", imageUrls);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error uploading images: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Unexpected error: " + e.getMessage()
            ));
        }
    }
}