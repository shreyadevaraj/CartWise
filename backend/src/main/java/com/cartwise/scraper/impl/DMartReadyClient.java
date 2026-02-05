package com.cartwise.scraper.impl;

import com.cartwise.dto.PlatformResult;
import com.cartwise.model.SearchItem;
import com.cartwise.scraper.BaseScraperClient;
import io.github.bonigarcia.wdm.WebDriverManager;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class DMartReadyClient extends BaseScraperClient {

    private static final String SEARCH_URL_PREFIX = "https://www.dmart.in/search-results?searchTerm=";

    static {
        WebDriverManager.chromedriver().setup();
    }

    public DMartReadyClient(WebClient.Builder webClientBuilder) {
        super(webClientBuilder);
    }

    @Override
    public String getPlatformName() {
        return "DMart Ready";
    }

    @Override
    public CompletableFuture<PlatformResult> fetchPrices(List<SearchItem> items, String pincode) {
        return CompletableFuture.supplyAsync(() -> {
            WebDriver driver = null;
            try {
                driver = createDriver();

                List<PlatformResult.ItemResult> results = new ArrayList<>();
                for (SearchItem item : items) {
                    results.add(scrapeItem(driver, item));
                }

                double total = results.stream()
                        .mapToDouble(r -> r.getPrice() != null ? r.getPrice() : 0.0)
                        .sum();

                return PlatformResult.builder()
                        .platformName(getPlatformName())
                        .items(results)
                        .totalAmount(total)
                        .deliveryFee(0.0)
                        .available(true)
                        .build();

            } catch (Exception e) {
                log.error("DMart scraping failed", e);
                return PlatformResult.builder()
                        .platformName(getPlatformName())
                        .available(false)
                        .errorMessage("Could not reach DMart servers")
                        .build();
            } finally {
                if (driver != null) {
                    driver.quit();
                }
            }
        });
    }

    private WebDriver createDriver() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments(
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
        return new ChromeDriver(options);
    }

    private PlatformResult.ItemResult scrapeItem(WebDriver driver, SearchItem item) {
        try {
            driver.get(SEARCH_URL_PREFIX + item.getItemName());
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            wait.until(ExpectedConditions.presenceOfElementLocated(
                    By.xpath("//*[contains(text(), '₹')] | //span[contains(@class, 'dmart-price')]")));

            WebElement nameEl = driver.findElement(By.xpath(
                    "(//div[contains(@class, 'src-client-components-product-cards-brand-vertical-card-___brand-vertical-card-module___title')])[1] | (//div[contains(@class, 'title')])[1]"));
            WebElement priceEl = driver.findElement(By.xpath(
                    "(//span[contains(@class, 'src-client-components-product-cards-brand-vertical-card-___brand-vertical-card-module___dmart-price')])[1] | (//*[contains(text(), '₹')])[1]"));

            String name = nameEl.getText();
            String priceText = priceEl.getText().replaceAll("[^0-9.]", "");
            double price = Double.parseDouble(priceText);

            return PlatformResult.ItemResult.builder()
                    .originalName(item.getItemName())
                    .matchedName(name)
                    .price(price)
                    .inStock(true)
                    .quantity("1 unit")
                    .build();
        } catch (Exception e) {
            return PlatformResult.ItemResult.builder()
                    .originalName(item.getItemName())
                    .inStock(false)
                    .build();
        }
    }
}
