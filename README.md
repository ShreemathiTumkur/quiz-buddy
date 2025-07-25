# Quiz Buddy - AI-Powered Educational Quiz Platform

## Summary
Quiz Buddy is an interactive educational platform that generates personalized quizzes across various topics using AI technology. The application provides an engaging learning experience with real-time question generation, user progress tracking, and a modern responsive interface built with React and powered by Supabase.

## Problem Statement
Traditional learning methods often lack engagement and personalization. Students struggle with:
- Limited access to diverse, topic-specific quiz questions
- Static content that doesn't adapt to learning needs
- Lack of immediate feedback and progress tracking
- Difficulty finding quality educational content across multiple subjects

## Goal
To create an accessible, engaging, and intelligent quiz platform that:
- Generates unlimited, high-quality factual questions for any topic
- Provides immediate feedback and learning insights
- Tracks user progress and performance
- Offers a seamless, modern user experience across all devices

## Solution
Quiz Buddy leverages AI-powered question generation combined with a robust backend infrastructure to deliver:
- **Dynamic Question Generation**: OpenAI integration for creating contextual, factual questions
- **Multi-Topic Support**: Comprehensive coverage including Science, Geography, Math, and more
- **User Management**: Secure authentication and personalized profiles
- **Real-time Experience**: Instant question generation and immediate feedback
- **Responsive Design**: Modern UI that works seamlessly across desktop and mobile devices

## Architecture

### System Overview
<lov-mermaid>
graph TB
    subgraph "Frontend Layer"
        UI[React Frontend]
        Auth[Authentication]
        Quiz[Quiz Interface]
        Profile[User Profiles]
    end
    
    subgraph "Backend Services"
        SB[Supabase Backend]
        EF[Edge Functions]
        OpenAI[OpenAI API]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL Database)]
        Topics[Topics Table]
        Questions[Questions Table]
        Users[Profiles Table]
    end
    
    UI --> Auth
    UI --> Quiz
    UI --> Profile
    
    Auth --> SB
    Quiz --> EF
    Profile --> SB
    
    EF --> OpenAI
    EF --> DB
    
    SB --> DB
    DB --> Topics
    DB --> Questions
    DB --> Users
    
    style UI fill:#e1f5fe
    style SB fill:#f3e5f5
    style DB fill:#e8f5e8
    style OpenAI fill:#fff3e0
</lov-mermaid>

### Database Schema
<lov-mermaid>
erDiagram
    profiles {
        uuid id PK
        uuid user_id FK
        text display_name
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    topics {
        uuid id PK
        text name
        text emoji
        timestamp created_at
    }
    
    questions {
        uuid id PK
        uuid topic_id FK
        text text
        text question_type
        text[] options
        text correct_answer
        text fun_fact
        text media_url
        integer difficulty
        timestamp created_at
    }
    
    profiles ||--o{ topics : "creates"
    topics ||--o{ questions : "contains"
</lov-mermaid>

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Edge Functions, Authentication)
- **AI Integration**: OpenAI API for question generation
- **Build Tool**: Vite
- **Deployment**: Lovable Platform

## Project Info

**URL**: https://quiz-buddy-github-link.lovable.app/

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


