# College Event Management Portal

A comprehensive, responsive web application for managing college clubs and events. Built with React, Vite, Tailwind CSS, and powered by Appwrite as the Backend-as-a-Service (BaaS).

## Features

- **User Authentication**: Secure Login, Registration, and Forgot Password features.
- **Role-Based Access Control (RBAC)**: Multi-level governance system utilizing Appwrite Teams with roles such as Admin, Club Admin, and regular Member.
- **Club Management**: Workflows for users to request to create clubs or join existing ones.
- **Event & Post Management**: Create, edit, and publish rich-text events and posts using TinyMCE. Includes image uploading and storage via Appwrite.
- **Approval Workflows**: Club admins can approve or reject member posts and join requests, ensuring quality and moderation.
- **Event Registration**: Allow users to register for specific events seamlessly.
- **Protected Routing**: Role-based UI rendering and protected React Router routes to secure sensitive pages.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router DOM, React Hook Form, Redux Toolkit, Lucide React (Icons), TinyMCE (Rich Text Editor).
- **Backend/Services**: Appwrite (Authentication, Database, Storage, Teams/RBAC).

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- An active Appwrite instance (either self-hosted or Appwrite Cloud)
- TinyMCE API Key (for the Rich Text Editor)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Event Management/frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required environment variables in `.env` based on your Appwrite Console setup and your TinyMCE account:

     ```env
     VITE_APPWRITE_PROJECT_ID=your_project_id
     VITE_APPWRITE_ENDPOINT=your_endpoint_url
     VITE_APPWRITE_BUCKET_ID=your_bucket_id
     VITE_APPWRITE_DATABASE_ID=your_database_id
     APPWRITE_API_KEY=your_appwrite_api_key
     VITE_RTE_API_KEY=your_tinymce_api_key
     # Add all necessary Collection IDs as specified in .env.example
     ```

4. Run Appwrite Setup Scripts (Optional but Recommended):
   There are setup scripts in the `scripts/` directory to help configure Appwrite permissions and roles automatically:
   ```bash
   node scripts/setup_permissions.js
   node scripts/set_admin.js
   ```

5. Start the Development Server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to the address shown by Vite (typically `http://localhost:5173`).

## Project Structure

```
.
├── Appwrite/               # Appwrite BaaS configuration and service handlers (DB, Auth, Storage)
├── AuthContext/            # React Context for global auth state management
├── public/                 # Static assets
├── scripts/                # Utility scripts for initializing Appwrite permissions and admins
├── src/                    # Main React source code
│   ├── components/         # Reusable UI components (PostForm, ProtectedRoute, etc.)
│   ├── config/             # Environment and application configuration
│   ├── pages/              # Top-level React views/pages
│   └── ...                 # Other source files (App.jsx, main.jsx, store.js)
├── .env.example            # Environment variables template
└── package.json            # Project metadata and dependencies
```

## Available Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the application for production.
- `npm run lint` - Lints the codebase using ESLint.
- `npm run preview` - Previews the production build locally.
