from customlog.CustomFormatter import CustomFormatter

import os
import re
import pickle
import logging

import numpy as np

import torch
from keras.utils import pad_sequences
from sentence_transformers import util

from db_conn import Database
from preprocess import Preprocess

os.environ['JAVA_HOME'] = 'C:/Program Files/Java/jdk-19/bin'

local_path = dir_path = os.path.dirname(os.path.realpath(__file__)) + '/'
p = Preprocess(word2index_dic=local_path+'data/dic/chatbot_dict.bin', userdic=local_path +
               'data/dic/dic_v3/userdict_intent_classify_v3(library)_all_lname_bname_wname_v2.txt')

db = Database()

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
ch.setFormatter(CustomFormatter())

os.system("cls")

if ch not in logger.handlers:
    logger.addHandler(ch)

log_history = []

# node1: 의도 분류 (조회,추천,문의사항)


def intent_classify(ans, intent_classify_model, user_input):

    user_input_list = []
    user_input_list.append(user_input)

    input_predicted = intent_classify_model.predict(
        sentences_to_idx(user_input_list))
    input_predicted = input_predicted.argmax(axis=-1)

    # input_predicted[0] : 0 == 문의 , 1 == 검색 , 2 == 추천
    ans.set_intent(input_predicted[0])

    return ans, input_predicted[0], user_input


def sentences_to_idx(intents_list):
    sequences = []
    check_keywords = True
    # text는 모든 문장들의 list
    for sentence in intents_list:

        # 문장을 [(단어1,품사1),(단어2,품사2)...] 로 변환
        pos = p.pos(sentence)

        # get_keywords(pos, without_tag=True) => 불용어 처리 후 품사(태그)없이 단어들만의 list
        # keywords : 불용어 처리된 [(단어1,품사1),(단어2,품사2)...], list형
        keywords = p.get_keywords(pos, without_tag=True)
        print_keywords = p.get_keywords(pos, without_tag=False)

        # 첫번째 keywords 와 sequence[0] 어떻게 대응되는지 체크해보고 싶음
        if check_keywords is True:
            check_keywords = False
        # 태그없이 '단어'만 있는 keywords에서 [[단어1,단어2],[단어1,단어2,단어3]...]들을 인덱싱해줌
        # 우리가 만든 단어사전에 없으면(OOV token이므로 인덱스 1로 고정)
        seq = p.get_wordidx_sequence(keywords)
        sequences.append(seq)

    # 조회, 추천, 문의 의도 분류 데이터 tokenize 시 최대 형태소 길이
    # 15 => 16으로 수정
    max_len = 16

    input_test = pad_sequences(sequences, maxlen=max_len)

    return input_test


# node2: (조회) 도서명, 작가명 인식 Tokenizer 작동
def check_lname_bname_wname(ans, user_input):
    # DB 상 외의 모든 도서명, 작가명 파일 필요
    # 예시로 작성
    # book_list = ['크리스마스 피그','데미안','유다','유다2','유다3','유다4','파란 책']
    # writer_list = ['J.K.롤링','헤르만 헤세','아모스 오즈','정민']

    all_lname_list = ['광진', '광진정보', '광진 정보', '자양', '자양한강', '자양 한강',
                      '군자', '군자역', '합정', '합정역']

    with open(local_path+'data/dic/dic_v3/all_bname_list_v2.pkl', 'rb') as f1:
        all_bname_list = pickle.load(f1)

    with open(local_path+'data/dic/dic_v3/all_wname_list_v2.pkl', 'rb') as f2:
        all_wname_list = pickle.load(f2)

    req_lname = ""
    req_bname = ""
    req_wname = ""

    pos = p.pos(user_input)
    keywords = p.get_keywords(pos, without_tag=False)

    detected_category = ''

    for keyword, tag in keywords:
        if tag == 'NNP':
            if keyword in all_lname_list:
                detected_category = '위치'
                req_lname = keyword
                ans.set_req_lname(req_lname)

            elif keyword in all_bname_list:
                detected_category = '도서'
                req_bname = keyword
                ans.set_req_bname(req_bname)

            elif keyword in all_wname_list:
                detected_category = '작가'
                req_wname = keyword
                ans.set_req_wname(req_wname)
                # 작가명 알지만 이후 토큰에서 도서명까지 받을 수도 있음
    if detected_category != '':
        logger.info('[ChatBot]\n' +
                    '형태소 분해: ' + str(keywords) + '\n' +
                    detected_category + "명 감지: [" + keyword + ']')
    else:
        logger.error('[ChatBot]\n' +
                    '형태소 분해: ' + str(keywords) + '\n' +
                    '감지된 카테고리가 없습니다.')

    return ans


# node3 : (추천) 장르명 추천
def recommed_by_lname_gname(ans, user_input):
    all_lname_list = ['광진', '광진정보', '광진 정보', '자양', '자양한강', '자양 한강',
                      '군자', '군자역', '합정', '합정역']

    with open(local_path+'data/dic/dic_v3/all_gname_list.pkl', 'rb') as f3:
        all_gname_list = pickle.load(f3)

    req_lname = ''
    req_gname_list = []

    pos = p.pos(user_input)
    keywords = p.get_keywords(pos, without_tag=False)

    detected_category = ''

    for keyword, tag in keywords:
        if tag == 'NNP':
            if keyword in all_lname_list:
                detected_category = '위치'
                req_lname = keyword
                ans.set_req_lname(req_lname)
        if tag == 'NNG':
            if keyword in all_gname_list:
                detected_category = '장르'
                req_gname_list.append(keyword)
                # req, in_lib에 각각 넣음
                ans.set_req_gname(keyword)

    if detected_category != '':
        logger.info("[ChatBot]\n" +
                    '형태소 분해: ' + str(keywords) + '\n' +
                    detected_category + "명 감지: [" + keyword + ']')
    else:
        logger.error("[ChatBot]\n" +
                    '형태소 분해: ' + str(keywords) + '\n' +
                    '감지된 카테고리가 없습니다.')

    # 중복 제거
    req_gname_list = list(set(req_gname_list))

    response_gnames = ''
    for req_gname in req_gname_list:
        ans.set_in_lib_gname(req_gname)

        # 답변할 str
        # ex) response_gnames = 소설, 에세이
        response_gnames += req_gname + ','

    in_lib_gname = ans.get_in_lib_gname()
    req_lname = ans.get_req_lname()

    result, choice_list = db.recommend_book(in_lib_gname, req_lname)

    if result == None:
        ans.set_response("챗봇 : 정확한 장르명을 입력해주세요.")
    else:
        for i in range(len(result)):
            ans.set_t_book_cd(result[i][0])
            ans.set_library_nm(result[i][1])
            ans.set_lib_book_cd(result[i][2])
            ans.set_isbn(result[i][3])
            ans.set_title(result[i][4])
            ans.set_author(result[i][5])
            ans.set_genre(result[i][6])
            ans.set_rent_yn(result[i][7])
            ans.set_b_img(result[i][8])
            ans.set_b_intro(result[i][9])
            ans.set_rent_sum(result[i][10])

            modify_choice_list = ""
            if len(choice_list[i]) != 1:
                modify_choice_list = re.sub("[''()]", "", str(choice_list[i]))
            else:
                modify_choice_list = re.sub("[''(),]", "", str(choice_list[i]))

            ans.set_response(f'『 {modify_choice_list} 』 장르로 추천된 도서입니다.')

        name = ['T_BOOK_CD', 'LIBRARY_NM', 'LIB_BOOK_CD', 'ISBN', 'TITLE',
                'AUTHOR', 'GENRE', 'RENT_YN', 'B_IMG', 'B_INTRO', 'RENT_SUM']
        value = [ans.get_t_book_cd(), ans.get_library_nm(), ans.get_lib_book_cd(), ans.get_isbn(), ans.get_title(), ans.get_author(),
                 ans.get_genre(), ans.get_rent_yn(), ans.get_b_img(), ans.get_b_intro(), ans.get_rent_sum()]
        res_dict = dict(zip(name, value))

        ans.set_search_result(res_dict)

    # 마지막 , 이면 제거
    response_gnames = response_gnames.rstrip(',')

    ans.set_response("챗봇 : 『" + response_gnames + " 』 장르에 해당하는 추천도서 목록입니다.")

    return ans


# node4 : (문의) 6가지 기타 문의 사항
def check_inquiry_ans(ans, user_input, sbert_model, emd_csv, emd_pt):
    # emd_csv(list type)
    # emd_pt(list type)

    all_lname_dict = {'광진': 1, '광진정보': 1, '광진 정보': 1, '자양': 2, '자양한강': 2, '자양 한강': 2,
                      '군자': 3, '군자역': 3, '합정': 4, '합정역': 4}

    # 요청한 위치명
    req_lname = ""

    # 통합 = 0, 광진 = 1 , 자양 = 2, 군자 = 3, 합정 = 4
    # 위치별로 다른 문의 답변
    loc_idx = 0

    pos = p.pos(user_input)
    keywords = p.get_keywords(pos, without_tag=False)
    
    detected_category = ''

    for keyword, tag in keywords:
        if tag == 'NNP':
            if keyword in all_lname_dict.keys():
                detected_category = '위치'
                req_lname = keyword
                loc_idx = all_lname_dict[req_lname]
                ans.set_req_lname(req_lname)

    sentence = user_input
    model = sbert_model
    # data (list type)
    data = emd_csv
    # embedding_data (list_type)
    embedding_data = emd_pt

    # 띄어쓰기 제거
    sentence = sentence.replace(" ", "")
    # 인코딩
    sentence_encode = model.encode(sentence)
    # 텐서화
    sentence_tensor = torch.tensor(sentence_encode)
    # 텐서화된 입력값과 문의 데이터 비교
    # 문장 유사도 비교는 통합 데이터로
    cos_sim = util.cos_sim(sentence_tensor, embedding_data[0])
    # 가장 큰 문장유사도 인덱스
    best_sim_idx = int(np.argmax(cos_sim))
    # 가장 큰 문장유사도 인덱스의 질문
    # 문장 유사도 비교는 통합 데이터로
    sentence_question = data[0]['input'][best_sim_idx]

    if detected_category != '':
        logger.info("[ChatBot]\n" +
                    '형태소 분해: ' + str(keywords) + '\n' +
                    detected_category + "명 감지: [" + keyword + ']\n' +
                    '선택된 질문: ' + str(sentence_question) + '\n' +
                    'util.cos_sim 활용 코사인 유사도: ' + str(cos_sim[0][best_sim_idx]))
    else:
        logger.info("[ChatBot]\n" +
                '형태소 분해: ' + str(keywords) + '\n' +
                '감지된 카테고리가 없습니다.')

    # 가장 큰 유사도 인데스에 대응하는 답변 출력
    inquiry_ans = data[loc_idx]['output'][best_sim_idx]

    ans.set_response(inquiry_ans)

    return ans

# node6 : 도서명, 작가명 책이 도서관에 있는지 확인
def check_is_in_library(ans, node):

    # 찾음 = 0 , 못찾음 = 1
    can_search = 1

    req_lname = node.get_data()['req_lname']
    req_bname = node.get_data()['req_bname']
    req_wname = node.get_data()['req_wname']

    # 모든 도서명, 작가명 list 불러오기
    with open(local_path+'data/dic/dic_v3/all_bname_list_v2.pkl', 'rb') as f4:
        all_bname_list = pickle.load(f4)

    with open(local_path+'data/dic/dic_v3/all_wname_list_v2.pkl', 'rb') as f5:
        all_wname_list = pickle.load(f5)

    # 모든 도서명, 작가명 parser 불러오기 (dict 타입)
    with open(local_path+'data/dic/dic_v3/all_bname_parser.pkl', 'rb') as f6:
        all_bname_parser = pickle.load(f6)

    with open(local_path+'data/dic/dic_v3/all_wname_parser.pkl', 'rb') as f7:
        all_wname_parser = pickle.load(f7)

    all_lname_list = ['광진', '광진정보', '광진 정보', '자양', '자양한강', '자양 한강',
                      '군자', '군자역', '합정', '합정역']

    queried_category = ""
    failed_queried_category = ""

    if req_bname != '':
        if req_bname not in all_bname_list:
            ans.set_response(
                f'『 {req_bname} 』 는 관내에 없는 도서입니다.\n다른 도서관을 이용해주세요.')
            failed_queried_category = "도서"
        elif req_bname in all_bname_list:
            queried_category = "도서"
            ans.set_in_lib_bname(all_bname_parser[req_bname])
            can_search = 0

    if req_wname != '':
        if req_wname not in all_wname_list:
            ans.set_response(
                f'『 {req_wname} 』 의 도서는 현재 관내에 없습니다. \n다른 도서관을 이용해주세요.')
            failed_queried_category = "작가"
        elif req_wname in all_wname_list:
            queried_category = "작가"
            ans.set_in_lib_wname(all_wname_parser[req_wname])
            can_search = 0

    if req_lname != '':
        if req_lname not in all_lname_list:
            failed_queried_category = "위치"
        elif req_lname != '':
            can_search = 0
            queried_category = "위치"
            pass
    
    if queried_category != "":
        logger.info('[ChatBot]\n' +
                    'DB 검색 결과: ' + queried_category + ' 있음')
    else:
        logger.error('[ChatBot]\n' +
                    failed_queried_category + ' 없음')

    return ans, can_search


# node7 : 대출 가능 여부 확인
def check_can_borrow(ans, node):
    # 대출 예약 가능 여부: 대출 예약 가능 == 0, 대출 예약 불가 == 1
    # can_borrow_label = 1

    # DB에 확인된 도서명 or 작가명
    in_lib_lname = ans.get_req_lname().replace(' ', '')
    in_lib_bname = ans.get_in_lib_bname()
    in_lib_wname = ans.get_in_lib_wname()

    if in_lib_bname != '' or in_lib_wname != '' or in_lib_lname != '':
        search_result = db.search_book(
            in_lib_bname, in_lib_wname, in_lib_lname)
        # res = json.dumps(search_result, ensure_ascii=False)
        # ans.set_res_list_in_dict(res)

        for i in range(len(search_result)):
            ans.set_t_book_cd(search_result[i][0])
            ans.set_library_nm(search_result[i][1])
            ans.set_lib_book_cd(search_result[i][2])
            ans.set_isbn(search_result[i][3])
            ans.set_title(search_result[i][4])
            ans.set_author(search_result[i][5])
            ans.set_genre(search_result[i][6])
            ans.set_rent_yn(search_result[i][7])
            ans.set_b_img(search_result[i][8])
            ans.set_b_intro(search_result[i][9])
            ans.set_rent_sum(search_result[i][10])

        name = ['T_BOOK_CD', 'LIBRARY_NM', 'LIB_BOOK_CD', 'ISBN', 'TITLE',
                'AUTHOR', 'GENRE', 'RENT_YN', 'B_IMG', 'B_INTRO', 'RENT_SUM']
        value = [ans.get_t_book_cd(), ans.get_library_nm(), ans.get_lib_book_cd(), ans.get_isbn(), ans.get_title(), ans.get_author(),
                 ans.get_genre(), ans.get_rent_yn(), ans.get_b_img(), ans.get_b_intro(), ans.get_rent_sum()]
        res_dict = dict(zip(name, value))

        ans.set_search_result(res_dict)

        if in_lib_lname != '' and in_lib_bname != '' and in_lib_wname != '':
            ans.set_response(
                f'『 {ans.get_req_lname()}, {ans.get_req_bname()}, {ans.get_req_wname()} 』 (으)로 검색된 도서입니다.')

        elif in_lib_bname != '' and in_lib_wname != '':
            ans.set_response(
                f'『 {ans.get_req_bname()}, {ans.get_req_wname()} 』 (으)로 검색된 도서입니다.')

        elif in_lib_lname != '' and in_lib_wname != '':
            ans.set_response(
                f'『 {ans.get_req_lname()}, {ans.get_req_wname()} 』 (으)로 검색된 도서입니다.')

        elif in_lib_lname != '' and in_lib_bname != '':
            ans.set_response(
                f'『 {ans.get_req_lname()}, {ans.get_req_bname()} 』 (으)로 검색된 도서입니다.')

        elif in_lib_bname != '':
            ans.set_response(f'『 {ans.get_req_bname()} 』 (으)로 검색된 도서입니다.')

        elif in_lib_wname != '':
            ans.set_response(f'『 {ans.get_req_wname()} 』 (으)로 검색된 도서입니다.')

        elif in_lib_lname != '':
            ans.set_response(f'『 {ans.get_req_lname()} 』 (으)로 검색된 도서입니다.')

    return ans
