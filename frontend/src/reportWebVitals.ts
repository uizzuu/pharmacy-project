export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then((wv) => {
      // 최신 web-vitals 모듈에서는 개별 함수 가져오기
      wv.getCLS(onPerfEntry);
      wv.getFID(onPerfEntry);
      wv.getFCP(onPerfEntry);
      wv.getLCP(onPerfEntry);
      wv.getTTFB(onPerfEntry);
    });
  }
}
