# WordWise Dictionary App

A modern, responsive dictionary application with user authentication, built using Next.js, Tailwind CSS, and the Merriam-Webster Dictionary API.

## ✨ Features

- **Word Lookup**: Search for word definitions, pronunciations, and parts of speech
- **Audio Pronunciation**: Listen to word pronunciations when available
- **User Authentication**: Login and registration system
- **Search History**: Track and manage your search history
- **Favorites**: Save and organize words you want to remember
- **User Dashboard**: View statistics, history, and favorites in one place
- **Word of the Day**: Discover a new word daily to expand your vocabulary
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Light/Dark Mode**: Automatic theme detection based on system preferences
- **Word Categories**: Organize words into custom categories

## 🌐 Live Demo

The application is deployed and accessible at:
- **Production URL**: [https://word-wise-tau.vercel.app](https://word-wise-tau.vercel.app)

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Static type checking
- **NextAuth.js** - Authentication solution
- **Framer Motion** - Animation library
- **Merriam-Webster API** - Dictionary data source
- **LocalStorage** - For client-side data persistence

## 📋 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/benighter/WordWise.git
   cd dictionary-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🚀 Usage

- **Search**: Enter a word in the search box to see its definition
- **Login/Register**: Create an account to save your search history
- **Dashboard**: View your search history, favorites, and statistics
- **Word Categories**: Create custom categories to organize your vocabulary
- **Favorites**: Save words you want to remember for later

## 📤 Deployment to Vercel

This application is configured for easy deployment to Vercel.

### Automatic Deployment (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Configure the following environment variables:
   - `NEXTAUTH_SECRET`: A random string to encrypt tokens
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
5. Click "Deploy"

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   npx vercel
   ```

4. For production deployment:
   ```bash
   npx vercel --prod
   ```

### Recent Deployment

The app has been successfully deployed to:
- **Production**: [https://word-wise-tau.vercel.app](https://word-wise-tau.vercel.app)
- **Dashboard**: [https://vercel.com/benighters-projects/word-wise](https://vercel.com/benighters-projects/word-wise)

## 📊 App Structure

```
dictionary-app/
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # User dashboard
│   │   ├── api/         # API routes including NextAuth
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   ├── ui/          # UI components
│   ├── lib/             # Utility functions and API services
│   │   ├── dictionaryApi.ts   # Dictionary API service
│   │   ├── userDataService.ts # User data management
```

## 🎨 Design & UX Principles

The app follows these design principles:
- **Beautiful and modern UI** with clean design, balanced spacing, and elegant typography
- **Smooth animations and transitions** to enhance interactivity
- **Fully responsive** design that works seamlessly on all screen sizes
- **Interactive elements** with thoughtful user feedback (hover effects, etc.)
- **Full screen utilization** with minimal margins (about 1rem max) for optimal display
- **Accessibility focus** for clarity and ease of use

## 👤 Author

Bennet Nkolele

- GitHub: [Benighter](https://github.com/Benighter)
- LinkedIn: [Bennet Nkolele](https://www.linkedin.com/in/bennet-nkolele-321285249/)
- Portfolio: [My Work](https://react-personal-portfolio-alpha.vercel.app/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Merriam-Webster Dictionary API](https://dictionaryapi.com/) for providing the dictionary data
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [NextAuth.js](https://next-auth.js.org/) for authentication

## 🔐 Environment Variables

This project uses environment variables to store sensitive information like API keys. Create a `.env.local` file in the root directory with the following variables:

```
# Merriam-Webster API
NEXT_PUBLIC_DICTIONARY_API_URL=https://dictionaryapi.com/api/v3/references/sd3/json
DICTIONARY_API_KEY=your-api-key-here

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

> **IMPORTANT**: Never commit your `.env.local` file to version control. It's already added to `.gitignore` to prevent accidental exposure of your API keys.
