package com.example.project_school.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("answer")
public class AnswerController {

    @GetMapping("correctox")
    public String correctox(){
        return "answer/correctox";
    }
    
    @GetMapping("wrongox")
    public String wrongox(){
        return "answer/wrongox";
    }

    @GetMapping("correctshort")
    public String correctshort(){
        return "answer/correctshort";
    }
    
    @GetMapping("wrongshort")
    public String wrongshort(){
        return "answer/wrongshort";
    }
    
}
