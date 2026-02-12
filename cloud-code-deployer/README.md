# Cloud Code Deployer

A full-stack SaaS application built with Next.js 14+ that allows users to deploy their projects to Vercel and Netlify with ease. Upload ZIP files or connect GitHub repositories to deploy your code to the cloud in just a few clicks.

## 🚀 Features

- **Authentication**: NextAuth.js with GitHub OAuth and email/password support
- **File Upload**: Drag-and-drop ZIP file uploads with Cloudinary storage
- **GitHub Integration**: Deploy directly from GitHub repositories
- **Multi-Platform**: Deploy to both Vercel and Netlify
- **Real-time Status**: Track deployment progress with live status updates
- **Deployment History**: View all past deployments with status badges
- **Modern UI**: Beautiful interface built with TailwindCSS and ShadCN UI
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Modern component library
- **React Hook Form** - Form handling with validation
- **React Dropzone** - File upload interface

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js** - Authentication solution
- **Supabase** - PostgreSQL database
- **Cloudinary** - File storage and management
- **Zod** - Schema validation

### Deployment APIs
- **Vercel API** - Deploy to Vercel platform
- **Netlify API** - Deploy to Netlify platform

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or pnpm
- Git

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloud-code-deployer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables in `.env.local`:

   ```env
   # Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Vercel Deploy API
   VERCEL_TOKEN=your_vercel_token

   # Netlify Deploy API
   NETLIFY_ACCESS_TOKEN=your_netlify_access_token
   ```

4. **Set up Supabase Database**
   
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Get your project URL and API keys from the Supabase dashboard

5. **Set up Cloudinary**
   
   - Create a Cloudinary account
   - Get your cloud name, API key, and API secret from the dashboard

6. **Set up GitHub OAuth**
   
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App with:
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Copy the Client ID and Client Secret

7. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```

8. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
cloud-code-deployer/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/            # Authentication pages
│   │   └── signup/
│   ├── components/            # React components
│   │   └── ui/               # ShadCN UI components
│   └── lib/                  # Utility functions
├── public/                   # Static assets
├── supabase-schema.sql      # Database schema
├── .env.example            # Environment variables template
└── README.md              # Project documentation
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `VERCEL_TOKEN` | Vercel deployment token | ⚠️ |
| `NETLIFY_ACCESS_TOKEN` | Netlify access token | ⚠️ |

⚠️ = Optional for development (mock deployments will be used)

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

### Users Table
- `id` - UUID primary key
- `email` - User email (unique)
- `name` - User display name
- `password` - Hashed password (nullable for OAuth users)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Deployments Table
- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `project_name` - Name of the deployed project
- `platform` - Deployment platform (vercel/netlify)
- `status` - Deployment status (pending/in_progress/success/failed)
- `preview_url` - URL of the deployed application
- `error_message` - Error details if deployment failed
- `source_url` - GitHub URL or Cloudinary file URL
- `source_type` - Source type (github/upload)
- `created_at` - Deployment creation timestamp
- `updated_at` - Last update timestamp

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Add all environment variables in Netlify dashboard
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Deploy!

## 🧪 Development

### Running Tests
```bash
npm run test
# or
pnpm test
```

### Linting
```bash
npm run lint
# or
pnpm lint
```

### Type Checking
```bash
npm run type-check
# or
pnpm type-check
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user account
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Deployment Endpoints
- `POST /api/deploy` - Create new deployment
- `GET /api/deployments` - Get user's deployment history

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/cloud-code-deployer/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Deployment platform
- [Netlify](https://netlify.com/) - Deployment platform
- [ShadCN UI](https://ui.shadcn.com/) - Component library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
