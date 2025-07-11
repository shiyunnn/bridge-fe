# Bridge - Project Management & Resource Allocation Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

Bridge is a comprehensive project management platform that bridges the gap between project planning and execution by automatically converting project requirements into actionable tasks and managing resource allocation with intelligent conflict detection.

## Features

**PRD Input & Processing**: Import requirements directly from Confluence pages or enter them manually with markdown support. The system automatically analyzes content and estimates feature complexity.

**Task Management**: Convert requirements into hierarchical tasks with subtasks, assign team members, track progress with visual indicators, and manage priorities and effort estimates in real-time.

**Gantt Chart Visualization**: Interactive timeline view with drag-and-drop resource allocation, automatic conflict detection, and role-based color coding for different team members.

**Intelligent Notifications**: Stay informed with alerts for estimate changes, leave requests, and resource conflicts with actionable accept/reject options.

## Quick Start

### Prerequisites

- Node.js 18+
- Yarn (recommended) or npm

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd bridge-fe
   ```

2. Install dependencies

   ```bash
   yarn install
   ```

3. Start the development server

   ```bash
   yarn dev
   ```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
yarn build
```

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **UI Framework**: Radix UI primitives + Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **Development**: Tempo for component development

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── home.tsx           # Main application component
│   ├── PRDInputPage.tsx   # Requirements input interface
│   ├── TaskListPage.tsx   # Task management interface
│   ├── GanttChart.tsx     # Timeline visualization
│   ├── NotificationPanel.tsx      # Notifications system
│   └── ConflictDetectionPanel.tsx # Conflict management
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── stories/               # Component stories
```

## Usage

**Input Project Requirements**: Navigate to the PRD Input tab and either paste a Confluence URL or manually enter requirements with markdown formatting. Click "Generate Tasks & Continue" to create tasks automatically.

**Manage Tasks**: Review generated tasks in the Task List tab, edit details, assign team members, add subtasks, and update status and priorities as needed.

**Visualize Timeline**: Switch to the Gantt Chart tab to view the project timeline, drag and drop resource assignments, and identify conflicts that need resolution.

## Configuration

Create a `.env` file in the root directory:

```env
VITE_TEMPO=true  # Enable Tempo development tools
```

For Supabase integration (optional):

```bash
yarn types:supabase
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all components are properly typed
- Add tests for new features
- Update documentation as needed

## Roadmap

- Real-time collaboration features
- Advanced analytics and reporting
- Integration with more project management tools
- Mobile application
- API for third-party integrations
- Advanced resource optimization algorithms

## Support

For support and questions, create an issue in the repository or check the documentation.

---

Built with ❤️ by the We Love Bugs (Bridge) team
