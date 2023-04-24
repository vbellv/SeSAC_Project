package com.example.project_school.controller;

import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.project_school.mapper.BoardMapper;
import com.example.project_school.model.Board;
import com.example.project_school.model.User;

@Controller
@RequestMapping("board")
public class BoardController {

    @Autowired
    BoardMapper boardMapper;

    @GetMapping("boardList")
    public String boardList(HttpSession session, Model model){
        ArrayList<Board> boardList = boardMapper.boardList();
        model.addAttribute("boardList", boardList);
        return "board/boardList";
    }

    @GetMapping("boardCreate")
    public String boardCreate(){
        return "board/boardCreate";
    }

    @PostMapping("boardCreate")
    public String boardCreate(HttpSession session, Board board){
        User user = (User) session.getAttribute("user");
        board.setBoardWriter(user.getUserId());
        boardMapper.boardCreate(board);
        return "redirect:/board/boardList";
    }

    @GetMapping("boardDetail")
    public String boardDetail(HttpSession session, Model model, @RequestParam("boardNo") int boardNo){
        ArrayList<Board> boardList = boardMapper.boardList();
        for(Board board : boardList){
            if(board.getBoardNo() == boardNo){
                model.addAttribute("board", board);
            }
        }
        return "board/boardDetail";
    }

    @GetMapping("boardUpdate")
    public String boardUpdate(HttpSession session, @RequestParam("boardNo") int boardNo, Model model){
        ArrayList<Board> boardList = boardMapper.boardList();
        for(Board board : boardList){
            if(board.getBoardNo() == boardNo){
                model.addAttribute("board", board);
            }
        }
        return "board/boardUpdate";
    }

    @PostMapping("boardUpdate")
    public String boardUpdate(HttpSession session, Board board, @RequestParam("boardNo") String boardNo){
        boardMapper.boardUpdate(board);
        return "redirect:/board/boardList";
    }

    @GetMapping("boardRemove")
    public String boardRemove(@RequestParam("boardNo") int boardNo){
        boardMapper.boardRemove(boardNo);
        return "redirect:/board/boardList";
    }
 }
