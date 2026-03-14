# Library Management: Nexus Frontend

This repository contains the premium React-based frontend for the Library Management System microservices ecosystem. It provides a visual dashboard to interact with Books, Members, and Cloud Storage via the API Gateway.

## Features

- **Books Management**: View and add books to the MySQL-backed inventory.
- **Members Management**: Register and view library members stored in MongoDB.
- **Cloud Storage**: Seamlessly upload files to Google Cloud Storage.
- **Modern UI**: Dark mode with Glassmorphism and micro-animations for a premium feel.

## Architecture

The frontend connects directly to the **API Gateway** on port `8080`.

-   **Frontend**: React + Vite
-   **Service Layer**: Centralized `api.js` using the Fetch API.
-   **Styling**: Vanilla CSS with modern flex/grid layouts and backdrop filters.

## Running Locally

### Prerequisites

-   **Node.js**: v18 or higher is recommended.
-   **Backend Services**: Ensure the entire backend ecosystem is running (Config Server, Eureka, Gateway, and domain services).

### Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Access Nexu**:
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Backend Dependencies

For the frontend to function, the following services must be healthy:
-   **API Gateway**: `http://localhost:8080` (Gateway must be up for routing).
-   **Service Registry**: `http://localhost:8761` (Services must be registered).
-   **Domain Services**: Port 8081, 8082, 8083 must be responsive.
