package com.cartwise.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String pincode;

    private LocalDateTime searchDate;

    // We can store the aggregated total or result summary here if needed
    private Double totalAmount;

    private String cheapestPlatform;

    @OneToMany(mappedBy = "searchHistory", cascade = CascadeType.ALL)
    private List<SearchItem> items;
}
