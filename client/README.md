#  ChainDemocracy Frontend

## Project Overview

This project is a Next.js application providing a user interface with features including a dashboard, proposal management, and potentially wallet integration (inferred from the presence of `WalletContext.tsx` and `abi.json`).  The application utilizes a component library and various UI elements for a rich user experience.

## Features

* **Dashboard:** A central dashboard providing key information and insights and statistics (e.g., total proposals, active proposals, etc.).
* **Proposals:**  Management of proposals, including viewing individual proposal details (`proposals/[id]/page.tsx`).
* **About Page:** An "About" section providing information about the project.
* **How It Works:**  An explanation of the project's functionality.
* **Countdown Timer:** A visual countdown timer component.
* **Create Proposal Dialog:** A dialog for creating new proposals {admin-only}.
* **Comprehensive UI Component Library:** A reusable set of UI components (e.g., buttons, inputs, dialogs, etc.) located in the `components/ui` directory.
* **Smart Contract Integration:**  Integration with a smart contract (inferred from `abi.json` and `contract.ts`).


## Installation

This project uses npm and requires Node.js version 18.18.0 or higher.  To install, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rahulhanje/ChainDemocracy-FE.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   ```bash
   cp .env.example
   ```

## Usage

After installation, start the development server:

```bash
npm run dev
```

This will start the Next.js development server, allowing you to access the application in your browser.  You can then navigate to the different sections of the application (Dashboard, Proposals, About, How It Works).

## Contact Information

Please contact the project maintainers for any questions or issues:

* **Email:**  rahulhanje0.7@gmail.com
* **Website:** https://rahulhanje.vercel.app/


