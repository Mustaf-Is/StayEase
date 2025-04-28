package com.example.stayease.controllers;

import com.example.stayease.DTOs.AdRequestDTO;
import com.example.stayease.DTOs.AdResponseDTO;
import com.example.stayease.DTOs.AdWithAddressResponseDTO;
import com.example.stayease.models.Address;
import com.example.stayease.models.Ads;
import com.example.stayease.models.User;
import com.example.stayease.repositories.UserRepository;
import com.example.stayease.services.AdService;
import com.example.stayease.services.AddressService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
@RestController
@RequestMapping("/api/ads")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = {"Authorization", "Content-Type"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AdController {
    private final AdService adService;
    private final UserRepository userRepository;
    private final AddressService addressService;

    @Autowired
    public AdController(AdService adService, UserRepository userRepository, AddressService addressService) {
        this.adService = adService;
        this.userRepository = userRepository;
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AdResponseDTO>> getAllAds() {
        List<Ads> ads = adService.getAllAds();
        List<AdResponseDTO> responseDTOs = ads.stream()
                .map(ad -> new AdResponseDTO(
                    ad.getId(),
                    ad.getTitle(),
                    ad.getDescription(),
                    ad.getPubDate(),
                    ad.getType(),
                    ad.getPricePerDay(),
                    ad.getPricePerWeek(),
                    ad.getPricePerMonth(),
                    ad.getUser().getId()
                )).toList();
        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdWithAddressResponseDTO> getAdById(@PathVariable int id) {
        Ads ad = adService.getAdById(id);
        Address address = addressService.getAddressById(ad.getId());
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
        Integer userId = request.userId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Ads createdAd = adService.createAd(ad, user);
        Integer adId = createdAd.getId();
        Address savedAdAddress = addressService.saveAddress(address, adId);

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
