# flask => spring 전달 객체 클래스
# ans = answer.Answer()

class Answer:

    def __init__(self):
        
        # 의도 분류 클래스
        self.intent = -1
        
        # 버튼 의도 분류 클래스
        self.btn_intent = -1

        # 요청 위치명
        # location name
        self.req_lname = ''

        # 요청 도서명
        self.req_bname = ''
        
        # 요청 작가명
        self.req_wname = ''
        
        # 요청 장르명
        self.req_gname = []

        # 보유 도서명
        self.in_lib_bname = ''
        
        # 보유 작가명
        self.in_lib_wname = ''
        
        # 보유 장르명
        self.in_lib_gname = []

        # =============================
        # 'T_BOOK_CD', 'LIBRARY_NM', 'LIB_BOOK_CD', 'ISBN', 'TITLE', 'AUTHOR', 'GENRE', 'RENT_YN', 'B_IMG', 'B_INTRO'
        
        # 통합도서코드
        self.t_book_cd = []

        # 도서관명
        self.library_nm = []
        
        # 도서코드(도서관별)
        self.lib_book_cd = []
        
        # ISBN
        self.isbn = []

        # 책 제목
        self.title = []
        
        # 저자명
        self.author = []
        
        # 장르
        self.genre = []
        
        # 대출여부
        self.rent_yn = []
        
        # 책 표지
        self.b_img = []
        
        # 소개글
        self.b_intro = []
    
        # 누적대여횟수
        self.rent_sum = []
        
        # =============================
        
        # 검색결과 json
        self.search_result = []
        
        # 챗봇 답변
        self.response = []
        
        # (의도분류-negative) 예외 데이터 
        self.neg_data = []

    def get_intent(self):
        return self.intent
    
    def set_intent(self,intent):
        self.intent = intent
        
    def get_btn_intent(self):
        return self.btn_intent
    
    def set_btn_intent(self,btn_intent):
        self.btn_intent = btn_intent

    # 위치 getter, setter 추가
    def get_req_lname(self):
        return self.req_lname
    
    def set_req_lname(self,req_lname):
        self.req_lname = req_lname

    def get_req_bname(self):
        return self.req_bname
    
    def set_req_bname(self,req_bname):
        self.req_bname = req_bname

    def get_req_wname(self):
        return self.req_wname

    def set_req_wname(self,req_wname):
        self.req_wname = req_wname

    def get_req_gname(self):
        return self.req_gname
    
    def set_req_gname(self,req_gname):
        self.req_gname.append(req_gname)

    def get_in_lib_bname(self):
        return self.in_lib_bname
    
    def set_in_lib_bname(self,in_lib_bname):
        self.in_lib_bname = in_lib_bname

    def get_in_lib_wname(self):
        return self.in_lib_wname

    def set_in_lib_wname(self,in_lib_wname):
        self.in_lib_wname = in_lib_wname

    def get_in_lib_gname(self):
        return self.in_lib_gname
    
    def set_in_lib_gname(self,in_lib_gname):
        self.in_lib_gname.append(in_lib_gname)

    def set_t_book_cd(self, t_book_cd):
        self.t_book_cd.append(t_book_cd)
    
    def get_t_book_cd(self):
        return self.t_book_cd

    def set_library_nm(self, library_nm):
        self.library_nm.append(library_nm)
    
    def get_library_nm(self):
        return self.library_nm
 
    def set_lib_book_cd(self, lib_book_cd):
        self.lib_book_cd.append(lib_book_cd)
    
    def get_lib_book_cd(self):
        return self.lib_book_cd

    def set_isbn(self, isbn):
        self.isbn.append(isbn)
    
    def get_isbn(self):
        return self.isbn

    def set_title(self, title):
        self.title.append(title)
    
    def get_title(self):
        return self.title

    def set_author(self, author):
        self.author.append(author)
    
    def get_author(self):
        return self.author

    def set_genre(self, genre):
        self.genre.append(genre)
    
    def get_genre(self):
        return self.genre
        
    def set_rent_yn(self, rent_yn):
        self.rent_yn.append(rent_yn)
    
    def get_rent_yn(self):
        return self.rent_yn
        
    def set_b_img(self, b_img):
        self.b_img.append(b_img)
    
    def get_b_img(self):
        return self.b_img

    def set_b_intro(self, b_intro):
        self.b_intro.append(b_intro)
    
    def get_b_intro(self):
        return self.b_intro

    def set_rent_sum(self, rent_sum):
        self.rent_sum.append(rent_sum)
    
    def get_rent_sum(self):
        return self.rent_sum
        
    def set_search_result(self, search_result):
        self.search_result = search_result
    
    def get_search_result(self):
        return self.search_result

    def set_response(self,response):
        self.response.append(response)

    def get_response(self):
        return self.response
    
    def set_neg_data(self,neg_data):
        self.neg_data.append(neg_data)
        
    def get_neg_data(self):
        return self.neg_data
    
    def print_ans(self):
        non_empty_fields = {}

        for field_name in vars(self):
            field_value = getattr(self, field_name)

            if field_value:
                non_empty_fields[field_name] = field_value
                
        return non_empty_fields

        