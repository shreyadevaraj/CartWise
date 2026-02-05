package com.cartwise.controller;

import com.cartwise.dto.AuthDtos;
import com.cartwise.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthenticationResponse> register(
            @RequestBody AuthDtos.RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthDtos.AuthenticationResponse> authenticate(
            @RequestBody AuthDtos.AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
