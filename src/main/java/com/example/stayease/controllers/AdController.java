package com.example.stayease.controllers;

import com.example.stayease.models.Ads;
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

    @Autowired
    public AdController(AdService adService) {
        this.adService = adService;
    }

    @GetMapping
    public ResponseEntity<List<Ads>> getAllAds() {
        List<Ads> ads = adService.getAllAds();
        return new ResponseEntity<>(ads, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ads> getAdById(@PathVariable int id) {
        Ads ad = adService.getAdById(id);
        if (ad == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(ad, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Ads> createAd(@RequestBody Ads ad) {
        Ads createdAd = adService.createAd(ad);
        return new ResponseEntity<>(createdAd, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ads> updateAd(@PathVariable int id, @RequestBody Ads ad) {
        Ads updatedAd = adService.updateAd(id, ad);
        if (updatedAd == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedAd, HttpStatus.OK);
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
