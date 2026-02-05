package com.cartwise.repository;

import com.cartwise.model.SearchItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchItemRepository extends JpaRepository<SearchItem, Long> {
}
