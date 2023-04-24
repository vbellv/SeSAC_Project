import os
import json
from itertools import combinations
import pymysql

local_path = os.path.dirname(os.path.realpath(__file__)) + '/'


class Database:

    def __init__(self):
        
        db_config = open(local_path + 'data/db_login_aws.json', encoding='utf-8')
        db_login= json.load(db_config)

        self.conn = pymysql.connect(
            host= db_login['lib_total']['host'],
            port= db_login['lib_total']['port'],
            user= db_login['lib_total']['user'],
            password= db_login['lib_total']['password'],
            db= db_login['lib_total']['db'],
            charset= db_login['lib_total']['charset'])
        
        self.cur = self.conn.cursor()

    # 검색
    def search_book(self, title=None, author=None, lib_nm=None):
        search_sql = f'''SELECT *
                        FROM (SELECT * 
                                FROM search_book_t
                                WHERE TITLE LIKE '%{title}%'
                                AND AUTHOR LIKE '%{author}%'
                                AND LIBRARY_NM like '%{lib_nm}%'
                                ORDER BY T_BOOK_CD ASC, RENT_YN ASC
                                LIMIT 18446744073709551615) AS ORDER_SC
                        ORDER BY RENT_YN ASC
                        ;'''

        self.cur.execute(search_sql)
        result = self.cur.fetchall()

        return result

    # 추천
    def recommend_book(self, genre_list=None, lib_nm=None):

        n = len(genre_list)
        res = 3

        if n == 0:
            return

        final_num = 3
        final_list = []
        choice_list = []

        for i in range(n+1, 0, -1):
            for choice in combinations(genre_list, i):
                m = len(choice)
                if lib_nm != '':
                    if m != 0:
                        sql = f'''select * 
                                from (
                                    select *
                                    from (
                                        select * 
                                        from search_book_t
                                        order by rent_yn asc limit 18446744073709551615) as ord_tmp
                                    group by title ) as grp_tmp
                                where library_nm like '%{lib_nm}%'
                                and genre like "%{choice[0]}%"'''

                    if m > 1:
                        for k in range(1, m):
                            sql += f'''\n and genre like "%{choice[k]}%"'''

                    sql += '''\n order by rent_SUM DESC, rent_yn asc, rand() limit 3;'''

                else:
                    if m != 0:
                        sql = f'''select * 
                                from (
                                    select *
                                    from (
                                        select * 
                                        from search_book_t
                                        order by rent_yn asc limit 18446744073709551615) as ord_tmp
                                        group by title ) as grp_tmp
                                where genre like "%{choice[0]}%"'''

                    if m > 1:
                        for k in range(1, m):
                            sql += f'''\n and genre like "%{choice[k]}%"'''

                    sql += '''\n order by rent_SUM DESC, rent_yn asc, rand() limit 3;'''

                self.cur.execute(sql)
                result = self.cur.fetchall()

                for x in range(len(result)):

                    if len(final_list) < final_num:
                        if result[x] in final_list:
                            continue
                        else:
                            final_list.append(result[x])
                            choice_list.append(choice)
                    else:
                        return final_list, choice_list

                if len(result) >= final_num:
                    return result, choice_list
