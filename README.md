# Number Discussions - Collaborative Math Tree

**Number Discussions** is a unique collaborative web application where users can create "calculation trees". Users start with a base number (Root), and others can "branch" off that value using mathematical operations (+, -, ÷, ×), creating an evolving, visually engaging number-based discussion.

![Preview](./public/images/darkmode.png) *(Replace with actual app screenshot if available)*

## 🚀 Key Features

*   **Recursive Calculation Trees:** Infinite nested comment structures where each reply is the result of a new mathematical operation.
*   **Real-time like Updates:** Reactive state updates to display ongoing discussions instantly.
*   **Interactive UI:** Elegant Dark/Light Mode with smooth transition animations.
*   **User System:** Complete authentication (Register/Login) secured with JWT & BCrypt.
*   **Avatar Customization:** Integrated DiceBear API for automatic cartoon avatars, plus a custom image upload option.
*   **Responsive Design:** Fully responsive layout optimized for mobile and desktop.
*   **Visual Enhancements:** Glassmorphism UI, loading states, and interactive cards.

## 🛠️ Tech Stack

This application is built using modern Fullstack JavaScript technologies:

### Frontend
*   **Next.js 16 (App Router):** The main React framework for server-side rendering and routing.
*   **React 19:** The UI library for building interactive components.
*   **Tailwind CSS 4:** Utility-first CSS framework for rapid and flexible styling.
*   **Lucide React & Material Symbols:** Iconography.

### Backend & Database
*   **Next.js API Routes:** Serverless functions for handling API requests.
*   **Prisma ORM:** Secure and efficient database management.
*   **PostgreSQL:** Relational database (via Supabase/local) for storing user and calculation data.
*   **Decimal.js:** Handles mathematical precision to avoid floating-point errors.

### Authentication & Security
*   **JWT (JSON Web Token):** Secure stateless session mechanism.
*   **BcryptJS:** One-way password hashing.
*   **Zod:** Input schema validation for data integrity.

## 📖 User Flow

Here are the steps to use the application:

1.  **Join (Register/Login):**
    *   New users sign up with a Username and Password.
    *   Once logged in, users gain full access to interact with the platform.

2.  **Start a Discussion (Create Root):**
    *   Click the **"New Calculation"** button.
    *   Enter a Seed Value (e.g., `100`).
    *   This becomes the "Origin Node" or the root of a new tree.

3.  **Branching Out:**
    *   View an "Origin Node" or another user's branch card.
    *   Click the **"Create Branch"** or **"Reply"** button.
    *   Select an operation (Add `+`, Subtract `-`, Multiply `×`, Divide `÷`) and enter a value.
    *   *Example:* From a node of `100`, if you select `× 2`, the new branch value will be `200`.

4.  **View Replies (Nested Views):**
    *   Every branch can be replied to further.
    *   Use the **"View Replies"** button to expand and view deeper branches without reloading the page.

5.  **Profile Personalization:**
    *   Click the avatar in the top-right corner of the navbar.
    *   Select a cartoon avatar preset or upload your own custom image.

## 📂 Project Structure

```
ellty-fullstack-test/
├── app/
│   ├── _components/    # Reusable UI Components (Navbar, RootCard, BranchCard, etc.)
│   ├── _lib/           # Utilities (Prisma client, dateUtils, helpers)
│   ├── api/            # Backend API Routes (Auth, Calculations, Users)
│   └── page.js         # Main Page (Main Feed)
├── prisma/
│   └── schema.prisma   # Database Schema
├── public/
│   └── images/         # Static Assets (darkmode/lightmode icons)
├── .env                # Environment Variables (Database URL, JWT Secret)
└── package.json        # Project Dependencies
```

## 💻 Installation

1.  **Clone Repository:**
    ```bash
    git clone https://github.com/username/project-name.git
    cd project-name
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Setup Database:**
    Ensure PostgreSQL is running and the database URL is set in the `.env` file.
    ```bash
    npx prisma db push
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---
*Created for Ellty Fullstack Test Assignment.*
