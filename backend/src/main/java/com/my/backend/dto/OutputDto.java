package com.my.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class OutputDto {
    private String pharmacyName;
    private String pharmacyAddress;
    private String directionURL; // 길안내 URL
    private String roadViewURL; // 로드뷰 URL
    private String distance;
    // ⭐ 추가: 지도 표시를 위해 위도(latitude)와 경도(longitude) 필드 추가
    private double latitude;
    private double longitude;
}
