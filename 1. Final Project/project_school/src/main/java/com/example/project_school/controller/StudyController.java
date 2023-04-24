package com.example.project_school.controller;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.project_school.model.Answer;


@Controller
@RequestMapping("study")
public class StudyController {
    
    @GetMapping("learn")
    public String learn(){
        return "study/learn";
    }

    @GetMapping("information")
    public String infomation(){
        return "study/information";
    }

    @GetMapping("oxquiz")
    public String oxquiz(){
        return "study/oxquiz";
    }

    @GetMapping("shortquiz")
    public String shortquiz(){
        return "study/shortquiz";
    }

    @PostMapping("shortquiz")
    public String shortquiz(HttpSession session, Answer answer){
        // session.setAttribute("result", answer);

        // Answer data = (Answer) session.getAttribute("result");

        String word = answer.getUserAnswer();
        word = word.toLowerCase();

        if(word.equals("java")){
            return "answer/correctshort";
        }
        else{
            return "answer/wrongshort";
        }

    }

    // @PostMapping("shortquiz")
    // public String shortquiz(HttpSession session, Model model, Answer answer){
    //     String result = (String) session.getAttribute("userAnswer");
    //     model.addAttribute("result", result);

    //     if(result.equals("java") || result.equals("JAVA") || result.equals("Java")){
    //         return "answer/correctshort";
    //     }
    //     else{
    //         return "answer/wrongshort";
    //     }
    // }

    
    

    
}
