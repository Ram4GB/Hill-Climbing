Nếu như chỉ chạy hillclimbing không thì chỉ tìm được những hàng xóm gần kề quá phụ thuộc vào initial value

=> Chạy lại nhiều lần random initial sẽ cải thiện được điểm rơi lúc mà người đó leo núi
=> Nó gọi là Shotgun hill climbing

=======================================================================================================

Show kết quả của hill climbing chỉ chạy 1 lần ??
Show kết quả của shotgun hill climbing ??
Show cả 2 ??

Có cần show thời gian chạy và thời gian kết thúc hay không?
Show những gì?

Tùy bài toán mà exceedTime(tức tại 1 lời giải thì sẽ phải tìm bao nhiêu kết quả lân cận) sẽ khác nhau v thì có cần cấu trúc chung hay là chỉ cần sử dụng mặc định

amountOfRandom(tức là số lần tạo initial solution x rồi chạy hill_climbing) cái này được built trên đầu thuật toán hill thì mình định nghĩa bao nhiêu lần chạy 

=======================================================================================================

## Cấu trúc file trong thư mục data

1. coordinate chứa tọa đọa của bài toán
2. dist chứa khoảng cách từ 1 điểm đến các điểm còn lại ma trận nxn
3. dist_download chứa khoảng cách từ 1 điểm đến các điểm còn lại ma trận nxn được download bởi người dùng
4. tsp file tsp của bài toán. Bắt đầu từ line 6 là dữ liệu xy của bài toán
5. problems.json chứa mảng json tất cả các dữ liệu bài toán chuẩn bị để tính

## Luồng xử lý
### Dữ liệu đầu vào:

Nếu dữ liệu đầu vào là file tsp thì download vào folder tsp. Cấu trúc file có sẵn trong folder. Phải tuân theo

Nếu dữ liệu là file distance (.d.txt) thì download vào folder dist_download. Cấu trúc file có sẵn trong folder. Phải tuân theo

### Chạy chương trình

Gõ lệnh terminal để sử dụng thuật toán shotgun hill climbing để chạy tất cả các problem.

Chương trình sẽ đọc file từ folder tsp và dist_download rồi chuyển vào folder dist

Chương trình tiếp tục thực hiện theo thời khóa biểu được định sẵn trong file problems.json

Kết quả sẽ được ghi vào file result. Chúng ta có thể tạo ra được nhiều folder theo từng ngày khác nhau. Nếu như là dữ liệu mới thì sẽ được
tính toán và tạo folder theo ngày và update hoặc là thêm file statistic.json (tổng hợp tất cả các đường đi tốt nhất). Hiện tại dữ liệu sẽ luôn luôn là TODAY. Có thể chỉnh lại trong code

``node main.js``

Nếu chỉ muốn chạy hill climbing thôi thì gõ lệnh

``node resolve_problem_hill_climbing.js``
