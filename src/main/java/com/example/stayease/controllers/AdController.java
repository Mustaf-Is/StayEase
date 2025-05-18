package com.example.stayease.controllers;

import com.example.stayease.DTOs.AdRequestDTO;
import com.example.stayease.DTOs.AdResponseDTO;
import com.example.stayease.DTOs.AdWithAddressResponseDTO;
import com.example.stayease.models.Address;
import com.example.stayease.models.Ads;
import com.example.stayease.models.User;
import com.example.stayease.models.Image;
import com.example.stayease.repositories.UserRepository;
import com.example.stayease.services.AdService;
import com.example.stayease.services.AddressService;
import com.example.stayease.services.ImageService;
import com.example.stayease.services.UploadService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RestController
@RequestMapping("/api/ads")
public class AdController {
    private final AdService adService;
    private final UserRepository userRepository;
    private final AddressService addressService;
    private final ImageService imageService;
    private final UploadService uploadService;

    @Autowired
    public AdController(AdService adService, UserRepository userRepository, AddressService addressService, ImageService imageService, UploadService uploadService) {
        this.adService = adService;
        this.userRepository = userRepository;
        this.addressService = addressService;
        this.imageService = imageService;
        this.uploadService = uploadService;
    }

    @GetMapping
    public ResponseEntity<List<AdWithAddressResponseDTO>> getAllAds() {
        List<Ads> ads = adService.getAllAds();

        List<AdWithAddressResponseDTO> responseDTOs = ads.stream()
                .map(ad -> {
                    // Get address for this specific ad
                    Address address = addressService.getAddressById(ad.getId());

                    // Get image URLs for this specific ad
                    List<String> imageUrls = imageService.getImageUrlsByAdId(ad.getId());

                    // Create and return the DTO with all information
                    return new AdWithAddressResponseDTO(
                            ad.getId(),
                            ad.getTitle(),
                            ad.getDescription(),
                            ad.getPubDate(),
                            ad.getType(),
                            ad.getPricePerDay(),
                            ad.getPricePerWeek(),
                            ad.getPricePerMonth(),
                            address.getStreet(),
                            address.getCity(),
                            address.getZipcode(),
                            imageUrls,
                            ad.getUser().getId()
                    );
                })
                .collect(Collectors.toList());

        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AdWithAddressResponseDTO>> getAdsByUser(@PathVariable int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Ads> ads = adService.getAdsByUser(user);
        List<AdWithAddressResponseDTO> responseDTOs = ads.stream()
                .map(ad -> {
                    // Get address for this specific ad
                    Address address = addressService.getAddressById(ad.getId());

                    // Get image URLs for this specific ad
                    List<String> imageUrls = imageService.getImageUrlsByAdId(ad.getId());

                    // Create and return the DTO with all information
                    return new AdWithAddressResponseDTO(
                            ad.getId(),
                            ad.getTitle(),
                            ad.getDescription(),
                            ad.getPubDate(),
                            ad.getType(),
                            ad.getPricePerDay(),
                            ad.getPricePerWeek(),
                            ad.getPricePerMonth(),
                            address.getStreet(),
                            address.getCity(),
                            address.getZipcode(),
                            imageUrls,
                            ad.getUser().getId()
                    );
                })
                .collect(Collectors.toList());

        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);

    }
    @GetMapping("/{id}")
    public ResponseEntity<AdWithAddressResponseDTO> getAdById(@PathVariable int id) {
        Ads ad = adService.getAdById(id);
        Address address = addressService.getAddressById(ad.getId());
        List<String> imageUrls = imageService.getImageUrlsByAdId(ad.getId());
        AdWithAddressResponseDTO adWithAddressResponseDTO = new AdWithAddressResponseDTO(
                ad.getId(),
                ad.getTitle(),
                ad.getDescription(),
                ad.getPubDate(),
                ad.getType(),
                ad.getPricePerDay(),
                ad.getPricePerWeek(),
                ad.getPricePerMonth(),
                address.getStreet(),
                address.getCity(),
                address.getZipcode(),
                imageUrls,
                ad.getUser().getId()
        );
        if (ad == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(adWithAddressResponseDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AdWithAddressResponseDTO> createAd(@RequestBody AdRequestDTO request) {
        Ads ad = request.ad();
        Address address =request.address();
        List<String> imagesUrl = request.imageUrls();
        Integer userId = request.userId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Ads createdAd = adService.createAd(ad, user);
        Integer adId = createdAd.getId();
        Address savedAdAddress = addressService.saveAddress(address, adId);

        if (imagesUrl != null && !imagesUrl.isEmpty()) {
            for (String url : imagesUrl) {
                Image savedImage = imageService.saveImage(url, adId);
            }
        }

        AdWithAddressResponseDTO responseDTO = new AdWithAddressResponseDTO(
                createdAd.getId(),
                createdAd.getTitle(),
                createdAd.getDescription(),
                createdAd.getPubDate(),
                createdAd.getType(),
                createdAd.getPricePerDay(),
                createdAd.getPricePerWeek(),
                createdAd.getPricePerMonth(),
                savedAdAddress.getStreet(),
                savedAdAddress.getCity(),
                savedAdAddress.getZipcode(),
                imagesUrl,
                createdAd.getUser().getId()
                );

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdResponseDTO> updateAd(@PathVariable int id, @RequestBody Ads ad) {
        Ads updatedAd = adService.updateAd(id, ad);
        AdResponseDTO responseDTO = new AdResponseDTO(
                updatedAd.getId(),
                updatedAd.getTitle(),
                updatedAd.getDescription(),
                updatedAd.getPubDate(),
                updatedAd.getType(),
                updatedAd.getPricePerDay(),
                updatedAd.getPricePerWeek(),
                updatedAd.getPricePerMonth(),
                updatedAd.getUser().getId()
        );
        if (updatedAd == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAd(@PathVariable int id) {
        Ads ad = adService.getAdById(id);
        if(ad == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        addressService.deleteAddress(id);
        adService.deleteAd(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
