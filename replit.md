# Overview

This project is a full-stack chat application called NUKER AI, featuring an advanced AI assistant with capabilities for weather data, news retrieval, and general conversation. The application uses a modern web stack with React frontend, Express backend, and PostgreSQL database for persistent chat sessions.

The system is designed as an authenticated chat interface where users must provide an access key to initialize chat sessions. The AI assistant can detect user intent and provide specialized responses for weather queries, news requests, and general conversation using OpenAI's GPT-5 model.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with a dark theme and neon accent colors (cyan, blue, green, purple)
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Key Pages**: Authentication page and chat interface with real-time messaging

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for authentication and chat functionality
- **Session Management**: In-memory storage with interface for future database integration
- **Services**: Modular service layer for OpenAI integration, weather data, and news retrieval

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Chat sessions and messages tables with UUID primary keys
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations
- **Session Management**: UUID-based session identification with timestamp tracking

## Authentication & Authorization
- **Method**: Simple access key authentication ("Welc0m3T0Nu3k3r")
- **Session Handling**: Server-side session creation and validation
- **Security**: Session-based access control for chat operations

## AI Integration
- **Primary AI**: OpenAI GPT-5 for chat responses and intent detection
- **Intent Recognition**: Automatic detection of weather, news, or general conversation requests
- **Response Enhancement**: Contextual responses with embedded weather and news data
- **Conversation Flow**: Persistent chat history within sessions

## External Dependencies

- **OpenAI API**: GPT-5 model for chat responses and intent classification
- **Weather Service**: OpenWeatherMap API for current weather data and forecasts
- **News Service**: NewsAPI for current news articles and headlines
- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives for accessible interface components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Development**: Replit integration for development environment support