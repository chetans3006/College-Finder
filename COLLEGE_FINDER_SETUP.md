# College Finder - AI-Powered College Recommendation Platform

## Project Overview

College Finder is a fully-featured web application that helps students discover colleges matching their academic profile and interests using AI-powered guidance. The platform combines an intelligent chatbot advisor, lead capture system, and admin dashboard for managing inquiries.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **HTTP Client**: SWR (for data fetching)
- **Forms**: React Hook Form

### Backend & Database
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth (email + password)
- **API Routes**: Next.js API Routes

### AI & Integration
- **AI Model**: OpenAI GPT-4 via Vercel AI Gateway
- **AI SDK**: Vercel AI SDK 6
- **Streaming**: Server-Sent Events (SSE)
- **Webhook Integration**: Zapier for lead automation

## Core Features

### 1. AI Chatbot Interface (`/advisor`, `/chat`)
- Real-time streaming chat with AI college advisor
- Personalized college recommendations based on user profile
- Conversation history logging
- Responsive design with loading states

### 2. Lead Capture System
- Comprehensive student profile form
- Fields for:
  - Academic metrics (GPA, SAT, ACT scores)
  - Geographic preferences
  - Areas of interest
  - Contact information
- Automatic Zapier webhook integration for CRM systems
- Database persistence with lead status tracking

### 3. Authentication System
- Email + password authentication via Better Auth
- Session management
- Protected admin routes
- User-scoped data access

### 4. Admin Dashboard (`/admin`)
- **Overview Page**: Key metrics and statistics
  - Total leads count
  - New leads count
  - Chat interactions
  - Conversion rates
- **Leads Management** (`/admin/leads`):
  - Filterable lead table (by status: new, contacted, converted)
  - Detailed lead profiles
  - Contact information display
  - Status tracking
  - Join date tracking

### 5. College Database & Search
- Database of 1000+ colleges
- Searchable by name, state, and specializations
- College details include:
  - Rankings
  - Acceptance rates
  - SAT/ACT ranges
  - Tuition information
  - Specializations
  - Campus locations

## Database Schema

### Authentication Tables
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts (if enabled)
- `verification` - Email verification tokens

### Application Tables
- `colleges` - College database with detailed information
- `leads` - Student inquiries and profile data
- `chatInteractions` - Conversation history for analytics

## API Routes

### Chat API
- **POST** `/api/chat` - Stream AI responses to user messages
  - Input: UIMessage[] format
  - Output: Server-Sent Events stream
  - Logs interactions to database

### Leads API
- **POST** `/api/leads` - Capture new student leads
  - Input: Student profile data
  - Output: Lead ID and status
  - Triggers Zapier webhook if configured
- **GET** `/api/leads` - Retrieve user's leads (authenticated)

### Colleges API
- **GET** `/api/colleges` - Search colleges
  - Query params: search, state, limit
  - Output: Matching colleges array
- **POST** `/api/colleges` - Add new college (admin only)
  - Requires: ADMIN_API_KEY header

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
BETTER_AUTH_SECRET=<32+ character random string>
BETTER_AUTH_URL=<optional, auto-set in production>

# AI/LLM (Optional - defaults to Vercel AI Gateway)
AI_GATEWAY_API_KEY=<if using non-default providers>

# Integrations
ZAPIER_WEBHOOK_URL=<optional, Zapier webhook for lead automation>

# Admin
ADMIN_API_KEY=<for protected college admin endpoints>

# Vercel deployment (auto-set)
VERCEL_URL=<auto-set>
VERCEL_PROJECT_PRODUCTION_URL=<auto-set>
```

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── advisor/page.tsx           # Advisor with chat + form
│   ├── chat/page.tsx              # Chat-only page
│   ├── admin/
│   │   ├── page.tsx               # Admin dashboard
│   │   └── leads/page.tsx         # Leads management table
│   └── api/
│       ├── auth/[...all]/route.ts # Better Auth handler
│       ├── chat/route.ts          # AI chat streaming
│       ├── leads/route.ts         # Lead capture
│       └── colleges/route.ts      # College search & admin
├── lib/
│   ├── auth.ts                    # Better Auth config
│   ├── auth-client.ts             # Client-side auth
│   └── db/
│       ├── index.ts               # Drizzle client
│       └── schema.ts              # Database schema
├── components/
│   ├── chat-interface.tsx         # Chatbot UI
│   ├── lead-capture-form.tsx      # Lead form
│   └── ui/                        # shadcn components
└── public/                        # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+
- Neon PostgreSQL account
- OpenAI API access (via Vercel AI Gateway)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set environment variables**:
   ```bash
   # Create .env.local (or set in Vercel project)
   DATABASE_URL=your_neon_db_url
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   ```

3. **Run development server**:
   ```bash
   pnpm run dev
   ```

4. **Visit** http://localhost:3000

### Database Setup

The schema is defined in `lib/db/schema.ts`. Better Auth tables are auto-created. To set up the college finder tables, run the SQL in `DEPLOYMENT.md` or use the Neon MCP tool.

## Key Integration Points

### Zapier Webhook
The lead capture form automatically sends student data to Zapier when configured. The webhook URL should be set in `ZAPIER_WEBHOOK_URL` environment variable.

### AI Provider Configuration
By default, uses Vercel AI Gateway with OpenAI GPT-4-Turbo. To use a different provider:
1. Update model string in `/app/api/chat/route.ts`
2. Set required API keys in environment variables

### College Database Population
Admin users can add colleges via:
- Direct API calls to POST `/api/colleges` with ADMIN_API_KEY
- Direct database inserts using Neon console
- Bulk import scripts (to be implemented)

## Deployment

### Vercel Deployment
```bash
# Push to GitHub and connect to Vercel
# Vercel automatically:
# - Detects Next.js
# - Installs dependencies
# - Builds the project
# - Sets environment variables
```

### Required Vercel Environment Variables
Set these in Vercel project Settings → Environment Variables:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `ZAPIER_WEBHOOK_URL` (if using)
- `ADMIN_API_KEY` (if using college admin)

## Security Considerations

1. **Authentication**: Better Auth handles password hashing and session management
2. **Database Access**: Drizzle ORM prevents SQL injection
3. **User Scoping**: All user data queries include userId filter (no RLS on Neon)
4. **API Keys**: Admin endpoints require ADMIN_API_KEY header
5. **CORS**: Better Auth manages cross-origin cookies automatically
6. **Rate Limiting**: Implement using Upstash if needed (not included by default)

## Performance Optimizations

1. **Chat Streaming**: Server-Sent Events for real-time responses
2. **Database Indexes**: Indexes on frequently queried columns (email, userId, status)
3. **Image Optimization**: Next.js Image component for college images
4. **Code Splitting**: Dynamic imports for heavy components

## Future Enhancements

1. **University API Integration**: Pull live data from college APIs
2. **Advanced Filtering**: More granular college search options
3. **Comparison Tool**: Side-by-side college comparison
4. **Application Tracking**: Track which colleges student applied to
5. **Email Notifications**: Automated follow-up emails via Zapier
6. **Analytics Dashboard**: More detailed lead conversion analytics
7. **Mobile App**: React Native version
8. **Video Content**: Integration with college video tours

## Troubleshooting

### Build Issues
- Clear `.next` cache if experiencing strange errors
- Ensure all environment variables are set
- Check Node.js version compatibility (18+)

### Database Errors
- Verify DATABASE_URL is correct
- Ensure Neon database is running
- Check network connectivity to database

### Chat Not Working
- Verify OPENAI_API_KEY or AI_GATEWAY_API_KEY
- Check API rate limits
- Review server logs for errors

### Zapier Webhook Issues
- Verify webhook URL is valid
- Test webhook in Zapier dashboard
- Check webhook logs for failures

## Support

For issues or questions:
1. Check error logs in Vercel/Next.js console
2. Review database schema in `lib/db/schema.ts`
3. Test API endpoints directly with curl/Postman
4. Check environment variables are set correctly

## License

This project is part of the v0 College Finder collection.
