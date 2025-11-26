# Cloud Computing Project Website

A modern, responsive website showcasing cloud computing services with a Node.js backend for contact form submissions.

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Blue and white color palette with cloud tech aesthetic
- **Navigation**: Smooth navigation bar with mobile hamburger menu
- **Contact Form**: Form validation with JavaScript and backend storage
- **Backend API**: Node.js + Express server for handling form submissions

## Project Structure

```
Cloud Project/
├── index.html          # Home page
├── about.html          # About Cloud Computing
├── services.html       # IaaS, PaaS, SaaS services
├── use-cases.html      # Use cases page
├── contact.html        # Contact page with form
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   └── script.js      # JavaScript for interactivity
├── server.js          # Node.js Express server
├── package.json       # Node.js dependencies
└── data/             # Contact form submissions (created automatically)
```

## Setup Instructions

### Prerequisites

1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Install the LTS version
   - Verify installation by running: `node --version` and `npm --version`

### Installation Steps

1. **Navigate to the project directory**:
   ```bash
   cd "C:\Users\User\Desktop\Cloud Project"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Frontend: Open `index.html` directly in your browser or
   - With server: Visit `http://localhost:3000`

## API Endpoints

### POST /api/contact
Submit a contact form message.

**Request Body:**
```json
{
  "name": "Shams Tahzib",
  "email": "john@example.com",
  "message": "Your message here",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your message has been received successfully!",
  "submissionId": "1234567890"
}
```

### GET /api/submissions
Get all contact form submissions (for admin purposes).

**Response:**
```json
{
  "success": true,
  "count": 5,
  "submissions": [...]
}
```

## Contact Form Validation

- **Name**: Minimum 2 characters, letters and spaces only
- **Email**: Valid email format required
- **Message**: Minimum 10 characters required

## Technologies Used

- HTML5
- CSS3 (Flexbox & Grid)
- JavaScript (ES6+)
- Node.js
- Express.js
- CORS
- Body Parser

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Contact form submissions are stored in `data/submissions.json`
- The `data/` directory is created automatically when the server starts
- CORS is enabled for API requests
- All pages are responsive and optimized for all screen sizes


