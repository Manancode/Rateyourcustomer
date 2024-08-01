// Import Mantine styles
import '@mantine/core/styles.css';
// Import Tailwind CSS styles
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'RateyourClient',
  description: 'I have followed setup instructions carefully',
};

// Create the Mantine theme with your custom font
const theme = {
  fontFamily: 'Poppins, sans-serif', // or your desired font
  primaryColor: 'cyan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
