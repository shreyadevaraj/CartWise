package com.cartwise.scraper;

import com.cartwise.dto.PlatformResult;
import com.cartwise.model.SearchItem;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface PlatformClient {
    CompletableFuture<PlatformResult> fetchPrices(List<SearchItem> items, String pincode);

    String getPlatformName();
}
