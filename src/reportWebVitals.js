// Hàm reportWebVitals để thu thập và báo cáo các số liệu hiệu suất web quan trọng bằng cách sử dụng thư viện web-vitals

const reportWebVitals = onPerfEntry => {                                                //tham số đầu vào onPerfEntry.
  if (onPerfEntry && onPerfEntry instanceof Function) {                               //nếu onPerfEntry tồn tại và là một hàm
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {      //Hàm import được sử dụng để tải động thư viện web-vitals. Khi thư viện này được tải thành công, nó sẽ trả về một đối tượng chứa các hàm getCLS, getFID, getFCP, getLCP, và getTTFB.
      getCLS(onPerfEntry);                //Thu thập Cumulative Layout Shift (CLS) - đo lường độ ổn định của bố cục.
      getFID(onPerfEntry);                //Thu thập First Input Delay (FID) - đo lường thời gian phản hồi từ người dùng.
      getFCP(onPerfEntry);                //Thu thập First Contentful Paint (FCP) - đo lường thời gian từ khi người dùng bắt đầu tải trang đến khi nội dung đầu tiên được hiển thị.
      getLCP(onPerfEntry);                //Thu thập Largest Contentful Paint (LCP) - đo lường thời gian từ khi người dùng bắt đầu tải trang đến khi phần tử lớn nhất trong viewport được hiển thị.
      getTTFB(onPerfEntry);               //Thu thập Time to First Byte (TTFB) - đo lường thời gian từ khi người dùng yêu cầu một tài nguyên đến khi byte đầu tiên của tài nguyên đó được nhận.
    });
  }
};

export default reportWebVitals;
