package com.example.project_school.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.project_school.model.User;

@Mapper
public interface UserMapper {

    public void join(User user);

    public String getPw(String id);

    public User selectUser(String id);

    public String getName(String number);

    public String searchId(String number);

    public User searchUserId(String number);

    public String searchPw(String id);

    public User searchUserPw(String number);

    public String getId(String pw);



    public String check(String id);

    public String searchName(String number);

    public String searchNum(String name);

    public String searchName2(String id);

}
