package com.example.stayease.services;
import com.example.stayease.repositories.UserRepository;
import com.example.stayease.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public List<User> getAllUsers() {
        return userRepository.findAllUsers();
    }
    public User getUserById(int id) {
        return userRepository.findUserById(id).orElse(null);
    }
    public User createUser(User user) {
        return userRepository.saveUser(user.getFullName(), user.getEmail(), user.getPassword(), user.getRole(), user.getUsername());
    }
    public User updateUser(int id, User user) {
        User existingUser = userRepository.findUserById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setFullName(user.getFullName());
            existingUser.setUsername(user.getUsername());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            existingUser.setRole(user.getRole());
        }
        return existingUser != null ? userRepository.updateUser(existingUser) : null;
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public void deleteUser(int id) {
        userRepository.deleteUserById(id);
    }
}