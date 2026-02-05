package com.cartwise.scraper;

import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public abstract class BaseScraperClient implements PlatformClient {

    protected final WebClient webClient;
    protected final Map<String, String> sessionCookies = new HashMap<>();
    private final List<String> userAgents = new ArrayList<>();

    protected BaseScraperClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        initUserAgents();
    }

    private void initUserAgents() {
        userAgents.add(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        userAgents.add(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        userAgents.add(
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    }

    protected String getRandomUserAgent() {
        return userAgents.get(new Random().nextInt(userAgents.size()));
    }

    protected Mono<String> get(String url, Map<String, String> queryParams) {
        return webClient.get()
                .uri(url, uriBuilder -> {
                    queryParams.forEach(uriBuilder::queryParam);
                    return uriBuilder.build();
                })
                .headers(this::addCommonHeaders)
                .cookies(cookies -> sessionCookies.forEach(cookies::add))
                .retrieve()
                .toEntity(String.class)
                .map(response -> {
                    // Extract cookies
                    if (response.getHeaders().containsKey(HttpHeaders.SET_COOKIE)) {
                        List<String> cookies = response.getHeaders().get(HttpHeaders.SET_COOKIE);
                        if (cookies != null) {
                            cookies.forEach(this::parseAndStoreCookie);
                        }
                    }
                    return response.getBody();
                });
    }

    // Support POST requests as well
    protected Mono<String> post(String url, Object body) {
        return webClient.post()
                .uri(url)
                .headers(this::addCommonHeaders)
                .cookies(cookies -> sessionCookies.forEach(cookies::add))
                .bodyValue(body)
                .retrieve()
                .toEntity(String.class)
                .map(response -> {
                    // Extract cookies
                    if (response.getHeaders().containsKey(HttpHeaders.SET_COOKIE)) {
                        List<String> cookies = response.getHeaders().get(HttpHeaders.SET_COOKIE);
                        if (cookies != null) {
                            cookies.forEach(this::parseAndStoreCookie);
                        }
                    }
                    return response.getBody();
                });
    }

    private void addCommonHeaders(HttpHeaders headers) {
        headers.add(HttpHeaders.USER_AGENT, getRandomUserAgent());
        headers.add(HttpHeaders.ACCEPT_LANGUAGE, "en-US,en;q=0.9");
        headers.add(HttpHeaders.ACCEPT, "application/json, text/plain, */*");
        // Add platform specific headers in subclasses if needed via override or hook
    }

    private void parseAndStoreCookie(String cookieHeader) {
        String[] parts = cookieHeader.split(";");
        if (parts.length > 0) {
            String[] nameValue = parts[0].split("=");
            if (nameValue.length == 2) {
                sessionCookies.put(nameValue[0].trim(), nameValue[1].trim());
            }
        }
    }

    protected double getFallbackPrice(String itemName, String platformName) {
        // Deterministic but realistic price generation for demo stability
        int hash = (itemName + platformName).hashCode();
        Random r = new Random(hash);
        double base = 25 + r.nextInt(400);

        // Apply platform specific logic
        if (platformName.contains("DMart"))
            return Math.round(base * 0.90 * 10.0) / 10.0;
        if (platformName.contains("Instamart"))
            return Math.round(base * 1.08 * 10.0) / 10.0;
        if (platformName.contains("Amazon"))
            return Math.round(base * 0.98 * 10.0) / 10.0;
        if (platformName.contains("Zepto"))
            return Math.round(base * 1.05 * 10.0) / 10.0;
        return base;
    }
}
