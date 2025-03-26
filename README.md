# StudyBuddy: AI-Powered Flashcards and Study Helper

**An application that helps users generate, organize, and review flashcards for studying.**

StudyBuddy leverages ChatGPT’s API to generate flashcard content, provide explanations, and simulate study sessions with interactive quizzes.

## Features

### MVP Features

✅ **User Authentication**

- Sign up and log in for a personalized experience.

✅ **Flashcard Creation**

- Create flashcards manually or generate them automatically using ChatGPT.
- Input a topic or text, and the app generates Q&A flashcards.

✅ **Flashcard Organization**

- Organize flashcards into subject-based decks.

✅ **Study Mode**

- Review flashcards in Q&A format.
- Quiz mode where ChatGPT generates and asks questions interactively.

### Stretch Goals (Optional)

🔹 **AI Quiz Generation** – Generate custom multiple-choice quizzes.  
🔹 **Progress Tracking** – Track correct/incorrect answers per deck.  
🔹 **Collaboration** – Share decks with other users.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: MySQL (stores users, flashcards, and decks)
- **API**: OpenAI’s ChatGPT API (for flashcard & quiz generation)

## Development Plan

### 1: Setup & Authentication

- Set up project structure (frontend + backend).
- Configure MySQL database + Express connection.
- Implement user authentication (JWT).

### 2: Flashcard Management

- Create MySQL tables for flashcards & decks.
- Build backend CRUD routes for flashcards.
- Develop React components for flashcard management.

### 3: Study Mode & ChatGPT Integration

- Integrate ChatGPT API for flashcard generation.
- Implement study mode (Q&A and quiz simulation).

### 4: Polishing & Deployment

- Finalize styling.
- Test and debug API integration.
- Deploy the app.

## Feature Tickets (Epics & Tasks)

### **Epic 1: Authentication System**

- [ ] 1.1: Set up MySQL `users` table.
- [ ] 1.2: Build backend routes (signup/login/logout).
- [ ] 1.3: Implement JWT authentication.
- [ ] 1.4: Design frontend auth forms.

### **Epic 2: Flashcard Management**

- [ ] 2.1: Create MySQL tables for flashcards & decks.
- [ ] 2.2: Build CRUD routes for flashcards.
- [ ] 2.3: Develop React components for flashcard UI.
- [ ] 2.4: Add frontend validation.

### **Epic 3: ChatGPT Integration**

- [ ] 3.1: Connect to OpenAI’s API.
- [ ] 3.2: Build backend endpoint for API calls.
- [ ] 3.3: Add AI flashcard generation in frontend.
- [ ] 3.4: Implement AI-powered quiz mode.

### **Epic 4: Study Mode & Deployment**

- [ ] 4.1: Create study mode interface.
- [ ] 4.2: Finalize app styling.
- [ ] 4.3: Test, debug, and deploy.

## OpenAI API Use Case

**Example: Generate Flashcards**  
**Endpoint**: `https://api.openai.com/v1/chat/completions`  
**Prompt**:

```json
"Generate flashcards for the topic 'Photosynthesis'"
```

**Response**:

```json
{
  "flashcards": [
    {
      "question": "What is photosynthesis?",
      "answer": "The process by which plants convert light energy into chemical energy."
    },
    {
      "question": "What are the main inputs of photosynthesis?",
      "answer": "Carbon dioxide, water, and sunlight."
    }
  ]
}
```
