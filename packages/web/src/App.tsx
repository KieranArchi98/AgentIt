import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: 'rgb(var(--primary))',
          colorTextOnPrimaryBackground: 'rgb(var(--primary-foreground))',
          colorBackground: 'rgb(var(--background))',
          colorInputBackground: 'rgb(var(--background))',
          colorInputText: 'rgb(var(--foreground))',
          colorTextSecondary: 'rgb(var(--muted-foreground))',
          colorDanger: 'rgb(var(--destructive))',
          borderRadius: 'var(--radius)',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          card: 'bg-background',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-background border border-input hover:bg-accent text-foreground',
          socialButtonsBlockButtonText: 'text-sm font-medium',
          formFieldInput: 'bg-background border-input',
          dividerLine: 'bg-border',
          dividerText: 'text-muted-foreground',
          footerActionLink: 'text-primary hover:text-primary/90',
          formFieldLabel: 'text-foreground',
          identityPreviewText: 'text-foreground',
          identityPreviewEditButton: 'text-primary hover:text-primary/90',
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "blockButton"
        },
      }}
    >
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ClerkProvider>
  );
} 