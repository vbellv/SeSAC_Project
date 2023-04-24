package com.example.project_school.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.project_school.mapper.UserMapper;
import com.example.project_school.model.User;

@Controller
@RequestMapping("user")
public class UserController {

    @Autowired
    UserMapper userMapper;
    
    @GetMapping("join")
    public String join(){
        return "user/join";
    }

    @PostMapping("join")
    public String join(HttpSession session, User user){
        userMapper.join(user);
        return "redirect:/";
    }

    @GetMapping("idOverlap")
    public String over(){
        return "user/idOverlap";
    }

    @PostMapping("idOverlap")
    public String over(HttpSession session, User user, Model model){

        String result = "";

        String id = user.getUserId();
        System.out.println(id);
        String check = userMapper.check(id);
        System.out.println(check);

        if(id.equals(check)){
            session.setAttribute("id", id);
            System.out.println("id");
            result = "idOverX";
        }
        else{
            session.setAttribute("id", id);
            System.out.println("id");
            result = "idOverO";
        }
        return result;
    }

    @GetMapping("login")
    public String login(){
        return "user/login";
    }

    @PostMapping("login")
    public String login(HttpSession session, User user){

        String id = user.getUserId();
        String pw = user.getUserPw();
        String getPw = userMapper.getPw(id);

        if(getPw != null){
            if(getPw.equals(pw)){
                User userData = userMapper.selectUser(id);
                session.setAttribute("user", userData);
            }
        }
        else{
            session.setAttribute("user", null);
            return "user/loginFail";
        }
        return "redirect:/";
    }

    @GetMapping("logout")
    public String logout(HttpSession session){
        session.removeAttribute("user");
        return "redirect:/";
    }

    @GetMapping("idSearch")
    public String idSearch(){
        return "user/idSearch";   
    }

    @PostMapping("idSearch")
    public String idSearch(HttpSession session, User user, Model model){

        String result = "";

        String number = user.getClassOf();
        String name = user.getUserName();


        String searchId = userMapper.searchId(number);
        String searchNum = userMapper.searchNum(name);
        String searchName = userMapper.searchName(number);


        if(searchId != null){
            if(searchNum == null || searchName == null){
                result = "user/loginFail";
            }
            else if(searchNum.equals(number) && searchName.equals(name)){
                session.setAttribute("name", searchId);
                System.out.println(searchId);
                result = "user/findId";

            }        
            else{
            result = "user/loginFail";
            }
        }
        return result;
    }

    @GetMapping("pwSearch")
    public String pwSearch(){
        return "user/pwSearch";
    }

    @PostMapping("pwSearch")
    public String pwSearch(HttpSession session, User user, Model model){

        String id = user.getUserId();
        String number = user.getClassOf();
        String name = user.getUserName();

        String searchPw = userMapper.searchPw(number);

        String searchId = userMapper.searchId(number);
        String searchNum = userMapper.searchNum(name);
        String searchName = userMapper.searchName2(id);

        if(searchPw != null){
            if(searchId == null || searchName == null || searchNum == null){
                return "user/loginFail";
            }
            else if(searchNum.equals(number) && searchId.equals(id) && searchName.equals(name)){
                    session.setAttribute("password", searchPw);
                    System.out.println(searchPw);
                    return "user/findPw";
                }
            }
            else{
                return "user/loginFail";
            }
        
    return "redirect:/user/findPw";
    }

    @GetMapping("findId")
    public String findId(){
        return "user/findId";
    }

    @GetMapping("findPw")
    public String findPw(){
        return "user/findPw";
    }

}
