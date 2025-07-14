# DeepOrigin URL Shortener

A modern, containerized URL shortening service built with cutting-edge technologies.

## 🚀 Overview

This project is a full-stack URL shortener application developed as part of the DeepOrigin challenge. The application allows users to create shortened URLs, track click analytics, and manage their URLs through an intuitive web interface.

## ⚙️ Challenges covered in this project

### Requirements

✅ Build a React application that allows you enter a URL\
✅ When the form is submitted, return a shortened version of the URL\
✅ Save a record of the shortened URL to a database\
✅ Ensure the slug of the URL (abc123 in the screenshot above) is unique\
✅ When the shortened URL is accessed, redirect to the stored URL\
✅ If an invalid slug is accessed, display a 404 Not Found page\
✅ You should have a list of all URLs saved in the database

### Extra Credit

✅ Add support for accounts so people can view the URLs they have created\
✅ Validate the URL provided is an actual URL\
✅ Display an error message if invalid\
✅ Make it easy to copy the shortened URL to the clipboard\
❌ Allow users to modify the slug of their URL\
✅ Track visits to the shortened URL\
✅ Add rate-limiting to prevent bad-actors\
❌ Add a dashboard showing how popular your URLs are\
✅ Build a Docker image of your application

## 🏗️ Architecture

### Backend (API)

- **Framework**: NestJS with TypeScript
- **ORM**: TypeORM for database interactions
- **Database**: PostgreSQL 17
- **Features**:
  - User authentication (Kind of)
  - URL shortening and redirection
  - Click tracking and analytics
  - Rate limiting protection
  - RESTful API design

### Frontend (App)

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Custom CSS with modern design
- **Features**:
  - Responsive user interface
  - Real-time URL list updates
  - Copy to clipboard functionality
  - Error handling and user feedback

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 17 with persistent storage
- **Networking**: Internal Docker network for service communication
- **Development**: Hot-reload enabled for both frontend and backend

## 🛠️ Technology Stack

| Component     | Technology     | Version |
| ------------- | -------------- | ------- |
| Backend       | NestJS         | Latest  |
| Language      | TypeScript     | Latest  |
| ORM           | TypeORM        | Latest  |
| Database      | PostgreSQL     | 17      |
| Frontend      | React          | 18+     |
| Build Tool    | Vite           | Latest  |
| Container     | Docker         | Latest  |
| Orchestration | Docker Compose | v3.8    |

## 📦 Quick Setup

### Prerequisites

- Docker
- Docker Compose
- Make (optional, for convenience commands)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/lucianostegun/deep-origin-url-shortener.git
   cd deep-origin-url-shortener
   ```

2. **Setup environment files**

   Copy the example environment files:

   ```bash
   # API environment
   cp api/.env.example api/.env

   # App environment
   cp app/.env.example app/.env
   ```

3. **Start the application**

   Run the setup commands from the project root:

   ```bash
   	make create-network
    make build
    make start
    make init-db
   ```

> **Note:** The database setup may fail the first time due to API initialization timing. If this happens, simply run the last command `make init-db` again after waiting a few seconds.

That's it! The application will automatically:

- Build all Docker containers
- Start the PostgreSQL database
- Run database migrations
- Start the API server
- Start the frontend development server

## 🌐 Access Points

Once the setup is complete, you can access:

- **Frontend Application**: [http://localhost](http://localhost)
- **API Endpoints**: [http://localhost:3000](http://localhost:3000)
- **Database**: `localhost:5432` (internal Docker network)

## 🎯 Features

### Core Functionality

- ✅ **URL Shortening**: Convert long URLs into short, shareable links
- ✅ **Direct Redirection**: Access shortened URLs via `/r/{slug}` for instant redirection
- ✅ **Click Analytics**: Track click counts for each shortened URL
- ✅ **User Management**: Multi-user support with individual URL management

### Advanced Features

- ✅ **Rate Limiting**: Prevents abuse with configurable request limits (10 URLs/minute)
- ✅ **Real-time Updates**: Frontend automatically updates when new URLs are created
- ✅ **Error Handling**: Graceful error handling with user-friendly messages
- ✅ **Responsive Design**: Mobile-friendly interface

### Security & Performance

- ✅ **Authentication Guards**: Protected API endpoints
- ✅ **Input Validation**: Comprehensive DTO validation
- ✅ **Rate Limiting**: Anti-spam protection
- ✅ **Database Indexing**: Optimized database queries

## 🐳 Docker Configuration

### Services

- **app**: React frontend (Port 80 → 5173)
- **api**: NestJS backend (Port 3000 → 3000)
- **database**: PostgreSQL 17 (Port 5432 → 5432)

### Volumes

- Persistent database storage
- Hot-reload for development
- Source code mounting for live updates

## 📁 Project Structure

```
deep-origin-url-shortener/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/          # Authentication modules
│   │   ├── urls/          # URL management
│   │   ├── users/         # User management
│   │   ├── redirect/      # Redirection service
│   │   └── common/        # Shared utilities
│   ├── database/
│   │   ├── migrations/    # Database migrations
│   │   └── seeders/       # Database seeders
│   └── Dockerfile
├── app/                    # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   └── Dockerfile
├── docker/                # Docker configuration
│   ├── api/              # API container setup
│   └── app/              # App container setup
├── docker-compose.yml    # Docker orchestration
├── Makefile              # Development commands
└── README.md
```

## 🔧 Development Commands

### Using Make (Recommended)

```bash
make setup          # Complete setup and start
make start          # Start all services
make stop           # Stop all services
make init-db        # Reset database (losing data!)
make bash           # Enter API bash
```

### Using Docker Compose Directly

```bash
docker-compose up -d          # Start in detached mode
docker-compose down           # Stop services
docker-compose logs -f        # Follow logs
docker-compose ps             # Check service status
```

## 🧪 Testing the Application

### Creating a Shortened URL

1. Open [http://localhost](http://localhost)
2. Select a user from the dropdown
3. Enter a long URL in the input field
4. Click "Short it"
5. Copy the generated short URL

### Testing Redirection

1. Copy a shortened URL (e.g., `http://localhost/r/abc123`)
2. Open it in a new browser tab
3. Verify it redirects to the original URL
4. Check that the click count increases

### Testing Rate Limiting

1. Create 10 URLs quickly with the same user
2. Try to create an 11th URL
3. Observe the rate limiting error message
4. Wait 1 minute and try again

## 📊 API Endpoints

### URL Management

- `GET /urls` - List user's URLs
- `POST /urls` - Create new short URL
- `GET /urls/:id` - Get specific URL
- `PATCH /urls/:publicId` - Update URL
- `DELETE /urls/:id` - Delete URL

### Redirection

- `GET /r/:slug` - Redirect to original URL
- `GET /urls/redirect/:slug` - Get URL data (internal)

### User Management

- `GET /users` - List all users
- `POST /users` - Create new user

## 🛡️ Security Features

### Rate Limiting

- **Limit**: 10 URLs per minute per user
- **Window**: 60 seconds rolling window
- **Storage**: In-memory (Redis recommended for production)
- **Response**: HTTP 429 with retry information

### Authentication

- User-based authentication via headers
- Protected endpoints with guards
- Input validation and sanitization

## 🚀 Production Considerations

### Environment Variables

- Configure database credentials
- Set production URLs
- Enable HTTPS
- Configure Redis for rate limiting

### Scaling

- Use Redis for rate limiting storage
- Implement database connection pooling
- Add load balancing for multiple instances
- Consider CDN for static assets

### Monitoring

- Add application logging
- Implement health checks
- Monitor rate limiting metrics
- Track URL analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the DeepOrigin technical challenge.

## 🙋‍♂️ Support

For questions or issues, please refer to the project documentation or create an issue in the repository.

## 📋 API Testing

For your convenience, we've included an Insomnia collection file in the project root that contains example API calls to test all endpoints.

**File**: `insomnia-collection.json`

### How to use:

1. Install [Insomnia](https://insomnia.rest/) (free API testing tool)
2. Open Insomnia
3. Click "Import" and select the `insomnia-collection.json` file from the project root
4. The collection includes pre-configured requests for:
   - Creating shortened URLs
   - Retrieving URL lists
   - Rate limiting examples

All requests are pre-configured with the correct headers, base URLs, and example payloads to get you started quickly with API testing.
