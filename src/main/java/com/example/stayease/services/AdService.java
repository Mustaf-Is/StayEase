package com.example.stayease.services;
import com.example.stayease.models.Ads;
import com.example.stayease.models.User;
import com.example.stayease.repositories.AdRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class AdService {
    private final AdRepository adRepository;
    @Autowired
    public AdService(AdRepository adRepository) {
        this.adRepository = adRepository;
    }
    public List<Ads> getAllAds(){
        return adRepository.findAllAds();
    }
    public List<Ads> getAdsByUser(User user) {
        return adRepository.findAllAdsPerUser(user.getId());
    }
    public Ads getAdById(int id) {
        return adRepository.findAdById(id).orElse(null);
    }
    public Ads createAd(Ads ad, User user) {
        return adRepository.saveAd(
                ad.getTitle(),
                ad.getDescription(),
                ad.getPubDate(),
                ad.getType(),
                ad.getPricePerDay(),
                ad.getPricePerWeek(),
                ad.getPricePerMonth(),
                user.getId());
    }
    public Ads updateAd(int id, Ads ad) {
        Ads existingAd = adRepository.findAdById(id).orElse(null);
        if (existingAd != null) {
            existingAd.setTitle(ad.getTitle());
            existingAd.setDescription(ad.getDescription());
            existingAd.setPubDate(ad.getPubDate());
            existingAd.setType(ad.getType());
            existingAd.setPricePerDay(ad.getPricePerDay());
            existingAd.setPricePerWeek(ad.getPricePerWeek());
            existingAd.setPricePerMonth(ad.getPricePerMonth());
        }
        return existingAd != null ? adRepository.updateAd(existingAd) : null;
    }

    @Transactional
    public void deleteAd(int id) {
        adRepository.deleteAdById(id);
    }
}
