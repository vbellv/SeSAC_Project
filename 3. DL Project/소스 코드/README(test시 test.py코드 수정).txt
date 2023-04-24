1. train.py 실행 전에 train.py 열어서 batch size, num_iter설정 필요
- 현재 제출한 코드는 batch 128, num_iter 15000으로 설정하고 실행함

2. test.py 실행했을 때 torch size 오류시 test.py 열어서 character에 글자 개수를 맞추어줌

3. test 실행시 정답까지 같이 출력되는 코드
- test.py 85열에 print(f'Labels|pred|OX|confidence_score') 추가
- test.py 186열에 print(f'{gt}|{pred}|{pred==gt}|{confidence_score}') 추가
