# Healway Monorepo

This is the monorepo for the Healway project, containing both a Next.js app and a FastAPI server.

## Directory Structure

- `apps/`
  - `healway-app/` - The Next.js application
  - `llm-server/` - The FastAPI server

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Bun.js (v1.2.x)
- Yarn (v1.22 or higher)
- Python (v3.8 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tejasladhe24/healway-test.git
   cd healway-apps
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Install Python dependencies using Poetry:

   ```bash
   poetry install
   ```

4. Activate the Poetry environment:

   ```bash
   poetry env activate
   ```

### Environment Setup

1. Create and set up the environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit the `.env.local` file with the necessary environment variables.

2. Link the environment variables:

   ```bash
   yarn link-env:local
   ```

### Running the Development Server

To start the development server, run:

```bash
yarn dev
```

This will start both the Next.js app and the FastAPI server.
