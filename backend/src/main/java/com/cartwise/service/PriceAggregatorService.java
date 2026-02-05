package com.cartwise.service;

import com.cartwise.dto.PlatformResult;
import com.cartwise.model.SearchItem;
import com.cartwise.scraper.PlatformClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PriceAggregatorService {

        private final List<PlatformClient> platformClients;

        @Cacheable(value = "price_results", key = "{#pincode, #items.hashCode()}")
        public List<PlatformResult> comparePrices(List<SearchItem> items, String pincode) {
                log.info("Starting comparison with {} platforms for pincode: {}", platformClients.size(), pincode);

                List<CompletableFuture<PlatformResult>> futures = platformClients.stream()
                                .map(client -> client.fetchPrices(items, pincode)
                                                .orTimeout(90000, java.util.concurrent.TimeUnit.MILLISECONDS)
                                                // timeout
                                                // for
                                                // Selenium
                                                // timeout
                                                .exceptionally(ex -> PlatformResult.builder()
                                                                .platformName(client.getPlatformName())
                                                                .errorMessage("Timeout or Error: " + ex.getMessage())
                                                                .available(false)
                                                                .build()))
                                .collect(Collectors.toList());

                List<PlatformResult> results = futures.stream()
                                .map(CompletableFuture::join)
                                .collect(Collectors.toList());

                // Sort by total amount ascending, handling availability
                return results.stream()
                                .sorted(Comparator.comparingDouble(
                                                r -> r.isAvailable() ? r.getTotalAmount() : Double.MAX_VALUE))
                                .collect(Collectors.toList());
        }
}
