package com.example.project_school.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = "com.example.project_school.mapper")
public class MyBatisConfig {
    
}