package com.example.stayease.services;

import com.example.stayease.models.Address;
import com.example.stayease.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }
    public Address createAddress(String street, String city, String zipcode, Integer adId) {
        return addressRepository.saveAddress(
                street,
                city,
                zipcode,
                adId
        );
    }
    public void deleteAddress(Integer adId) {
        addressRepository.deleteAddressByAdId(adId);
    }
    public Address getAddressById(Integer adId) {
        return addressRepository.findAddressByAdId(adId).orElse(null);
    }
}
