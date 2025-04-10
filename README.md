# WordWise Dictionary App

A modern, responsive dictionary application with user authentication, built using Next.js, Tailwind CSS, and the Merriam-Webster Dictionary API.

## ✨ Features

- **Word Lookup**: Search for word definitions, pronunciations, and parts of speech
- **Audio Pronunciation**: Listen to word pronunciations when available
- **User Authentication**: Login and registration system
- **Search History**: Track and manage your search history
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Light/Dark Mode**: Automatic theme detection based on system preferences

## 🛠️ Technologies Used

- **Next.js** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Static type checking
- **NextAuth.js** - Authentication solution
- **Framer Motion** - Animation library
- **Merriam-Webster API** - Dictionary data source

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
- **Dashboard**: View your search history and statistics

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
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Environment Variables

Make sure to configure these environment variables in the Vercel dashboard:
- `NEXTAUTH_SECRET`: A random string used for encryption
- `NEXTAUTH_URL`: The base URL of your application

## �� App Structure

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
```

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
