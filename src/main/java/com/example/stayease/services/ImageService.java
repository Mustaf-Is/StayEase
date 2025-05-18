package com.example.stayease.services;

import com.example.stayease.models.Ads;
import com.example.stayease.models.Image;
import com.example.stayease.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {
    ImageRepository imageRepository;

    @Autowired
    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public Image saveImage(String url, Integer adId) {
        return imageRepository.saveImage(
                url,
                adId
        );
    }
    public List<String> getImageUrlsByAdId(Integer adId) {
        return imageRepository.urlsPerAd(adId);
    }
}
