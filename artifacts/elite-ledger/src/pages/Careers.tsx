import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Careers() {
  const benefits = [
    { icon: "💰", title: "Financial Incentives", desc: "Above the industry's average, top-notch remuneration package. We recognize and reward high performance with several bonus schemes and incentives." },
    { icon: "📈", title: "Personal Growth", desc: "Education, Learning, Training and Development, Team building events with Career growth opportunities and Mentorships." },
    { icon: "🏥", title: "Wellbeing & Care", desc: "Medical Insurance, Benefit Card, Health & Wellness to support work-life balance." },
    { icon: "🎉", title: "Community Life", desc: "Company parties twice a year, quarterly team outings to cultivate bonding and stay vital." },
    { icon: "🏢", title: "Friendly Office Life", desc: "Healthy snacks, Beverages and Parking allowance." },
    { icon: "👨‍👩‍👧‍👦", title: "Family & Care", desc: "21 Annual Leave Days, Paid Sick Leave Days, Parental Leave, Study Leave and Compassionate Leave." },
  ];

  const openings = [
    { title: "Senior Quantitative Analyst", department: "Trading", location: "London, UK", type: "Full-time" },
    { title: "Full Stack Developer", department: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Risk Management Specialist", department: "Compliance", location: "Dubai, UAE", type: "Full-time" },
    { title: "Client Relations Manager", department: "Support", location: "London, UK", type: "Full-time" },
    { title: "UI/UX Designer", department: "Product", location: "Remote", type: "Contract" },
    { title: "Content Marketing Manager", department: "Marketing", location: "London, UK", type: "Full-time" },
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
                  <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 shrink-0">
                    <Link href="/contact">Apply Now</Link>
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
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg">
            <Link href="/contact">Send Your CV</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
