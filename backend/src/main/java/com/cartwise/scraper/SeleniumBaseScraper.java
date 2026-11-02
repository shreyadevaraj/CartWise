package com.cartwise.scraper;

import com.cartwise.dto.PlatformResult;
import com.cartwise.model.SearchItem;
import com.cartwise.service.SeleniumService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RequiredArgsConstructor
public abstract class SeleniumBaseScraper implements PlatformClient {

    protected final SeleniumService seleniumService;

    protected abstract String getBaseUrl();

    protected abstract void setLocation(WebDriver driver, WebDriverWait wait, String pincode);

    protected abstract double extractPrice(WebDriver driver, WebDriverWait wait, SearchItem item);

    @Override
    public CompletableFuture<PlatformResult> fetchPrices(List<SearchItem> items, String pincode) {
        return CompletableFuture.supplyAsync(() -> {
            WebDriver driver = null;
            try {
                driver = seleniumService.createDriver();
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

                log.info("[{}] Opening browser...", getPlatformName());
                driver.get(getBaseUrl());

                log.info("[{}] Setting location to {}", getPlatformName(), pincode);
                setLocation(driver, wait, pincode);

                double total = 0;
                boolean anyFound = false;
                List<PlatformResult.ItemResult> results = new ArrayList<>();

                for (SearchItem item : items) {
                    try {
                        log.info("[{}] Searching for {}", getPlatformName(), item.getItemName());
                        double price = extractPrice(driver, wait, item);
                        int count = parseQuantity(item.getQuantity());
                        if (price > 0) {
                            total += price * count;
                            anyFound = true;
                            results.add(PlatformResult.ItemResult.builder()
                                    .originalName(item.getItemName())
                                    .matchedName(item.getItemName())
                                    .price(price * count)
                                    .quantity(String.valueOf(count))
                                    .inStock(true)
                                    .build());
                        } else {
                            results.add(PlatformResult.ItemResult.builder()
                                    .originalName(item.getItemName())
                                    .quantity(String.valueOf(count))
                                    .inStock(false)
                                    .build());
                        }
                    } catch (Exception e) {
                        log.warn("[{}] Failed to extract price for {}: {}", getPlatformName(), item.getItemName(),
                                e.getMessage());
                        results.add(PlatformResult.ItemResult.builder()
                                .originalName(item.getItemName())
                                .inStock(false)
                                .build());
                    }
                }

                return PlatformResult.builder()
                        .platformName(getPlatformName())
                        .totalAmount(total)
                        .available(anyFound)
                        .items(results)
                        .deliveryFee(0.0) // Placeholder
                        .build();

            } catch (Exception e) {
                log.error("[{}] Scraping failed", getPlatformName(), e);
                return PlatformResult.builder()
                        .platformName(getPlatformName())
                        .errorMessage(e.getMessage())
                        .available(false)
                        .build();
            } finally {
                if (driver != null) {
                    driver.quit();
                }
            }
        });
    }

    private int parseQuantity(String quantity) {
        try {
            return Math.max(1, Integer.parseInt(quantity));
        } catch (NumberFormatException e) {
            return 1;
        }
    }

    protected void safeClick(WebDriver driver, By locator) {
        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.elementToBeClickable(locator))
                .click();
    }

    protected void safeSendKeys(WebDriver driver, By locator, String text) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.visibilityOfElementLocated(locator));
        element.clear();
        element.sendKeys(text);
    }
}
