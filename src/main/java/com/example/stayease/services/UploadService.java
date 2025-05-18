package com.example.stayease.services;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UploadService {

    @Value("${upload.dir}")
    private String uploadDir;

    @Value("${server.address:localhost}")
    private String serverAddress;

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${server.servlet.context-path:/}")
    private String contextPath;

    public List<String> uploadImages(List<MultipartFile> files) throws IOException {
        List<String> imageURLs = new ArrayList<>();

        // Create the upload directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IOException("Failed to create upload directory");
            }
        }

        // Construct the base URL for the server
        String baseUrl = UriComponentsBuilder.newInstance()
                .scheme("http")
                .host(serverAddress)
                .port(Integer.parseInt(serverPort))
                .path(contextPath)
                .path("/uploads/")
                .toUriString();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IOException("Invalid file format");
            }

            // Generate a unique filename
            String fileName = "property-images/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
            File destination = new File(directory, fileName);

            // Create parent directories if they don't exist (e.g., for "property-images/")
            if (!destination.getParentFile().exists()) {
                destination.getParentFile().mkdirs();
            }

            // Save the file to the local directory
            file.transferTo(destination);

            // Construct the absolute URL
            String absoluteUrl = baseUrl + fileName;
            imageURLs.add(absoluteUrl);
        }
        return imageURLs;
    }
}