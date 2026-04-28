# Hotel Booking Management — Frontend

React 19 + TypeScript SPA for hotel booking, built with Vite and Apollo Client.

## Tech Stack

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| React | ^19.1.0 | UI library |
| React DOM | ^19.1.0 | DOM rendering |
| TypeScript | ~5.8.3 | Type safety |
| Vite | ^7.0.4 | Build tool & dev server |
| @vitejs/plugin-react | ^4.6.0 | React fast refresh |

### Routing
| Package | Version | Purpose |
|---------|---------|---------|
| React Router | ^7.6.3 | Client-side routing |

### Data Fetching
| Package | Version | Purpose |
|---------|---------|---------|
| @apollo/client | ^3.13.8 | GraphQL client |
| graphql | ^16.11.0 | GraphQL runtime |
| graphql-ws | ^6.0.8 | WebSocket subscriptions |

### UI
| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | ^4.1.11 | Utility-first styling |
| @tailwindcss/vite | ^4.1.11 | Tailwind Vite integration |
| Radix UI | ^1.4.3 | Headless UI primitives |
| Recharts | ^3.8.0 | Charting |
| Lucide React | ^0.525.0 | Icons |
| Next Themes | ^0.4.6 | Dark/light mode |
| Class Variance Authority | ^0.7.1 | Component variants |
| Tailwind Merge | ^3.3.1 | Class merging |
| Embla Carousel | ^8.6.0 | Carousel component |
| React Day Picker | ^9.14.0 | Date picker |
| React Star Ratings | ^2.3.0 | Rating display |

### Forms
| Package | Version | Purpose |
|---------|---------|---------|
| React Hook Form | ^7.70.0 | Form state management |
| @hookform/resolvers | ^5.2.2 | Validation resolvers |
| Zod | ^4.3.5 | Schema validation |

### Tables
| Package | Version | Purpose |
|---------|---------|---------|
| @tanstack/react-table | ^8.21.3 | Headless table logic |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| Sonner | ^2.0.7 | Toast notifications |
| Date Fns | ^4.1.0 | Date formatting |
| jsPDF | ^4.2.1 | PDF generation |
| html2canvas-pro | ^2.0.2 | Canvas rendering |
| React Paginate | ^8.3.0 | Pagination |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Client (SPA)                   │
│                                                  │
│  React Router ──► Lazy-loaded Pages             │
│       │                                          │
│  ┌────┴─────────────────────────────┐           │
│  │         UI Layer                  │           │
│  │  Radix UI + Tailwind CSS          │           │
│  │  TanStack Table, Recharts        │           │
│  └────────────┬────────────────────┘           │
│               │                                  │
│  ┌────────────┴────────────────────┐           │
│  │      Data Layer (Apollo)         │           │
│  │  Queries / Mutations / Cache     │           │
│  │  GraphQL Subscriptions (WS)      │           │
│  └────────────┬────────────────────┘           │
│               │                                  │
│  ┌────────────┴────────────────────┐           │
│  │      Form Layer                  │           │
│  │  React Hook Form + Zod           │           │
│  └─────────────────────────────────┘           │
│                                                  │
│  ┌─────────────────────────────────┐           │
│  │      Utilities & Types           │           │
│  │  Custom Hooks, Helpers, Types   │           │
│  └─────────────────────────────────┘           │
└──────────────────────┬──────────────────────────┘
                       │ HTTP/GraphQL + WebSocket
                       ▼
              ┌──────────────┐
              │   Server     │
              │  (Express)   │
              └──────────────┘
```

### Key Architectural Decisions
- **Apollo Client** with reactive variables for auth state (`isAuthenticatedVar`, `userInfoVar`)
- **Cookie-based auth** — `credentials: "include"` on HTTP and WebSocket links, no token storage in JS
- **Lazy-loaded routes** via React Router for smaller initial bundle
- **Component-driven UI** using Radix primitives styled with Tailwind CSS

---

## Project Folder Structure

```
client/
├── public/                  # Static assets
├── src/
│   ├── apollo/             # Apollo Client setup
│   │   ├── apolloClient.ts # Client config (HTTP + WS links)
│   │   └── apollo-vars.ts  # Reactive variables (auth state)
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable components
│   │   ├── admin/          # Admin-specific components
│   │   ├── booking/        # Booking-related components
│   │   ├── buffet/         # Buffet components
│   │   ├── common/         # Shared components
│   │   ├── home/           # Homepage components
│   │   ├── invoice/        # Invoice components
│   │   ├── layout/         # Layout components (sidebar, navbar)
│   │   ├── pages/          # Page-level components
│   │   ├── profile/        # User profile components
│   │   ├── review/         # Review components
│   │   ├── room/           # Room-related components
│   │   └── ui/             # Base UI primitives (sonner, buttons, etc.)
│   ├── data/               # Static data / constants
│   ├── graphql/            # GraphQL operations
│   │   ├── mutations/      # GraphQL mutations
│   │   ├── queries/       # GraphQL queries
│   │   └── subscriptions/  # GraphQL subscriptions
│   ├── lib/                # Utility libraries
│   │   └── __tests__/      # Tests for lib utilities
│   ├── schema/             # GraphQL schema types
│   │   └── __tests__/      # Tests for schema
│   ├── test/               # Test setup and helpers
│   ├── types/              # Shared TypeScript types
│   ├── main.tsx            # Entry point (renders app, toaster)
│   └── App.tsx             # Root component (router, providers)
├── .env                    # Environment variables (VITE_*)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.x        # (if applicable)
```

---

## Security

### Authentication
- **Cookie-based sessions** — auth tokens are stored in HTTP-only cookies set by the server
- Apollo Client sends credentials with every request: `credentials: "include"` on both HTTP and WebSocket links
- No access to auth tokens from JavaScript (mitigates XSS token theft)

### Environment Variables
- All client config uses `VITE_` prefixed variables (exposed at build time by Vite):
  - `VITE_SERVER_URL` — GraphQL HTTP endpoint
  - `VITE_GRAPHQL_WS` — GraphQL WebSocket endpoint
- `.env` file is gitignored; never commit secrets

### Apollo Client Security Config
```typescript
// apolloClient.ts
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_SERVER_URL,
  credentials: "include", // sends cookies with every request
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GRAPHQL_WS,
    connectionParams: { credentials: "include" },
  })
);
```

### Auth State
- Managed via Apollo reactive variables (`apollo-vars.ts`)
- `isAuthenticatedVar` — boolean auth state
- `userInfoVar` — current user info
- `isLoadingVar` — loading state during auth checks

---

## Error Handling

### Toast Notifications
- **Sonner** (`sonner`) provides toast feedback for user actions
- Toaster rendered in `main.tsx`
- Used per-mutation via Apollo's `onError` / `onCompleted` callbacks:

```typescript
// Example pattern used across components
const [mutate] = useMutation(MUTATION, {
  onCompleted: () => toast.success("Operation successful"),
  onError: (err) => toast.error(err.message || "Something went wrong"),
});
```

### Apollo Client
- No global error link — errors are handled at the component/mutation level
- Each mutation/query specifies its own error handling via callbacks

### Recommendations (Not Yet Implemented)
- Add a **React Error Boundary** to catch rendering errors gracefully
- Add a **global Apollo error link** to handle network/auth errors consistently
- Add **form-level error display** beyond toasts for inline validation feedback
