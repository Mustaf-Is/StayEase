package com.example.stayease.services;
import com.example.stayease.models.Ads;
import com.example.stayease.repositories.AdRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Ads getAdById(int id) {
        return adRepository.findAdById(id).orElse(null);
    }
    public Ads createAd(Ads ad) {
        return adRepository.saveAd(ad);
    }
    public Ads updateAd(int id, Ads ad) {
        Ads existingAd = adRepository.findAdById(id).orElse(null);
        if (existingAd != null) {
            existingAd.setTitle(ad.getTitle());
            existingAd.setDescription(ad.getDescription());
            existingAd.setPubDate(ad.getPubDate());
            existingAd.setType(ad.getType());
            existingAd.setPrice(ad.getPrice());
        }
        return existingAd != null ? adRepository.updateAd(existingAd) : null;
    }
    public void deleteAd(int id) {
        adRepository.deleteAdById(id);
    }
}
