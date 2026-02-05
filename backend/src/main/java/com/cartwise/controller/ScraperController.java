package com.cartwise.controller;

import com.cartwise.dto.PlatformResult;
import com.cartwise.model.SearchItem;
import com.cartwise.service.PriceAggregatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scraper")
@RequiredArgsConstructor
public class ScraperController {

    private final PriceAggregatorService service;

    @PostMapping("/compare")
    public List<PlatformResult> comparePrices(
            @RequestParam String pincode,
            @RequestBody List<SearchItem> items) {
        return service.comparePrices(items, pincode);
    }
}
