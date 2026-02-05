import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Shield, Clock, CheckCircle, MessageSquare } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-hero text-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">Campus Voice</span>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20"
            >
              Sign In
            </Button>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Voice,{' '}
            <span className="text-gradient bg-gradient-to-r from-amber-400 to-orange-400">
              Our Priority
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Submit, track, and resolve campus complaints efficiently. We're here to ensure your
            concerns are heard and addressed promptly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gradient-accent text-primary hover:opacity-90 text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-white/30 text-white bg-transparent hover:bg-white/10 text-lg px-8 py-6"
            >
              Student Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures your complaints are handled efficiently and
              transparently
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit</h3>
              <p className="text-muted-foreground">
                Fill out our simple complaint form with all relevant details
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-info/10 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-info" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track</h3>
              <p className="text-muted-foreground">
                Monitor the status of your complaint in real-time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-warning/10 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Review</h3>
              <p className="text-muted-foreground">
                Administrators review and take action on your complaint
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-success/10 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resolve</h3>
              <p className="text-muted-foreground">
                Get notified when your complaint is resolved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complaint Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We handle a wide range of campus-related issues
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Academic Issues', desc: 'Faculty, exams, grades, curriculum' },
              { title: 'Infrastructure', desc: 'Buildings, classrooms, facilities' },
              { title: 'Administrative', desc: 'Fees, documents, services' },
              { title: 'Hostel', desc: 'Accommodation, mess, maintenance' },
              { title: 'Library', desc: 'Resources, timings, services' },
              { title: 'Other', desc: 'Any other campus-related issues' },
            ].map((category) => (
              <div
                key={category.title}
                className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students who have successfully resolved their campus issues through
            our platform.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="gradient-primary text-lg px-8 py-6"
          >
            Create Your Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="gradient-hero text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold">Campus Voice</span>
          </div>
          <p className="text-white/60 text-sm">
            © 2024 Campus Voice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
