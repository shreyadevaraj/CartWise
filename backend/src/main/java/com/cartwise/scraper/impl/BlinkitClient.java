package com.cartwise.scraper.impl;

import com.cartwise.dto.PlatformResult;
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
public class BlinkitClient extends SeleniumBaseScraper {

    public BlinkitClient(SeleniumService seleniumService) {
        super(seleniumService);
    }

    @Override
    public String getPlatformName() {
        return "Blinkit";
    }

    @Override
    protected String getBaseUrl() {
        return "https://blinkit.com";
    }

    @Override
    protected void setLocation(WebDriver driver, WebDriverWait wait, String pincode) {
        try {
            log.info("Setting location to: {}", pincode);
            // Wait for home page to load
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));

            // Click on location header/button
            // Selector strategy: Look for 'Delivery in' text or common location icon
            // patterns
            try {
                WebElement locationBtn = wait.until(ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//div[contains(@class, 'LocationHeader') ] | //button[contains(text(), 'Delivery in')] | //div[contains(text(), 'Delivery in')]")));
                locationBtn.click();
            } catch (Exception e) {
                log.info(
                        "Could not find location header, maybe location modal is already open or checking for 'detect location' prompt");
            }

            // Wait for location search input
            WebElement searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//input[@placeholder='Search for area, street name..'] | //input[@type='text']")));

            searchInput.click();
            searchInput.clear();
            searchInput.sendKeys(pincode);

            // Wait for results
            // Usually a list of addresses. We pick the first one that appears.
            WebElement firstResult = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath(
                            "(//div[contains(@class, 'LocationSearchList')]//div)[1] | (//div[contains(@class, 'pac-item')])[1] | //div[contains(text(), '"
                                    + pincode + "')]")));

            firstResult.click();

            // Handle potential 'Confirm Location' map view if it appears
            // It might ask to "Confirm Location" on a map.
            try {
                WebElement confirmBtn = wait.until(ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[contains(text(), 'Confirm Location')] | //button[contains(text(), 'Confirm & Proceed')]")));
                confirmBtn.click();
            } catch (Exception e) {
                // Map confirmation might not always appear
            }

            // Give it a moment to settle
            Thread.sleep(2000);

        } catch (Exception e) {
            log.warn("Failed to set location '{}': {}", pincode, e.getMessage());
            // Proceed anyway, maybe default location works
        }
    }

    @Override
    protected double extractPrice(WebDriver driver, WebDriverWait wait, SearchItem item) {
        // Search for the item
        try {
            WebElement searchBar = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath(
                            "//input[contains(@placeholder, 'Search')] | //div[contains(@class, 'SearchBar')]//input")));
            searchBar.click();

            // Re-find in case DOM updated
            WebElement activeSearchBar = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//input[contains(@placeholder, 'Search')]")));
            activeSearchBar.clear();
            activeSearchBar.sendKeys(item.getItemName());

            // Wait for results/suggestions or hit enter?
            // Blinkit usually searches as you type or you can hit enter (not really, it's a
            // dedicated search page often)
            // But let's try hitting enter just in case
            // activeSearchBar.sendKeys(Keys.ENTER);

            // Wait for product cards
            // Blinkit product cards usually have a class like 'Product__UpdatedTitle'

            // Wait for at least one result
            wait.until(ExpectedConditions.or(
                    ExpectedConditions
                            .presenceOfElementLocated(By.xpath("//div[contains(@class, 'Product__UpdatedTitle')]")),
                    ExpectedConditions
                            .presenceOfElementLocated(By.xpath("//div[contains(text(), 'No results found')]"))));

            // Find the best match
            // For simplicity, we take the first price found in a product card
            WebElement priceElement = driver.findElement(By.xpath("(//div[contains(text(), '₹')])[1]"));

            String priceText = priceElement.getText().replace("₹", "").trim();
            return Double.parseDouble(priceText);

        } catch (Exception e) {
            log.warn("Could not find item {}: {}", item.getItemName(), e.getMessage());
            return 0.0;
        }
    }
}
