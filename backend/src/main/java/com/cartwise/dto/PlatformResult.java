package com.cartwise.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformResult {
    private String platformName;
    private Double totalAmount;
    private List<ItemResult> items;
    private boolean available;
    private String errorMessage;
    private double deliveryFee;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemResult {
        private String originalName; // Input name
        private String matchedName; // Product name from platform
        private Double price;
        private Double originalPrice; // If discounted
        private String quantity; // API quantity
        private String imageUrl;
        private boolean inStock;
    }
}
