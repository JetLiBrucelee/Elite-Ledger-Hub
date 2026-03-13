import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-display font-bold text-gradient-gold mb-4">404</div>
        <h1 className="text-3xl font-display font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for may have been moved or does not exist. Return to the homepage or contact our support team for assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="premium">
            <Link href="/">Back to Homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
