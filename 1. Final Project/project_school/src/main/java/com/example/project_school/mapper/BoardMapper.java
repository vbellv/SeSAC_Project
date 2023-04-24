package com.example.project_school.mapper;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import com.example.project_school.model.Board;

@Mapper
public interface BoardMapper {

	public ArrayList<Board> boardList();

    public void boardRemove(int boardNo);

    public void boardUpdate(Board board);

    public void boardCreate(Board board);
    
}
