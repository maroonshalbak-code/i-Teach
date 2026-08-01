import './globals.css';
import { AuthProvider } from '../lib/AuthContext';

export const metadata = {
  title: 'i-Teach',
  description: 'Learn English vocabulary, pronunciation and quizzes for pre-teens',
  manifest: '/manifest.json',
  themeColor: '#6C63FF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'i-Teach',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#6C63FF" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <div className="max-w-md mx-auto min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
