import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Send, CheckCircle } from "lucide-react";
import { useSubmitApplication } from "@workspace/api-client-react";

function ApplicationModal({ position, onClose }: { position: string; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const submitMutation = useSubmitApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await submitMutation.mutateAsync({ data: { ...formData, position } });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#14161c] border border-white/10 rounded-2xl p-8 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for applying for <span className="text-primary font-medium">{position}</span>. Our team will review your application and get back to you.
            </p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-white mb-1">Apply Now</h3>
            <p className="text-muted-foreground mb-6">
              Position: <span className="text-primary font-medium">{position}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Cover Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Tell us about yourself and why you'd be a great fit..."
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
              >
                {submitMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function Careers() {
  const [applyPosition, setApplyPosition] = useState<string | null>(null);

  const benefits = [
    { icon: "💰", title: "Financial Incentives", desc: "Above the industry's average, top-notch remuneration package. We recognize and reward high performance with several bonus schemes and incentives." },
    { icon: "📈", title: "Personal Growth", desc: "Education, Learning, Training and Development, Team building events with Career growth opportunities and Mentorships." },
    { icon: "🏥", title: "Wellbeing & Care", desc: "Medical Insurance, Benefit Card, Health & Wellness to support work-life balance." },
    { icon: "🎉", title: "Community Life", desc: "Company parties twice a year, quarterly team outings to cultivate bonding and stay vital." },
    { icon: "🏢", title: "Friendly Office Life", desc: "Healthy snacks, Beverages and Parking allowance." },
    { icon: "👨‍👩‍👧‍👦", title: "Family & Care", desc: "21 Annual Leave Days, Paid Sick Leave Days, Parental Leave, Study Leave and Compassionate Leave." },
  ];

  const openings = [
    { title: "Senior Quantitative Analyst", department: "Trading", location: "New York, USA", type: "Full-time" },
    { title: "Full Stack Developer", department: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Risk Management Specialist", department: "Compliance", location: "Dubai, UAE", type: "Full-time" },
    { title: "Client Relations Manager", department: "Support", location: "Miami, USA", type: "Full-time" },
    { title: "UI/UX Designer", department: "Product", location: "Remote", type: "Contract" },
    { title: "Content Marketing Manager", department: "Marketing", location: "Paris, France", type: "Full-time" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Careers at Elite Ledger Capital</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join a world-class team of innovators, traders, and technologists who are reshaping the future of global finance.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rounded-2xl overflow-hidden">
                <img src={`${import.meta.env.BASE_URL}images/team-culture.png`} alt="Team at Elite Ledger Capital" className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Why is Elite Ledger Capital great to work for?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Elite Ledger Capital, we value innovative and creative minds to help us build financial products and solutions that can truly change the global financial industry.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We put the customer experience first in everything we do and reward those who share our commitment to make it happen. With amazing employee benefits, direct and open communication, continuous learning opportunities and amazing career growth opportunities, Elite Ledger Capital is an exciting place to work!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Benefits & Perks</h2>
            <p className="text-muted-foreground text-lg">We invest in our people as much as our clients invest with us.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, idx) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 2) * 0.15 }}>
                <Card className="p-8 h-full bg-[#14161c] border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{b.icon}</span>
                    <h3 className="text-xl font-bold text-white">{b.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Open Positions</h2>
            <p className="text-muted-foreground text-lg">Explore our current openings and find the role that fits your expertise.</p>
          </div>
          <div className="space-y-4">
            {openings.map((job, idx) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                  <div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{job.department}</span>
                      <span className="text-white/20">|</span>
                      <span>{job.location}</span>
                      <span className="text-white/20">|</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                    onClick={() => setApplyPosition(job.title)}
                  >
                    Apply Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Can't find a position that suits your needs?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            We are constantly seeking talented individuals to join our dynamic team. If you are a passionate and driven professional who thrives in a fast-paced environment, we encourage you to reach out.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg"
            onClick={() => setApplyPosition("General Application")}
          >
            Send Your CV
          </Button>
        </div>
      </section>

      <Footer />

      {applyPosition && (
        <ApplicationModal position={applyPosition} onClose={() => setApplyPosition(null)} />
      )}
    </div>
  );
}
