import { SignIn } from '@clerk/clerk-react';

export function Login() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/signup"
        redirectUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-card shadow-sm",
            headerTitle: "text-2xl font-bold text-center",
            headerSubtitle: "text-muted-foreground text-center",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            formFieldInput: "bg-background border-input",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
      />
    </div>
  );
} 