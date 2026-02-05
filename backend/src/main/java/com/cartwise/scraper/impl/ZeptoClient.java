package com.cartwise.scraper.impl;

import com.cartwise.model.SearchItem;
import com.cartwise.scraper.SeleniumBaseScraper;
import com.cartwise.service.SeleniumService;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ZeptoClient extends SeleniumBaseScraper {

    public ZeptoClient(SeleniumService seleniumService) {
        super(seleniumService);
    }

    @Override
    public String getPlatformName() {
        return "Zepto";
    }

    @Override
    protected String getBaseUrl() {
        return "https://zeptonow.com";
    }

    @Override
    protected void setLocation(WebDriver driver, WebDriverWait wait, String pincode) {
        try {
            log.info("Setting location to: {}", pincode);
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));

            // Click on location header (Top Left usually)
            try {
                WebElement locationHeader = wait.until(ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//span[contains(text(), 'Select Location')] | //div[contains(@class, 'location-header')] | //button[contains(@aria-label, 'Select Location')]")));
                locationHeader.click();
            } catch (Exception e) {
                log.debug("Location header not found or already open");
            }

            // Type pincode
            WebElement locationInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//input[@placeholder='Search for area, street name...'] | //input[@type='text']")));

            locationInput.click();
            locationInput.clear();
            locationInput.sendKeys(pincode);

            // Wait for results and click first one
            WebElement firstPrediction = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath(
                            "(//div[contains(@id, 'location-search-item')])[1] | (//div[contains(@class, 'pac-item')])[1] | //div[contains(text(), '"
                                    + pincode + "')]")));

            firstPrediction.click();

            // Handle "Confirm Location" button on the map verification screen
            try {
                WebElement confirmBtn = wait.until(ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[contains(text(), 'Confirm Location')] | //button[contains(text(), 'Confirm')]")));
                confirmBtn.click();
            } catch (Exception e) {
                // Map screen might be skipped or different
            }

            Thread.sleep(2000); // Wait for location to apply

        } catch (Exception e) {
            log.warn("Failed to set location '{}': {}", pincode, e.getMessage());
        }
    }

    @Override
    protected double extractPrice(WebDriver driver, WebDriverWait wait, SearchItem item) {
        try {
            // Click Search Bar
            WebElement searchIcon = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath(
                            "//a[@href='/search'] | //input[@placeholder='Search for products...'] | //div[contains(@class, 'search-bar')]")));
            searchIcon.click();

            // Enter Query
            WebElement searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//input[@type='text']")));
            searchInput.clear();
            searchInput.sendKeys(item.getItemName());

            // Wait for results
            // Zepto usually shows product cards directly in search results

            // Wait for product card with price
            wait.until(ExpectedConditions.or(
                    ExpectedConditions.presenceOfElementLocated(By.xpath("//h4[@data-testid='product-card-price']")), // Example
                                                                                                                      // TestID
                    ExpectedConditions.presenceOfElementLocated(By.xpath("//h5")), // Often product title
                    ExpectedConditions
                            .presenceOfElementLocated(By.xpath("//div[contains(text(), 'No results found')]"))));

            // Extract Name (for validation/logging)
            try {
                WebElement nameEl = driver
                        .findElement(By.xpath("(//h5)[1] | (//div[contains(@data-testid, 'product-card-name')])[1]"));
                log.debug("Found item: {}", nameEl.getText());
            } catch (Exception ignored) {
            }

            // Extract Price
            // Look for the rupee symbol or specific price class
            WebElement priceEl = driver.findElement(By.xpath(
                    "(//h4[contains(@data-testid, 'product-card-price')])[1] | (//h4[contains(text(), '₹')])[1] | (//div[contains(text(), '₹')])[1]"));

            String priceText = priceEl.getText().replaceAll("[^0-9.]", "");
            return Double.parseDouble(priceText);

        } catch (Exception e) {
            log.warn("Could not find item {}: {}", item.getItemName(), e.getMessage());
            return 0.0;
        }
    }
}
