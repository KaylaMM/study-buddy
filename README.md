## StudyBuddy: AI-Powered Flashcards and Study Helper

#### An application that helps users generate, organize, and review flashcards for studying.\*\*

StudyBuddy allows you to create flashcards yourself or by leveraging OpenAI’s API to generate flashcards on the topic of your choice and simulate study sessions with an interactive quiz mode.

## Project Screen Shots

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

Installation:

`npm install`

To Start Server:

`npm start`

To Start Client:

`npm run dev`

To Visit App:

`localhost:5173/`

## Reflection

I built this app to help my students bridge the gap between their understanding and the technical language often expected in interviews. Watching them struggle to articulate their thought process—despite grasping the concepts—inspired me to create a simple, practical tool. It’s not just about memorizing jargon; it’s about building confidence by making those terms feel familiar and accessible. Hopefully, it’ll empower them to communicate their skills as clearly as they understand them.

My goal was to build something that was pretty simple, that gave users the option of creating their own flashcards and using tools like ChatGPT to help generate a deck directly in the app so they can focus on studying.

I chose React and Vite for their speed and to keep things lightweight, and in hopes that it'd feel snappy for users. Express and Node handled the backend, and MySQL to manage the database. For styling, Sass streamlined my workflow with reusable components, and a few strategic npm packages to keep things polished.

There are features I'd like to incorporate in future iterations, such as a progress tracker, and a better user interface for mobile devices so students can use this tool on the go.
