package com.example.stayease.controllers;

import com.example.stayease.DTOs.AdRequestDTO;
import com.example.stayease.DTOs.AdResponseDTO;
import com.example.stayease.models.Ads;
import com.example.stayease.models.User;
import com.example.stayease.repositories.UserRepository;
import com.example.stayease.services.AdService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
public class AdController {
    private final AdService adService;
    private final UserRepository userRepository;

    @Autowired
    public AdController(AdService adService, UserRepository userRepository) {
        this.adService = adService;
        this.userRepository = userRepository;
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
                    ad.getPrice(),
                    ad.getUser().getId()
                )).toList();
        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdResponseDTO> getAdById(@PathVariable int id) {
        Ads ad = adService.getAdById(id);
        AdResponseDTO adResponseDTO = new AdResponseDTO(
                ad.getId(),
                ad.getTitle(),
                ad.getDescription(),
                ad.getPubDate(),
                ad.getType(),
                ad.getPrice(),
                ad.getUser().getId()
        );
        if (ad == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(adResponseDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AdResponseDTO> createAd(@RequestBody AdRequestDTO request) {
        Ads ad = request.ad();
        Integer userId = request.userId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Ads createdAd = adService.createAd(ad, user);

        AdResponseDTO responseDTO = new AdResponseDTO(
                createdAd.getId(),
                createdAd.getTitle(),
                createdAd.getDescription(),
                createdAd.getPubDate(),
                createdAd.getType(),
                createdAd.getPrice(),
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
                updatedAd.getPrice(),
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
        adService.deleteAd(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
