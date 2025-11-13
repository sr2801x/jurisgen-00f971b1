import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, FileText, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Your AI Compliance Assistant
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto">
            Simplify legal compliance for startups, SMEs, and legal teams. Get personalized compliance
            checklists powered by AI in minutes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              Get My Compliance Checklist
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything You Need for Compliance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="AI-Powered Analysis"
              description="Get personalized compliance requirements based on your company type, state, and industry."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Comprehensive Checklists"
              description="Detailed checklists covering registrations, filings, labor laws, tax, and more."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-primary" />}
              title="Document Generation"
              description="Generate essential legal documents like NDAs, employment agreements, and privacy policies."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-primary" />}
              title="Smart Reminders"
              description="Never miss a deadline with our intelligent reminder system for filings and renewals."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-accent-foreground mb-4">
            Ready to Simplify Your Compliance?
          </h2>
          <p className="text-lg text-accent-foreground/80 mb-8">
            Join startups and legal teams who trust our AI-powered platform
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-elevated transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;
