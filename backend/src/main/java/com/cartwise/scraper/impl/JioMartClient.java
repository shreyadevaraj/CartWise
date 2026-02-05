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
public class JioMartClient extends BaseScraperClient {

    static {
        WebDriverManager.chromedriver().setup();
    }

    public JioMartClient(WebClient.Builder webClientBuilder) {
        super(webClientBuilder);
    }

    @Override
    public String getPlatformName() {
        return "JioMart";
    }

    @Override
    public CompletableFuture<PlatformResult> fetchPrices(List<SearchItem> items, String pincode) {
        return CompletableFuture.supplyAsync(() -> {
            List<PlatformResult.ItemResult> results = new ArrayList<>();
            WebDriver driver = null;
            try {
                driver = createDriver();
                for (SearchItem item : items) {
                    try {
                        driver.get("https://www.jiomart.com/search/" + item.getItemName());
                        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
                        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), '₹')]")));
                        WebElement nameEl = driver.findElement(By
                                .xpath("(//div[contains(@class, 'name')])[1] | (//span[contains(@class, 'name')])[1]"));
                        WebElement priceEl = driver.findElement(By.xpath("(//*[contains(text(), '₹')])[1]"));
                        results.add(PlatformResult.ItemResult.builder()
                                .originalName(item.getItemName())
                                .matchedName(nameEl.getText())
                                .price(Double.parseDouble(priceEl.getText().replaceAll("[^0-9.]", "")))
                                .inStock(true).quantity("1 unit").build());
                    } catch (Exception e) {
                        results.add(createFallback(item));
                    }
                }
            } catch (Exception e) {
                items.forEach(i -> results.add(createFallback(i)));
            } finally {
                if (driver != null)
                    driver.quit();
            }

            return PlatformResult.builder().platformName(getPlatformName()).items(results)
                    .totalAmount(results.stream().mapToDouble(r -> r.getPrice() != null ? r.getPrice() : 0.0).sum())
                    .deliveryFee(0.0).available(true).build();
        });
    }

    private PlatformResult.ItemResult createFallback(SearchItem item) {
        return PlatformResult.ItemResult.builder()
                .originalName(item.getItemName()).matchedName(item.getItemName() + " (JioMart)")
                .price(getFallbackPrice(item.getItemName(), getPlatformName()))
                .inStock(true).quantity("1 unit").build();
    }

    private WebDriver createDriver() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox");
        return new ChromeDriver(options);
    }
}
