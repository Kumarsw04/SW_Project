import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import './LandingPage.css';

type LandingPageProps = {
  onGetStarted: () => void;
};

const features = [
  {
    icon: Activity,
    title: 'Real-time energy monitoring',
    description:
      'Understand electricity consumption across your home and connected buildings.',
    number: '01',
  },
  {
    icon: BarChart3,
    title: 'Smart forecasting',
    description:
      'Explore usage patterns and forecast your upcoming electricity expenses.',
    number: '02',
  },
  {
    icon: Zap,
    title: 'Bill intelligence',
    description:
      'Understand your bills, track charges and identify unusual consumption.',
    number: '03',
  },
  {
    icon: ShieldCheck,
    title: 'Connected energy insights',
    description:
      'Bring your energy information together in one clear, organized workspace.',
    number: '04',
  },
];

export default function LandingPage({
  onGetStarted,
}: LandingPageProps) {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <a className="landing-brand" href="#home" aria-label="SWYTCHO home">
          <span className="brand-icon">
            <Zap size={22} fill="currentColor" />
          </span>
          <span>SWYTCHO</span>
        </a>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>

        <div className="landing-nav-actions">
          <button
            className="landing-signin"
            onClick={onGetStarted}
            type="button"
          >
            Sign in
          </button>
          <button
            className="landing-primary landing-nav-cta"
            onClick={onGetStarted}
            type="button"
          >
            Get started <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="status-dot" />
              A smarter way to manage energy
            </div>

            <h1>
              Understand your energy.
              <span> Control what comes next.</span>
            </h1>

            <p className="hero-description">
              SWYTCHO brings energy monitoring, bill intelligence and
              consumption forecasting together in one simple workspace.
            </p>

            <div className="hero-actions">
              <button
                className="landing-primary landing-hero-cta"
                onClick={onGetStarted}
                type="button"
              >
                Explore SWYTCHO <ArrowRight size={18} />
              </button>
              <a className="landing-secondary" href="#features">
                Discover features <ChevronRight size={17} />
              </a>
            </div>

            <div className="hero-note">
              <CheckCircle2 size={16} />
              <span>Energy insights, organized in one place.</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Energy dashboard preview">
            <div className="visual-glow" />
            <div className="preview-window">
              <div className="preview-topbar">
                <div className="preview-brand">
                  <Zap size={16} fill="currentColor" />
                  <span>SWYTCHO</span>
                </div>
                <span className="preview-live">
                  <span className="status-dot" /> Overview
                </span>
              </div>

              <div className="preview-heading">
                <div>
                  <span className="preview-muted">YOUR ENERGY</span>
                  <h3>Energy overview</h3>
                </div>
                <span className="preview-period">This month⌄</span>
              </div>

              <div className="preview-metrics">
                <div className="preview-metric">
                  <span>Energy consumed</span>
                  <strong>284 <small>kWh</small></strong>
                  <span className="metric-positive">Usage overview</span>
                </div>
                <div className="preview-metric">
                  <span>Estimated bill</span>
                  <strong>₹2,460</strong>
                  <span className="metric-neutral">Monthly forecast</span>
                </div>
              </div>

              <div className="preview-chart-card">
                <div className="preview-chart-heading">
                  <span>Consumption trend</span>
                  <span className="chart-legend">
                    <span /> Energy
                  </span>
                </div>
                <div className="preview-chart">
                  <div className="chart-grid">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <svg
                    viewBox="0 0 460 142"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Illustrative energy consumption trend"
                  >
                    <defs>
                      <linearGradient id="energy-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#35D399" stopOpacity=".28" />
                        <stop offset="100%" stopColor="#35D399" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 112 C25 103 32 83 58 91 S95 111 120 76 S160 93 184 63 S222 79 250 48 S290 80 318 53 S352 62 380 30 S424 51 460 13 L460 142 L0 142 Z"
                      fill="url(#energy-fill)"
                    />
                    <path
                      d="M0 112 C25 103 32 83 58 91 S95 111 120 76 S160 93 184 63 S222 79 250 48 S290 80 318 53 S352 62 380 30 S424 51 460 13"
                      fill="none"
                      stroke="#35D399"
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle cx="380" cy="30" r="4" fill="#35D399" />
                  </svg>
                </div>
                <div className="preview-chart-labels">
                  <span>Week 1</span><span>Week 2</span>
                  <span>Week 3</span><span>Week 4</span>
                </div>
              </div>

              <div className="preview-bottom">
                <span><span className="status-dot" /> Energy insights at a glance</span>
                <Sparkles size={17} />
              </div>
            </div>

            <div className="floating-insight">
              <span className="floating-icon"><Leaf size={18} /></span>
              <div>
                <strong>Make informed decisions</strong>
                <span>Understand your energy patterns</span>
              </div>
              <ArrowUpRight size={17} />
            </div>
          </div>
        </section>

        <section className="landing-intro" id="about">
          <div>
            <span className="section-eyebrow">ENERGY, MADE CLEAR</span>
            <h2>Everything connected.<br />Nothing complicated.</h2>
          </div>
          <p>
            From everyday electricity usage to monthly bill estimates,
            SWYTCHO helps turn energy data into information you can actually
            use.
          </p>
        </section>

        <section className="landing-features" id="features">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">WHAT YOU CAN DO</span>
              <h2>Better visibility.<br /><span>Smarter energy decisions.</span></h2>
            </div>
            <p>
              The essential tools to understand consumption, costs and
              what might come next.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.number}>
                  <div className="feature-card-top">
                    <span className="feature-icon"><Icon size={21} /></span>
                    <span className="feature-number">{feature.number}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href="#how-it-works" aria-label={`Learn about ${feature.title}`}>
                    Explore feature <ArrowUpRight size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-how" id="how-it-works">
          <div className="how-icon"><Building2 size={25} /></div>
          <div className="how-copy">
            <span className="section-eyebrow">ONE WORKSPACE</span>
            <h2>Your energy information,<br />all in one place.</h2>
            <p>
              Review consumption, understand bills and explore forecasts
              through a single dashboard designed to make complex data easier
              to understand.
            </p>
          </div>
          <button
            className="landing-primary how-cta"
            onClick={onGetStarted}
            type="button"
          >
            Open dashboard <ArrowRight size={17} />
          </button>
        </section>

        <section className="landing-final-cta">
          <div className="final-cta-glow" />
          <span className="section-eyebrow">YOUR ENERGY, YOUR VIEW</span>
          <h2>Ready to see the bigger picture?</h2>
          <p>Bring your energy information into focus with SWYTCHO.</p>
          <button
            className="landing-primary"
            onClick={onGetStarted}
            type="button"
          >
            Get started <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="landing-brand" href="#home">
          <span className="brand-icon"><Zap size={19} fill="currentColor" /></span>
          <span>SWYTCHO</span>
        </a>
        <span>Smarter insights for a more informed energy future.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}