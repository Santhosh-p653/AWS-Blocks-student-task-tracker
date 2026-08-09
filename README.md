# 📚 Student Task Manager

A beginner-friendly full-stack application that demonstrates CRUD operations using **AWS Blocks** and **React**.

## What it does

- **Add** a task
- **View** all tasks
- **Edit** a task title
- **Mark** a task as completed (or undo it)
- **Delete** a task
- Data **persists across browser refreshes**

## Tech stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18 + TypeScript                   |
| Backend  | AWS Blocks (`ApiNamespace` + `KVStore`) |
| Bundler  | Vite                                    |

## Project structure

```
student-task-manager/
├── aws-blocks/
│   └── index.ts        # Backend: KVStore + all API functions
├── src/
│   ├── main.tsx        # React entry point
│   ├── App.tsx         # Root component + all state + API calls
│   ├── types.ts        # Shared Task type used by frontend and backend
│   └── components/
│       ├── TaskForm.tsx   # Input field and Add/Update button
│       └── TaskList.tsx   # Task cards with Complete/Edit/Delete buttons
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting started

**Requirements:** Node.js >= 22, npm >= 10 (or pnpm)

```bash
# 1. Install dependencies
pnpm install

# 2. Start the backend (Terminal 1)
npx tsx aws-blocks/server.ts

# 3. Start the frontend (Terminal 2)
npx vite --port 3100
```

Open **http://localhost:3100** in your browser.

> Both terminals must stay open while you use the app.
> Tasks are saved to `.bb-data/` locally and persist across restarts.
<img width="1919" height="1010" alt="image" src="https://github.com/user-attachments/assets/e39d3d88-bb69-4fa7-af55-5fd4b99dece2" />

## How it works

AWS Blocks runs a local backend server and gives the frontend a fully type-safe API client. The frontend calls backend functions like regular TypeScript functions — no `fetch()`, no URLs, no JSON parsing needed.
<img width="1919" height="1068" alt="image" src="https://github.com/user-attachments/assets/4ebf684a-cbb8-4505-935f-0fefea14f541" />

```ts
// Frontend calls this like a normal function
const newTask = await api.addTask("Read chapter 3");
```

Behind the scenes, Blocks handles the HTTP call, serialization, and routing.
When deployed to AWS, the same code runs against real DynamoDB — zero changes required.
