package com.my.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SearchRequestDto {
    // 클라이언트에서 주소 검색 요청 시 사용
    private String address;

    // (선택 사항) 거리 필터링에 사용할 기준 거리 (km)
    private Double distance;
}
