import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const BOOKS = [
  // 5–7 tuổi (25 books)
  {id:1,title:"Truyện Cổ Tích Andersen",author:"H.C. Andersen",age:"5-7",cat:"Văn học",desc:"Tập truyện cổ tích nổi tiếng thế giới"},
  {id:2,title:"Truyện Cổ Grimm",author:"Anh Em Grimm",age:"5-7",cat:"Văn học",desc:"Kho tàng truyện cổ tích Đức"},
  {id:3,title:"Ngụ Ngôn Aesop",author:"Aesop",age:"5-7",cat:"Văn học",desc:"Truyện ngụ ngôn giáo dục đạo đức"},
  {id:4,title:"Cô Bé Quàng Khăn Đỏ",author:"Truyện cổ tích",age:"5-7",cat:"Văn học",desc:"Bài học về sự cẩn thận và tin tưởng"},
  {id:5,title:"Ba Chú Heo Con",author:"Truyện cổ tích",age:"5-7",cat:"Văn học",desc:"Bài học về sự chăm chỉ"},
  {id:6,title:"Nàng Bạch Tuyết",author:"Anh Em Grimm",age:"5-7",cat:"Văn học",desc:"Câu chuyện về lòng tốt và cái đẹp"},
  {id:7,title:"Cô Bé Lọ Lem",author:"Charles Perrault",age:"5-7",cat:"Văn học",desc:"Câu chuyện về sự kiên nhẫn và nhân hậu"},
  {id:8,title:"Công Chúa Ngủ Trong Rừng",author:"Anh Em Grimm",age:"5-7",cat:"Văn học",desc:"Truyện cổ tích về tình yêu chân thành"},
  {id:9,title:"Chuyện Con Mèo Dạy Hải Âu Bay",author:"Luis Sepúlveda",age:"5-7",cat:"Văn học",desc:"Tình yêu thương và trách nhiệm"},
  {id:10,title:"Gấu Pooh",author:"A.A. Milne",age:"5-7",cat:"Văn học",desc:"Những cuộc phiêu lưu của gấu Pooh"},
  {id:11,title:"Nhóc Nicolas",author:"René Goscinny",age:"5-7",cat:"Văn học",desc:"Chuyện vui của cậu bé Nicolas"},
  {id:12,title:"Chú Sâu Háu Ăn",author:"Eric Carle",age:"5-7",cat:"Khoa học",desc:"Sách tranh về vòng đời của bướm"},
  {id:13,title:"Cáo Thỏ Và Gà Trống",author:"Truyện dân gian",age:"5-7",cat:"Văn học",desc:"Truyện dân gian thú vị"},
  {id:14,title:"Ehon Nhật Bản",author:"Nhiều tác giả",age:"5-7",cat:"Kỹ năng",desc:"Sách tranh Nhật Bản giáo dục cảm xúc"},
  {id:15,title:"Tớ Là Ai?",author:"Nhiều tác giả",age:"5-7",cat:"Kỹ năng",desc:"Khám phá bản thân cho trẻ nhỏ"},
  {id:16,title:"Cảm Xúc Của Tớ",author:"Nhiều tác giả",age:"5-7",cat:"Kỹ năng",desc:"Nhận biết và quản lý cảm xúc"},
  {id:17,title:"Mỗi Ngày Một Câu Chuyện Hay",author:"Nhiều tác giả",age:"5-7",cat:"Văn học",desc:"Tuyển tập truyện ngắn cho trẻ"},
  {id:18,title:"100 Câu Hỏi Vì Sao Đầu Tiên",author:"Nhiều tác giả",age:"5-7",cat:"Khoa học",desc:"Giải đáp thắc mắc của trẻ về thế giới"},
  {id:19,title:"Sách Bóc Dán Thông Minh",author:"Nhiều tác giả",age:"5-7",cat:"Kỹ năng",desc:"Phát triển tư duy qua hoạt động"},
  {id:20,title:"Tư Duy Logic Cho Trẻ 5+",author:"Nhiều tác giả",age:"5-7",cat:"Kỹ năng",desc:"Rèn tư duy logic từ sớm"},
  {id:21,title:"Trò Chơi Trí Tuệ",author:"Nhiều tác giả",age:"5-7",cat:"Kỹ năng",desc:"Phát triển trí thông minh qua trò chơi"},
  {id:22,title:"Tập Kể Chuyện",author:"Nhiều tác giả",age:"5-7",cat:"Kỹ năng",desc:"Phát triển kỹ năng ngôn ngữ"},
  {id:23,title:"Tuyển Tập Thơ Thiếu Nhi VN",author:"Nhiều tác giả",age:"5-7",cat:"Văn học",desc:"Thơ hay dành cho thiếu nhi Việt Nam"},
  {id:24,title:"Thơ Trần Đăng Khoa",author:"Trần Đăng Khoa",age:"5-7",cat:"Văn học",desc:"Thơ của thần đồng thơ Việt Nam"},
  {id:25,title:"Pinocchio",author:"Carlo Collodi",age:"5-7",cat:"Văn học",desc:"Câu chuyện về sự thật thà"},

  // 8–10 tuổi (25 books)
  {id:26,title:"Dế Mèn Phiêu Lưu Ký",author:"Tô Hoài",age:"8-10",cat:"Văn học",desc:"Kiệt tác văn học thiếu nhi Việt Nam"},
  {id:27,title:"Charlie Và Nhà Máy Sô-cô-la",author:"Roald Dahl",age:"8-10",cat:"Phiêu lưu",desc:"Cuộc phiêu lưu kỳ diệu trong nhà máy kẹo"},
  {id:28,title:"Alice Ở Xứ Sở Diệu Kỳ",author:"Lewis Carroll",age:"8-10",cat:"Phiêu lưu",desc:"Hành trình kỳ ảo của cô bé Alice"},
  {id:29,title:"Hoàng Tử Bé",author:"A. de Saint-Exupéry",age:"8-10",cat:"Văn học",desc:"Triết lý cuộc sống qua góc nhìn trẻ thơ"},
  {id:30,title:"Peter Pan",author:"J.M. Barrie",age:"8-10",cat:"Phiêu lưu",desc:"Cậu bé không bao giờ lớn"},
  {id:31,title:"Cậu Bé Rừng Xanh",author:"Rudyard Kipling",age:"8-10",cat:"Phiêu lưu",desc:"Mowgli lớn lên giữa đàn sói"},
  {id:32,title:"Heidi — Cô Bé Trên Núi",author:"Johanna Spyri",age:"8-10",cat:"Văn học",desc:"Cuộc sống trong lành trên núi Alps"},
  {id:33,title:"Hai Vạn Dặm Dưới Đáy Biển",author:"Jules Verne",age:"8-10",cat:"Khoa học",desc:"Phiêu lưu khoa học viễn tưởng"},
  {id:34,title:"80 Ngày Vòng Quanh Thế Giới",author:"Jules Verne",age:"8-10",cat:"Phiêu lưu",desc:"Cuộc phiêu lưu vòng quanh thế giới"},
  {id:35,title:"Robinson Crusoe",author:"Daniel Defoe",age:"8-10",cat:"Phiêu lưu",desc:"Bài học về sự tự lập và sinh tồn"},
  {id:36,title:"Gulliver Du Ký",author:"Jonathan Swift",age:"8-10",cat:"Phiêu lưu",desc:"Hành trình đến các vùng đất kỳ lạ"},
  {id:37,title:"Nhật Ký Chú Bé Nhút Nhát",author:"Nhiều tác giả",age:"8-10",cat:"Văn học",desc:"Câu chuyện hài hước về học đường"},
  {id:38,title:"Diary of a Wimpy Kid",author:"Jeff Kinney",age:"8-10",cat:"Văn học",desc:"Nhật ký học sinh vô cùng hài hước"},
  {id:39,title:"Bách Khoa Tri Thức Trẻ Em",author:"Nhiều tác giả",age:"8-10",cat:"Khoa học",desc:"Kiến thức tổng hợp nhiều lĩnh vực"},
  {id:40,title:"Why? — Khoa Học Kỳ Thú",author:"Nhiều tác giả",age:"8-10",cat:"Khoa học",desc:"Giải thích hiện tượng khoa học thú vị"},
  {id:41,title:"10 Vạn Câu Hỏi Vì Sao",author:"Nhiều tác giả",age:"8-10",cat:"Khoa học",desc:"Giải đáp mọi thắc mắc về tự nhiên"},
  {id:42,title:"Cơ Thể Người",author:"Nhiều tác giả",age:"8-10",cat:"Khoa học",desc:"Khám phá bí ẩn cơ thể con người"},
  {id:43,title:"Khám Phá Vũ Trụ",author:"Nhiều tác giả",age:"8-10",cat:"Khoa học",desc:"Hành trình khám phá không gian"},
  {id:44,title:"7 Thói Quen Của Bạn Trẻ Thành Đạt",author:"Sean Covey",age:"8-10",cat:"Kỹ năng",desc:"Xây dựng thói quen tốt từ nhỏ"},
  {id:45,title:"Kỹ Năng Sống Cơ Bản",author:"Nhiều tác giả",age:"8-10",cat:"Kỹ năng",desc:"Trang bị kỹ năng cần thiết"},
  {id:46,title:"Kính Vạn Hoa",author:"Nguyễn Nhật Ánh",age:"8-10",cat:"Văn học",desc:"Tuyển tập truyện thiếu nhi hay nhất"},
  {id:47,title:"Cho Tôi Xin Một Vé Đi Tuổi Thơ",author:"Nguyễn Nhật Ánh",age:"8-10",cat:"Văn học",desc:"Hành trình trở về tuổi thơ"},
  {id:48,title:"Chuyện Kể Về Thỏ Peter",author:"Beatrix Potter",age:"8-10",cat:"Văn học",desc:"Những cuộc phiêu lưu của thỏ Peter"},
  {id:49,title:"Dạy Con Tự Lập",author:"Nhiều tác giả",age:"8-10",cat:"Kỹ năng",desc:"Hướng dẫn trẻ tự chăm sóc bản thân"},
  {id:50,title:"Câu Chuyện Tuổi Thơ",author:"Nhiều tác giả",age:"8-10",cat:"Văn học",desc:"Ký ức đẹp về tuổi thơ"},

  // 11–15 tuổi (25 books)
  {id:51,title:"Totto-chan Bên Cửa Sổ",author:"Tetsuko Kuroyanagi",age:"11-13",cat:"Văn học",desc:"Ngôi trường đặc biệt và sự tự do"},
  {id:52,title:"Không Gia Đình",author:"Hector Malot",age:"11-13",cat:"Văn học",desc:"Hành trình tìm kiếm gia đình của Rémi"},
  {id:53,title:"Anne Tóc Đỏ Dưới Chái Nhà Xanh",author:"L.M. Montgomery",age:"11-13",cat:"Văn học",desc:"Cô bé Anne lạc quan và yêu đời"},
  {id:54,title:"Khu Vườn Bí Mật",author:"F.H. Burnett",age:"11-13",cat:"Văn học",desc:"Sức mạnh của thiên nhiên và tình bạn"},
  {id:55,title:"Cây Cam Ngọt Của Tôi",author:"J.M. de Vasconcelos",age:"11-13",cat:"Văn học",desc:"Tuổi thơ buồn vui lẫn lộn của Zezé"},
  {id:56,title:"Chiếc Lá Cuối Cùng",author:"O. Henry",age:"11-13",cat:"Văn học",desc:"Tình yêu thương và hy sinh"},
  {id:57,title:"Nhà Giả Kim",author:"Paulo Coelho",age:"11-13",cat:"Kỹ năng",desc:"Hành trình theo đuổi giấc mơ"},
  {id:58,title:"Tuổi Trẻ Đáng Giá Bao Nhiêu",author:"Rosie Nguyễn",age:"11-13",cat:"Kỹ năng",desc:"Định hướng sống cho tuổi trẻ"},
  {id:59,title:"Đắc Nhân Tâm (bản trẻ)",author:"Dale Carnegie",age:"11-13",cat:"Kỹ năng",desc:"Nghệ thuật giao tiếp và ứng xử"},
  {id:60,title:"Hạt Giống Tâm Hồn",author:"Nhiều tác giả",age:"11-13",cat:"Kỹ năng",desc:"Những câu chuyện truyền cảm hứng"},
  {id:61,title:"Harry Potter (Tập 1–3)",author:"J.K. Rowling",age:"11-13",cat:"Phiêu lưu",desc:"Thế giới phép thuật kỳ diệu"},
  {id:62,title:"Biên Niên Sử Narnia",author:"C.S. Lewis",age:"11-13",cat:"Phiêu lưu",desc:"Vùng đất kỳ ảo Narnia"},
  {id:63,title:"Percy Jackson",author:"Rick Riordan",age:"11-13",cat:"Phiêu lưu",desc:"Cuộc phiêu lưu của con trai thần biển"},
  {id:64,title:"Sapiens (bản thiếu niên)",author:"Y.N. Harari",age:"11-13",cat:"Khoa học",desc:"Lịch sử loài người dành cho teen"},
  {id:65,title:"Lược Sử Thế Giới",author:"Nhiều tác giả",age:"11-13",cat:"Khoa học",desc:"Lịch sử thế giới qua các thời đại"},
  {id:66,title:"Danh Nhân Thế Giới",author:"Nhiều tác giả",age:"11-13",cat:"Khoa học",desc:"Những người thay đổi lịch sử"},
  {id:67,title:"Tôi Tài Giỏi Bạn Cũng Thế",author:"Adam Khoo",age:"11-13",cat:"Kỹ năng",desc:"Phương pháp học tập hiệu quả"},
  {id:68,title:"Rèn Luyện Tư Duy Phản Biện",author:"Nhiều tác giả",age:"11-13",cat:"Kỹ năng",desc:"Phát triển khả năng suy luận độc lập"},
  {id:69,title:"Học Cách Học",author:"Nhiều tác giả",age:"11-13",cat:"Kỹ năng",desc:"Phương pháp học tập thông minh"},
  {id:70,title:"Mắt Biếc",author:"Nguyễn Nhật Ánh",age:"11-13",cat:"Văn học",desc:"Tình yêu trong sáng của tuổi học trò"},
  {id:71,title:"Tôi Thấy Hoa Vàng Trên Cỏ Xanh",author:"Nguyễn Nhật Ánh",age:"11-13",cat:"Văn học",desc:"Ký tự tuổi thơ ở miền quê"},
  {id:72,title:"Lá Nằm Trong Lá",author:"Nguyễn Nhật Ánh",age:"11-13",cat:"Văn học",desc:"Truyện ngắn đặc sắc"},
  {id:73,title:"Những Tấm Lòng Cao Cả",author:"E. De Amicis",age:"11-13",cat:"Văn học",desc:"Câu chuyện cảm động về tình người"},
  {id:74,title:"Bí Mật Của Naoko",author:"Nhiều tác giả",age:"11-13",cat:"Văn học",desc:"Câu chuyện về tình bạn và bí mật"},
  {id:75,title:"Câu Chuyện Nghệ Thuật",author:"Nhiều tác giả",age:"11-13",cat:"Văn học",desc:"Giới thiệu về nghệ thuật sáng tạo"},

  // 14–15 tuổi (25 books)
  {id:76,title:"Những Người Khốn Khổ",author:"Victor Hugo",age:"14-15",cat:"Văn học",desc:"Kiệt tác về tình người và công lý"},
  {id:77,title:"Ông Già Và Biển Cả",author:"Ernest Hemingway",age:"14-15",cat:"Văn học",desc:"Ý chí con người trước thiên nhiên"},
  {id:78,title:"Giết Con Chim Nhại",author:"Harper Lee",age:"14-15",cat:"Văn học",desc:"Công lý và phân biệt chủng tộc"},
  {id:79,title:"1984",author:"George Orwell",age:"14-15",cat:"Văn học",desc:"Cảnh báo về chủ nghĩa toàn trị"},
  {id:80,title:"Trại Súc Vật",author:"George Orwell",age:"14-15",cat:"Văn học",desc:"Ngụ ngôn chính trị sâu sắc"},
  {id:81,title:"Nhà Giả Kim",author:"Paulo Coelho",age:"14-15",cat:"Kỹ năng",desc:"Theo đuổi giấc mơ và tìm hiểu bản thân"},
  {id:82,title:"Đời Ngắn Đừng Ngủ Dài",author:"Robin Sharma",age:"14-15",cat:"Kỹ năng",desc:"Sống có mục đích và đam mê"},
  {id:83,title:"Dám Nghĩ Lớn",author:"David Schwartz",age:"14-15",cat:"Kỹ năng",desc:"Tư duy tích cực để thành công"},
  {id:84,title:"Tư Duy Nhanh Và Chậm",author:"Daniel Kahneman",age:"14-15",cat:"Khoa học",desc:"Hai hệ thống tư duy của con người"},
  {id:85,title:"Tuổi 20 — Những Năm Tháng Quyết Định",author:"Meg Jay",age:"14-15",cat:"Kỹ năng",desc:"Định hướng cho thập niên quan trọng nhất"},
  {id:86,title:"Đi Tìm Lẽ Sống",author:"Viktor Frankl",age:"14-15",cat:"Kỹ năng",desc:"Tìm ý nghĩa cuộc sống trong nghịch cảnh"},
  {id:87,title:"Ikigai",author:"Héctor García",age:"14-15",cat:"Kỹ năng",desc:"Bí quyết sống hạnh phúc của người Nhật"},
  {id:88,title:"Súng Vi Trùng Và Thép",author:"Jared Diamond",age:"14-15",cat:"Khoa học",desc:"Vì sao các nền văn minh phát triển khác nhau"},
  {id:89,title:"Lược Sử Thời Gian",author:"Stephen Hawking",age:"14-15",cat:"Khoa học",desc:"Vũ trụ học dành cho mọi người"},
  {id:90,title:"Factfulness",author:"Hans Rosling",age:"14-15",cat:"Khoa học",desc:"Nhìn thế giới bằng dữ liệu chính xác"},
  {id:91,title:"Tuổi Thơ Dữ Dội",author:"Phùng Quán",age:"14-15",cat:"Văn học",desc:"Thiếu niên trong kháng chiến chống Pháp"},
  {id:92,title:"Nỗi Buồn Chiến Tranh",author:"Bảo Ninh",age:"14-15",cat:"Văn học",desc:"Chiến tranh qua góc nhìn người lính"},
  {id:93,title:"Đất Rừng Phương Nam",author:"Đoàn Giỏi",age:"14-15",cat:"Văn học",desc:"Thiên nhiên và con người miền Nam"},
  {id:94,title:"Into the Wild",author:"Jon Krakauer",age:"14-15",cat:"Phiêu lưu",desc:"Hành trình thật về tự do"},
  {id:95,title:"Homo Deus",author:"Y.N. Harari",age:"14-15",cat:"Khoa học",desc:"Tương lai của loài người"},
  {id:96,title:"Chiến Binh Cầu Vồng",author:"Andrea Hirata",age:"14-15",cat:"Văn học",desc:"Ước mơ và nghị lực vượt khó"},
  {id:97,title:"Bắt Trẻ Đồng Xanh",author:"J.D. Salinger",age:"14-15",cat:"Văn học",desc:"Tâm lý thanh thiếu niên đương đại"},
  {id:98,title:"Kafka Bên Bờ Biển",author:"Haruki Murakami",age:"14-15",cat:"Văn học",desc:"Hành trình tìm kiếm bản ngã"},
  {id:99,title:"Tôi Là Bêtô",author:"Nguyễn Nhật Ánh",age:"14-15",cat:"Văn học",desc:"Câu chuyện từ góc nhìn của chú chó"},
  {id:100,title:"Tuổi Trẻ Hoang Dại",author:"Cheryl Strayed",age:"14-15",cat:"Phiêu lưu",desc:"Hành trình chữa lành tâm hồn"}
];

const READABLE_BOOKS = [
  {id: 'r1', title: 'Dế Mèn phiêu lưu ký', author: 'Tô Hoài', content: '<p>Tôi sống độc lập từ thuở bé. Ấy là tục lệ lâu đời trong họ dế chúng tôi. Vả lại, lúc mẹ sinh chúng tôi ra, chúng tôi đông quá, mà chỗ ở thì cứ chật chội dần lên. Bởi vậy, cứ nở ra được ít ngày là mẹ tôi lại đuổi các con đi ở riêng.</p><p>Tôi ra ở riêng, lúc ấy mới là một chàng dế thanh niên cường tráng. Đôi càng tôi mẫm bóng. Những cái vuốt ở chân, ở khoeo cứ cứng dần và nhọn hoắt. Thỉnh thoảng, muốn thử sự lợi hại của những chiếc vuốt, tôi co cẳng lên, đạp phanh phách vào các ngọn cỏ. Những ngọn cỏ gẫy rạp, y như có nhát dao vừa lia qua.</p>'},
  {id: 'r2', title: 'Đất rừng phương Nam', author: 'Đoàn Giỏi', content: '<p>Tháng ba, mùa con ong đi lấy mật. Mùa này, rừng U Minh rực rỡ những bông hoa tràm trắng muốt. Mùi hương hoa tràm thoang thoảng bay trong gió, quyến rũ hàng ngàn bầy ong từ khắp nơi bay về.</p><p>Tía nuôi tôi là một người thợ săn ong lành nghề. Ông biết rõ từng gốc tràm, từng tổ ong trong khu rừng này. Buổi sáng, sương mù giăng mờ mịt trên mặt sông. Chiếc xuồng con của tía nuôi tôi lướt nhẹ trên dòng nước đục ngầu phù sa.</p>'},
  {id: 'r3', title: 'Góc sân và khoảng trời', author: 'Trần Đăng Khoa', content: '<p>Góc sân nho nhỏ mới xây<br>Chiều chiều em đứng nơi này em trông<br>Thấy trời xanh biếc mênh mông<br>Cánh cò trắng muốt lượn vòng lượn quanh...</p><p>Hạt gạo làng ta<br>Có vị phù sa<br>Của sông Kinh Thầy<br>Có hương sen thơm<br>Trong hồ nước đầy<br>Có lời mẹ hát<br>Ngọt bùi đắng cay...</p>'},
  {id: 'r4', title: 'Kính vạn hoa', author: 'Nguyễn Nhật Ánh', content: '<p>Nhỏ Hạnh đẩy gọng kính cận, nghiêm mặt nhìn Quý ròm:<br>- Bài toán này cậu giải sai rồi.<br>Quý ròm giãy nảy:<br>- Sai chỗ nào? Cậu chỉ tao coi!</p><p>Tiểu Long đang nhai nhóp nhép cái bánh mì, xen vào:<br>- Thôi đi hai ông bà tướng, cãi nhau hoài. Có thực mới vực được đạo, ăn miếng bánh mì cho ấm bụng đã.</p>'},
  {id: 'r5', title: 'Cho tôi xin một vé đi tuổi thơ', author: 'Nguyễn Nhật Ánh', content: '<p>Cho tôi xin một vé đi tuổi thơ. Đó là tên một bài hát của nhạc sĩ Robert Rozhdestvensky mà tôi rất thích. Hôm nay tôi kể câu chuyện này không phải để khuyên trẻ em nên nghe lời người lớn, mà để khuyên người lớn hãy hiểu trẻ em hơn.</p><p>Bởi vì, tôi đã từng là một đứa trẻ. Tôi năm nay tám tuổi. Tám tuổi, tức là tôi đã sống trên cõi đời này được hai ngàn chín trăm hai mươi ngày. Một khoảng thời gian không phải là ngắn. Và trong suốt khoảng thời gian đó, tôi đã kịp nhận ra rằng cuộc sống thật là buồn chán.</p>'},
  {id: 'r6', title: 'Hoàng tử bé', author: 'Antoine de Saint-Exupéry', content: '<p>Khi tôi lên sáu tuổi, tôi có đọc được một cuốn sách về rừng nhiệt đới tên là "Những câu chuyện có thật". Trong đó có vẽ một con trăn đang nuốt chửng một con thú dữ.</p><p>Cuốn sách viết: "Trăn nuốt chửng con mồi mà không nhai. Sau đó nó không thể cựa quậy được nữa và ngủ liền sáu tháng để tiêu hóa." Tôi đã suy nghĩ rất nhiều về những cuộc phiêu lưu trong rừng rậm, và đến lượt mình, tôi đã dùng một chiếc bút chì màu vẽ bức tranh đầu tiên của tôi. Bức tranh số 1. Nó trông như thế này: Một chiếc mũ phớt. Nhưng người lớn lại bảo: "Một chiếc mũ thì có gì mà đáng sợ?"</p>'},
  {id: 'r7', title: 'Totto-chan bên cửa sổ', author: 'Tetsuko Kuroyanagi', content: '<p>Totto-chan bị đuổi học ngay từ ngày đầu tiên vào lớp một. Mẹ cô bé đành phải tìm một ngôi trường khác cho con gái mình. Đó là trường Tomoe.</p><p>Ngôi trường này thật kỳ lạ. Lớp học là những toa tàu cũ. Học sinh có thể ngồi ở bất cứ chỗ nào mình thích và học bất cứ môn gì mình muốn. Thầy hiệu trưởng Kobayashi Sosaku là một người tuyệt vời. Thầy luôn lắng nghe Totto-chan nói chuyện hàng giờ đồng hồ mà không hề tỏ ra chán nản. Nhờ có thầy, Totto-chan từ một cô bé "hư" đã trở thành một người tốt.</p>'},
  {id: 'r8', title: 'Không gia đình', author: 'Hector Malot', content: '<p>Tôi là một đứa trẻ bị bỏ rơi. Cho đến năm lên tám tuổi, tôi vẫn tưởng mình có một người mẹ, bởi vì mỗi khi tôi khóc, có một người đàn bà dịu dàng ôm tôi vào lòng dỗ dành, và mỗi khi tôi ngủ, bà lại đắp chăn cho tôi. Người đàn bà đó là má Barberin.</p><p>Chúng tôi sống trong một túp lều nhỏ ở làng Chavanon. Cuộc sống tuy nghèo khó nhưng rất yên bình. Cho đến một ngày, ông Barberin, chồng của má, trở về từ Paris. Ông ta bị tai nạn lao động và trở nên tàn tật, cáu bẳn. Ông ta không muốn nuôi tôi nữa và quyết định bán tôi cho một người hát rong tên là Vitalis.</p>'},
  {id: 'r9', title: 'Những người khốn khổ', author: 'Victor Hugo', content: '<p>Năm 1815, ông Charles-François-Bienvenu Myriel là giám mục thành Digne. Ông là một người nhân từ, luôn giúp đỡ những người nghèo khổ.</p><p>Một buổi tối, có một người đàn ông lạ mặt gõ cửa nhà ông. Đó là Jean Valjean, một người tù khổ sai vừa được trả tự do sau mười chín năm bị giam cầm vì tội ăn cắp một chiếc bánh mì. Đi đến đâu, Jean Valjean cũng bị xua đuổi vì tờ giấy thông hành màu vàng. Chỉ có giám mục Myriel là dang rộng vòng tay đón nhận ông, cho ông ăn uống và chỗ ngủ. Sự nhân từ của giám mục đã làm thay đổi hoàn toàn cuộc đời của Jean Valjean.</p>'},
  {id: 'r10', title: 'Hai vạn dặm dưới đáy biển', author: 'Jules Verne', content: '<p>Năm 1866, một sự kiện kỳ lạ đã xảy ra trên biển. Nhiều tàu thuyền báo cáo đã nhìn thấy một con quái vật biển khổng lồ, di chuyển với tốc độ kinh hồn và thỉnh thoảng lại phun nước cao vút lên trời.</p><p>Giáo sư Pierre Aronnax, một nhà sinh vật học người Pháp, cùng với người hầu cận Conseil và thợ săn cá voi Ned Land, đã tham gia vào một cuộc thám hiểm để truy tìm con quái vật này. Nhưng họ không ngờ rằng, con quái vật đó thực chất là một chiếc tàu ngầm hiện đại mang tên Nautilus, do thuyền trưởng Nemo bí ẩn chỉ huy.</p>'},
  {id: 'r11', title: 'Túp lều bác Tom', author: 'Harriet Beecher Stowe', content: '<p>Ông Shelby là một người chủ nô tốt bụng ở Kentucky. Tuy nhiên, do làm ăn thua lỗ, ông buộc phải bán đi một số nô lệ của mình để trả nợ, trong đó có bác Tom - một người nô lệ trung thành, hiền lành và sùng đạo, cùng với cậu bé Harry - con trai của nàng Eliza.</p><p>Quá đau xót khi phải xa con, Eliza đã ôm Harry bỏ trốn trong đêm đông giá rét. Trong khi đó, bác Tom đành chấp nhận số phận, bị bán cho một tên buôn nô lệ tàn ác tên là Haley, bắt đầu một cuộc hành trình đầy đau khổ và bi kịch.</p>'},
  {id: 'r12', title: 'Những cuộc phiêu lưu của Tom Sawyer', author: 'Mark Twain', content: '<p>- Tom!<br>Không có tiếng trả lời.<br>- Tom!<br>Vẫn không có tiếng trả lời.<br>- Thằng ranh con này biến đi đâu rồi không biết! Tom!</p><p>Dì Polly kéo trễ cặp kính xuống mũi, nhìn quanh căn phòng. Bà hiếm khi nhìn qua tròng kính để tìm một vật nhỏ bé như một thằng bé. Bà đi đến góc phòng, dùng chổi chọc vào gầm giường, nhưng chỉ lôi ra được một con mèo.<br>- Chưa từng thấy đứa nào bướng bỉnh như thằng này!</p>'},
  {id: 'r13', title: 'Alice ở xứ sở thần tiên', author: 'Lewis Carroll', content: '<p>Alice đang bắt đầu cảm thấy rất buồn chán vì phải ngồi cạnh chị gái trên bờ sông mà chẳng có việc gì làm. Thỉnh thoảng cô bé lại liếc nhìn cuốn sách chị đang đọc, nhưng nó chẳng có tranh ảnh hay những đoạn đối thoại nào cả. "Một cuốn sách mà không có tranh ảnh hay đối thoại thì có ích lợi gì cơ chứ?", Alice thầm nghĩ.</p><p>Đột nhiên, một con Thỏ Trắng mắt hồng chạy vụt qua. Nó rút trong túi áo gi-lê ra một chiếc đồng hồ quả quýt, nhìn xem giờ rồi lẩm bẩm: "Ôi trời ơi! Ôi trời ơi! Mình muộn mất rồi!". Alice tò mò đứng phắt dậy, chạy đuổi theo con thỏ và rơi tọt vào một cái hang sâu thẳm.</p>'},
  {id: 'r14', title: 'Peter Pan', author: 'J.M. Barrie', content: '<p>Tất cả những đứa trẻ rồi cũng sẽ lớn lên, ngoại trừ một người. Đó là Peter Pan. Cậu bé sống ở vùng đất Neverland kỳ diệu cùng với nàng tiên Tinker Bell và nhóm Những Cậu Bé Đi Lạc.</p><p>Một đêm nọ, Peter Pan bay vào phòng ngủ của ba chị em Wendy, John và Michael Darling để tìm lại cái bóng của mình. Wendy đã giúp Peter khâu lại cái bóng, và để đền ơn, Peter đã rủ ba chị em bay đến Neverland. Tại đây, họ đã trải qua những cuộc phiêu lưu kỳ thú, chiến đấu với bọn cướp biển hung ác do thuyền trưởng Hook cầm đầu.</p>'},
  {id: 'r15', title: 'Phù thủy xứ Oz', author: 'L. Frank Baum', content: '<p>Dorothy sống cùng chú Henry và thím Em ở giữa thảo nguyên Kansas rộng lớn. Xung quanh chỉ có cỏ khô và bầu trời xám xịt. Một ngày nọ, một cơn lốc xoáy khổng lồ ập đến, cuốn tung ngôi nhà nhỏ bé của Dorothy bay lên không trung.</p><p>Khi ngôi nhà rơi xuống, Dorothy thấy mình đang ở một vùng đất kỳ lạ, rực rỡ sắc màu. Đó là xứ sở Oz. Để tìm đường về nhà, Dorothy phải đi theo con đường lát gạch vàng đến Thành phố Ngọc Lục Bảo để xin sự giúp đỡ của vị Phù thủy xứ Oz quyền năng. Trên đường đi, cô bé đã kết bạn với Bù Nhìn, Thợ Rừng Thiếc và Sư Tử Hèn Nhát.</p>'},
  {id: 'r16', title: 'Chuyện con mèo dạy hải âu bay', author: 'Luis Sepúlveda', content: '<p>Zorba, một con mèo mun to đùng, mập ú, đang sưởi nắng trên ban công thì bỗng một con hải âu rơi rầm xuống. Nó bị phủ đầy váng dầu và sắp chết.</p><p>Trước khi trút hơi thở cuối cùng, con hải âu đã đẻ ra một quả trứng và bắt Zorba phải hứa ba điều: thứ nhất, không được ăn quả trứng; thứ hai, phải ấp cho quả trứng nở; và thứ ba, phải dạy cho con hải âu non biết bay. Zorba, một con mèo tử tế, đã đồng ý. Và thế là, cuộc hành trình thực hiện lời hứa đầy khó khăn nhưng cũng vô cùng cảm động của Zorba và những người bạn mèo bắt đầu.</p>'},
  {id: 'r17', title: 'Ông già và biển cả', author: 'Ernest Hemingway', content: '<p>Ông lão Santiago đã tám mươi tư ngày không đánh được con cá nào. Cậu bé Manolin, người vẫn thường đi câu cùng ông, đã bị bố mẹ bắt sang thuyền khác vì cho rằng ông lão đã quá xui xẻo. Dù vậy, Manolin vẫn luôn quan tâm và chăm sóc ông lão.</p><p>Vào ngày thứ tám mươi lăm, ông lão quyết định chèo thuyền ra vùng biển khơi xa xôi để tìm kiếm một mẻ cá lớn. Và ông đã câu được một con cá kiếm khổng lồ. Cuộc chiến giữa ông lão và con cá kéo dài suốt ba ngày ba đêm, thử thách sức chịu đựng và ý chí kiên cường của con người.</p>'},
  {id: 'r18', title: 'Nhà giả kim', author: 'Paulo Coelho', content: '<p>Cậu bé chăn cừu Santiago có một giấc mơ kỳ lạ lặp đi lặp lại về một kho báu được giấu ở kim tự tháp Ai Cập. Cậu quyết định bán đàn cừu, rời bỏ quê hương Andalusia để lên đường đi tìm kho báu.</p><p>Trên hành trình của mình, Santiago đã gặp gỡ nhiều người, trải qua nhiều thử thách và học được những bài học quý giá về cuộc sống, về việc lắng nghe trái tim mình và theo đuổi "Vận Mệnh" của bản thân. Cuối cùng, cậu nhận ra rằng kho báu thực sự không nằm ở đâu xa xôi, mà ở ngay nơi cậu đã bắt đầu cuộc hành trình.</p>'},
  {id: 'r19', title: 'Hoàng tử và chú bé nghèo khổ', author: 'Mark Twain', content: '<p>Tom Canty, một cậu bé nghèo khổ sống trong khu ổ chuột ở London, luôn mơ ước được gặp hoàng tử. Một ngày nọ, Tom vô tình lọt vào cung điện và gặp gỡ Thái tử Edward. Hai người kinh ngạc nhận ra họ có khuôn mặt giống hệt nhau.</p><p>Vì tò mò, họ quyết định đổi quần áo cho nhau. Nhưng một sự cố xảy ra khiến Thái tử Edward bị lính gác đuổi ra khỏi cung điện vì tưởng nhầm là kẻ ăn mày, còn Tom Canty thì bị kẹt lại trong cung điện và phải đóng giả làm Thái tử. Cả hai đã trải qua những tình huống dở khóc dở cười và nhận ra cuộc sống của người kia không hề dễ dàng như họ tưởng.</p>'},
  {id: 'r20', title: 'Tiếng gọi nơi hoang dã', author: 'Jack London', content: '<p>Buck là một chú chó to khỏe, sống sung sướng trong một trang trại ở thung lũng Santa Clara, California. Nhưng rồi nó bị người làm vườn bắt cóc và bán sang vùng Alaska lạnh giá để làm chó kéo xe trượt tuyết trong thời kỳ đổ xô đi tìm vàng.</p><p>Tại đây, Buck phải đối mặt với sự tàn khốc của thiên nhiên và sự độc ác của con người. Nó phải học cách sinh tồn, chiến đấu với những con chó khác để giành vị trí thủ lĩnh. Dần dần, bản năng hoang dã trong Buck trỗi dậy, và nó quyết định từ bỏ thế giới văn minh để trở về với rừng rậm, sống cùng bầy sói.</p>'}
];

async function upload() {
  console.log('Starting upload...');
  for (const book of READABLE_BOOKS) {
    await setDoc(doc(db, 'readable_books', book.id.toString()), {
      title: book.title,
      author: book.author,
      content: book.content
    });
  }
  console.log('Readable books uploaded.');
  
  for (const book of BOOKS) {
    await setDoc(doc(db, 'suggested_books', book.id.toString()), {
      title: book.title,
      author: book.author,
      age: book.age,
      cat: book.cat,
      desc: book.desc
    });
  }
  console.log('Suggested books uploaded.');
  console.log('Done!');
  process.exit(0);
}

upload().catch(console.error);
