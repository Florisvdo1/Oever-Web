import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ───
const tokens = {
  bg: "#0A0A0A",
  bgElevated: "#111111",
  bgCard: "#161616",
  bgCardHover: "#1C1C1C",
  gold: "#C4A265",
  goldLight: "#D4B878",
  goldDim: "#8A7345",
  cream: "#F5F0E8",
  creamMuted: "#B8B0A0",
  white: "#FAFAFA",
  textMuted: "#777777",
  border: "#222222",
  borderLight: "#333333",
  accent: "#D4503A",
};

// ─── WADM Artwork Data (rights-safe: titles + links only, no image hotlinking) ───
const wadmArtworks = [
  { id: "694349", title: "Meisje met bloemen", desc: "Young woman wearing a crown of flowers with a bird on her hand", collections: ["Flowers", "Portrait", "Birds"], price: "from €114" },
  { id: "864691", title: "Het meisje met de fijnste kleuren", desc: "Portrait of a girl from Amsterdam in vibrant fine-art colors", collections: ["Portrait", "Digital Art", "Color"], price: "from €130" },
  { id: "826273", title: "Portret van een man", desc: "The tree man — where classic and digital converge with nature", collections: ["Collage", "Nature", "Portrait"], price: "from €112" },
  { id: "857847", title: "Meisje met de vlinders", desc: "Ethereal portrait surrounded by delicate butterflies", collections: ["Butterflies", "Portrait", "Fine-art"], price: "from €130" },
  { id: "858102", title: "Vrouw met rode bloemen", desc: "Woman adorned with striking red florals in a painterly composition", collections: ["Flowers", "Portrait", "Red"], price: "from €147" },
  { id: "863445", title: "Het meisje met de krullen", desc: "Captivating portrait featuring flowing curls and warm tones", collections: ["Portrait", "Warm", "Modern"], price: "from €158" },
  { id: "865201", title: "Meisje in het blauw", desc: "Serene portrait bathed in cool blue hues and soft light", collections: ["Portrait", "Blue", "Serene"], price: "from €156" },
  { id: "860788", title: "De vrouw met de gouden oorbel", desc: "A modern homage to the Dutch Masters — gold, light, and grace", collections: ["Portrait", "Gold", "Classic"], price: "from €174" },
  { id: "859932", title: "Botanisch meisje", desc: "Where feminine beauty and botanical wonder intertwine", collections: ["Botanical", "Portrait", "Nature"], price: "from €180" },
  { id: "861444", title: "Vrouw met de paarse bloemen", desc: "Rich purple florals frame a contemplative feminine portrait", collections: ["Flowers", "Purple", "Portrait"], price: "from €199" },
  { id: "862001", title: "Het meisje met de rozen", desc: "Roses cascade around a delicate, ethereal figure", collections: ["Roses", "Portrait", "Romantic"], price: "from €148" },
  { id: "863999", title: "Zelfportret met vlinders", desc: "Self-portrait interlaced with butterfly motifs", collections: ["Butterflies", "Self-portrait", "Digital Art"], price: "from €136" },
];

const commissionSteps = [
  { num: "01", title: "Inquiry", desc: "Share your vision — a beloved photo, a concept, or an emotion you'd like immortalized." },
  { num: "02", title: "Consultation", desc: "A personal dialogue to refine style, palette, composition, and dimensions." },
  { num: "03", title: "Creation", desc: "Your portrait is meticulously crafted, pixel by pixel, in the Haarlem studio." },
  { num: "04", title: "Reveal & Refinement", desc: "A private preview with up to two revision rounds until perfection." },
  { num: "05", title: "Delivery", desc: "Your final masterpiece, delivered as a museum-grade print or high-res digital file." },
];

const testimonials = [
  { text: "The portrait Floris created of my late grandmother brought tears to my eyes. Every detail was perfect — the light in her eyes, the way her hair fell. It's now the centerpiece of our family home.", author: "Sarah M.", location: "Amsterdam" },
  { text: "Absolutely breathtaking quality. The canvas print from Werk aan de Muur arrived beautifully packaged and the colors are even more vivid in person than on screen.", author: "Koenraad L.", location: "Belgium" },
  { text: "Working with OEVER.ART on a commission was a deeply personal and professional experience. Floris truly listens and translates emotion into art.", author: "Thomas K.", location: "The Hague" },
];

// ─── Utility Hooks ───
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsInView(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isInView];
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Animated Components ───
function FadeIn({ children, delay = 0, direction = "up", className = "", style = {} }) {
  const [ref, isInView] = useInView(0.1);
  const reduced = useReducedMotion();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{
      ...style, opacity: reduced ? 1 : isInView ? 1 : 0,
      transform: reduced ? "none" : isInView ? "translateY(0) translateX(0)" : transforms[direction],
      transition: reduced ? "none" : `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

function GoldLine({ width = "60px", className = "" }) {
  const [ref, isInView] = useInView();
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className={className} style={{
      height: "1px", background: `linear-gradient(90deg, transparent, ${tokens.gold}, transparent)`,
      width: reduced ? width : isInView ? width : "0px",
      transition: reduced ? "none" : "width 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s",
      margin: "0 auto",
    }} />
  );
}

// ─── Section Label ───
function SectionLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ width: "24px", height: "1px", background: tokens.gold }} />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: tokens.gold }}>{label}</span>
    </div>
  );
}

// ─── Navigation ───
function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const links = [
    { label: "Collection", href: "#collection" },
    { label: "Commissions", href: "#commissions" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <>
      <nav role="navigation" aria-label="Main navigation" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${tokens.border}` : "1px solid transparent",
        transition: "all 0.5s ease", padding: "0 clamp(20px, 5vw, 80px)",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? "64px" : "80px", transition: "height 0.5s ease" }}>
          <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); history.replaceState(null, "", "#hero"); }} style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "2px" }} aria-label="OEVER.ART home">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: tokens.cream, letterSpacing: "1px" }}>OEVER</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600, color: tokens.gold }}>.</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", fontWeight: 300, color: tokens.goldDim, letterSpacing: "3px", textTransform: "uppercase" }}>ART</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector(l.href);
                if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); }
                history.replaceState(null, "", l.href);
              }} style={{
                textDecoration: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase",
                color: activeSection === l.href.slice(1) ? tokens.gold : tokens.creamMuted,
                transition: "color 0.3s ease", display: "none",
              }} className="nav-link-desktop">{l.label}</a>
            ))}
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{
              background: "none", border: `1px solid ${tokens.borderLight}`, color: tokens.cream,
              padding: "8px 16px", fontFamily: "'Cormorant Garamond', serif", fontSize: "12px",
              letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
              transition: "border-color 0.3s ease",
            }} className="nav-menu-btn">Menu</button>
          </div>
        </div>
      </nav>
      {/* Mobile/Full-screen Menu */}
      <div role="dialog" aria-modal="true" aria-label="Navigation menu" style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(10,10,10,0.97)", backdropFilter: "blur(40px)",
        opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "all" : "none",
        transition: "opacity 0.4s ease",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0",
      }}>
        <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{
          position: "absolute", top: "24px", right: "24px", background: "none", border: "none",
          color: tokens.creamMuted, fontSize: "32px", cursor: "pointer", fontWeight: 200,
        }}>&times;</button>
        {links.map((l, i) => (
          <a key={l.href} href={l.href} onClick={(e) => {
            e.preventDefault();
            setMobileOpen(false);
            setTimeout(() => {
              const el = document.querySelector(l.href);
              if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); }
              history.replaceState(null, "", l.href);
            }, 350);
          }} style={{
            textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 48px)",
            color: tokens.cream, padding: "16px 0", letterSpacing: "2px",
            opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s`,
          }}>{l.label}</a>
        ))}
        <div style={{ marginTop: "40px", opacity: mobileOpen ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}>
          <a href="https://instagram.com/oever.art" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase",
            color: tokens.goldDim, textDecoration: "none",
          }}>@oever.art</a>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) { .nav-link-desktop { display: inline-block !important; } .nav-menu-btn { display: none !important; } }
        @media (max-width: 767px) { .nav-link-desktop { display: none !important; } .nav-menu-btn { display: inline-block !important; } }
      `}</style>
    </>
  );
}

// ─── Hero Section ───
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);
  const reduced = useReducedMotion();
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "120px 24px 80px",
      background: `radial-gradient(ellipse at 30% 20%, rgba(196,162,101,0.06) 0%, transparent 60%),
                    radial-gradient(ellipse at 70% 80%, rgba(196,162,101,0.04) 0%, transparent 50%),
                    ${tokens.bg}`,
    }}>
      {/* Decorative frame lines */}
      <div style={{ position: "absolute", top: "40px", left: "40px", right: "40px", bottom: "40px", border: `1px solid ${tokens.border}`, pointerEvents: "none", opacity: 0.5 }} className="hero-frame" />
      <div style={{ position: "absolute", top: "48px", left: "48px", right: "48px", bottom: "48px", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "20px", borderTop: `1px solid ${tokens.goldDim}`, borderLeft: `1px solid ${tokens.goldDim}` }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: "20px", height: "20px", borderTop: `1px solid ${tokens.goldDim}`, borderRight: `1px solid ${tokens.goldDim}` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "20px", height: "20px", borderBottom: `1px solid ${tokens.goldDim}`, borderLeft: `1px solid ${tokens.goldDim}` }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "20px", height: "20px", borderBottom: `1px solid ${tokens.goldDim}`, borderRight: `1px solid ${tokens.goldDim}` }} />
      </div>

      <div style={{ textAlign: "center", maxWidth: "900px", position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "6px", textTransform: "uppercase",
          color: tokens.gold, marginBottom: "32px",
          opacity: reduced ? 1 : loaded ? 1 : 0, transform: reduced ? "none" : loaded ? "translateY(0)" : "translateY(20px)",
          transition: reduced ? "none" : "all 1s cubic-bezier(0.22,1,0.36,1) 0.3s",
        }}>Fine Art &middot; Haarlem Studio</div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 8vw, 96px)", fontWeight: 400,
          color: tokens.cream, lineHeight: 1.05, margin: "0 0 8px", letterSpacing: "-1px",
          opacity: reduced ? 1 : loaded ? 1 : 0, transform: reduced ? "none" : loaded ? "translateY(0)" : "translateY(30px)",
          transition: reduced ? "none" : "all 1s cubic-bezier(0.22,1,0.36,1) 0.5s",
        }}>
          Where Classic<br />
          <span style={{ fontStyle: "italic", color: tokens.goldLight }}>Meets</span> Digital
        </h1>

        <div style={{
          width: "60px", height: "1px", background: `linear-gradient(90deg, transparent, ${tokens.gold}, transparent)`,
          margin: "32px auto",
          opacity: reduced ? 1 : loaded ? 1 : 0, transition: reduced ? "none" : "opacity 1s ease 0.8s",
        }} />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px, 2vw, 21px)", lineHeight: 1.7,
          color: tokens.creamMuted, maxWidth: "560px", margin: "0 auto 48px", fontWeight: 300,
          opacity: reduced ? 1 : loaded ? 1 : 0, transform: reduced ? "none" : loaded ? "translateY(0)" : "translateY(20px)",
          transition: reduced ? "none" : "all 1s cubic-bezier(0.22,1,0.36,1) 0.9s",
        }}>
          Hyper-realistic portraits and fine-art prints crafted with obsessive attention to color, composition, and emotion in our Haarlem studio.
        </p>

        <div style={{
          display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
          opacity: reduced ? 1 : loaded ? 1 : 0, transform: reduced ? "none" : loaded ? "translateY(0)" : "translateY(20px)",
          transition: reduced ? "none" : "all 1s cubic-bezier(0.22,1,0.36,1) 1.1s",
        }}>
          <a href="#commissions" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
            color: tokens.bg, background: tokens.gold, padding: "16px 40px", textDecoration: "none",
            transition: "all 0.4s ease",
          }} onMouseEnter={e => { e.target.style.background = tokens.goldLight; }} onMouseLeave={e => { e.target.style.background = tokens.gold; }}>
            Commission a Portrait
          </a>
          <a href="#collection" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
            color: tokens.gold, border: `1px solid ${tokens.goldDim}`, padding: "16px 40px", textDecoration: "none",
            transition: "all 0.4s ease",
          }} onMouseEnter={e => { e.target.style.borderColor = tokens.gold; e.target.style.color = tokens.goldLight; }}
             onMouseLeave={e => { e.target.style.borderColor = tokens.goldDim; e.target.style.color = tokens.gold; }}>
            View Collection
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: reduced ? 1 : loaded ? 0.5 : 0, transition: reduced ? "none" : "opacity 1s ease 1.5s",
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: tokens.textMuted }}>Scroll</span>
        <div style={{ width: "1px", height: "30px", background: `linear-gradient(to bottom, ${tokens.goldDim}, transparent)` }}>
          {!reduced && <div style={{ width: "1px", height: "10px", background: tokens.gold, animation: "scrollPulse 2s infinite" }} />}
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(20px); opacity: 0; } }
        @media (max-width: 600px) { .hero-frame { display: none; } }
      `}</style>
    </section>
  );
}

// ─── Print Collection (WADM Link Cards) ───
function Collection() {
  const [filter, setFilter] = useState("All");
  const allTags = ["All", ...new Set(wadmArtworks.flatMap(a => a.collections))];
  const filtered = filter === "All" ? wadmArtworks : wadmArtworks.filter(a => a.collections.includes(filter));

  return (
    <section id="collection" style={{ padding: "clamp(60px,10vw,140px) clamp(20px,5vw,80px)", background: tokens.bg, position: "relative" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Print Collection" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,5vw,56px)", color: tokens.cream, fontWeight: 400, margin: "0 0 8px", lineHeight: 1.1 }}>
            Art for Your <span style={{ fontStyle: "italic", color: tokens.goldLight }}>Walls</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", color: tokens.creamMuted, maxWidth: "600px", lineHeight: 1.7, margin: "16px 0 0", fontWeight: 300 }}>
            Available as premium prints on canvas, aluminum, acrylic glass, ArtFrame, and more — fulfilled by Werk aan de Muur with free shipping.
          </p>
        </FadeIn>

        <GoldLine width="80px" className="" />

        {/* Filter tags */}
        <FadeIn delay={0.1}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "40px 0 32px", }} role="tablist" aria-label="Filter artworks by collection">
            {allTags.slice(0, 10).map(tag => (
              <button key={tag} role="tab" aria-selected={filter === tag} onClick={() => setFilter(tag)} style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase",
                padding: "8px 20px", cursor: "pointer", transition: "all 0.3s ease",
                background: filter === tag ? tokens.gold : "transparent",
                color: filter === tag ? tokens.bg : tokens.creamMuted,
                border: `1px solid ${filter === tag ? tokens.gold : tokens.borderLight}`,
              }}>{tag}</button>
            ))}
          </div>
        </FadeIn>

        {/* Artwork Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "20px" }}>
          {filtered.map((art, i) => (
            <FadeIn key={art.id} delay={Math.min(i * 0.06, 0.5)}>
              <a href={`https://www.werkaandemuur.nl/nl/werk/${art.title.replace(/\s+/g, '-')}/${art.id}`}
                target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "block" }}
                aria-label={`View "${art.title}" on Werk aan de Muur`}>
                <div className="art-card" style={{
                  background: tokens.bgCard, border: `1px solid ${tokens.border}`, padding: "0", overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)", cursor: "pointer", position: "relative",
                }}>
                  {/* Decorative top — abstract color bar inspired by Dutch palette */}
                  <div style={{
                    height: "200px", position: "relative", overflow: "hidden",
                    background: `linear-gradient(135deg,
                      hsl(${(parseInt(art.id) % 360)}, 20%, 12%) 0%,
                      hsl(${(parseInt(art.id) * 7) % 360}, 25%, 16%) 50%,
                      hsl(${(parseInt(art.id) * 13) % 360}, 18%, 10%) 100%)`,
                  }}>
                    {/* Abstract art placeholder with monogram */}
                    <div style={{
                      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: "12px",
                    }}>
                      <div style={{
                        width: "64px", height: "64px", border: `1px solid ${tokens.goldDim}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Playfair Display', serif", fontSize: "24px", color: tokens.goldDim,
                        fontStyle: "italic",
                      }}>
                        {art.title.charAt(0)}
                      </div>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "3px",
                        textTransform: "uppercase", color: tokens.goldDim,
                      }}>View on WADM</span>
                    </div>
                    {/* Subtle noise texture overlay */}
                    <div style={{ position: "absolute", inset: 0, opacity: 0.3, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }} />
                  </div>

                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: tokens.cream, fontWeight: 400, margin: 0, lineHeight: 1.3, flex: 1 }}>{art.title}</h3>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.gold, whiteSpace: "nowrap", marginLeft: "16px" }}>{art.price}</span>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.textMuted, margin: "0 0 16px", lineHeight: 1.6 }}>{art.desc}</p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {art.collections.map(c => (
                        <span key={c} style={{
                          fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",
                          color: tokens.goldDim, border: `1px solid ${tokens.border}`, padding: "3px 10px",
                        }}>{c}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: tokens.gold }}>View &amp; Order</span>
                      <span style={{ color: tokens.gold, fontSize: "18px", transition: "transform 0.3s ease" }} className="arrow-icon">&rarr;</span>
                    </div>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* Browse all CTA */}
        <FadeIn delay={0.2}>
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <a href="https://www.werkaandemuur.nl/nl/beeldmaker/OEVER-ART/65815" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
              color: tokens.gold, border: `1px solid ${tokens.goldDim}`, padding: "16px 48px", textDecoration: "none",
              display: "inline-block", transition: "all 0.4s ease",
            }} onMouseEnter={e => { e.target.style.background = tokens.gold; e.target.style.color = tokens.bg; }}
               onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = tokens.gold; }}>
              Browse All 36 Works on WADM &rarr;
            </a>
          </div>
        </FadeIn>
      </div>

      <style>{`
        .art-card:hover { border-color: ${tokens.goldDim} !important; transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .art-card:hover .arrow-icon { transform: translateX(4px); }
      `}</style>
    </section>
  );
}

// ─── Commission Section ───
function Commissions() {
  return (
    <section id="commissions" style={{
      padding: "clamp(60px,10vw,140px) clamp(20px,5vw,80px)",
      background: `linear-gradient(180deg, ${tokens.bgElevated} 0%, ${tokens.bg} 100%)`,
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Bespoke Portraits" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,5vw,56px)", color: tokens.cream, fontWeight: 400, margin: "0 0 8px" }}>
            Commission a <span style={{ fontStyle: "italic", color: tokens.goldLight }}>Masterwork</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", color: tokens.creamMuted, maxWidth: "640px", lineHeight: 1.7, margin: "16px 0 0", fontWeight: 300 }}>
            Each portrait is a singular creation — painstakingly composed from your vision, refined through consultation, and delivered as a museum-quality work of art.
          </p>
        </FadeIn>

        <GoldLine width="80px" />

        {/* Process Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "1px", background: tokens.border, margin: "48px 0 60px", border: `1px solid ${tokens.border}` }}>
          {commissionSteps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.08}>
              <div className="step-card" style={{
                padding: "32px 24px", background: tokens.bgCard, transition: "background 0.4s ease", minHeight: "180px",
              }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: tokens.goldDim, fontWeight: 300, display: "block", marginBottom: "16px" }}>{step.num}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: tokens.cream, fontWeight: 400, margin: "0 0 8px" }}>{step.title}</h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.textMuted, margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Pricing */}
        <FadeIn>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px",
          }}>
            {[
              { tier: "Portrait", size: "Single Subject", price: "€ 1.250", features: ["Up to 60×80 cm", "High-res digital file", "One revision round", "4–6 week delivery"] },
              { tier: "Masterpiece", size: "Complex Composition", price: "€ 2.500", features: ["Up to 120×160 cm", "Museum-grade print included", "Two revision rounds", "Personal consultation", "6–10 week delivery"], featured: true },
              { tier: "Legacy", size: "Multi-Subject / Series", price: "On request", features: ["Any dimension", "Multiple prints included", "Unlimited revisions", "Studio visit in Haarlem", "Custom timeline"] },
            ].map((pkg, i) => (
              <FadeIn key={pkg.tier} delay={i * 0.1}>
                <div style={{
                  background: tokens.bgCard, border: `1px solid ${pkg.featured ? tokens.goldDim : tokens.border}`,
                  padding: "40px 32px", position: "relative", overflow: "hidden",
                  transition: "border-color 0.4s ease",
                }} className="pricing-card">
                  {pkg.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${tokens.gold}, transparent)` }} />}
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: tokens.gold }}>{pkg.size}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: tokens.cream, fontWeight: 400, margin: "8px 0" }}>{pkg.tier}</h3>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", color: tokens.goldLight, margin: "16px 0 24px" }}>{pkg.price}</div>
                  {pkg.features.map(f => (
                    <div key={f} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.creamMuted, padding: "8px 0", borderBottom: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: tokens.gold, fontSize: "8px" }}>&#9670;</span> {f}
                    </div>
                  ))}
                  <a href="#contact" style={{
                    display: "block", textAlign: "center", marginTop: "28px", padding: "14px",
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase",
                    color: pkg.featured ? tokens.bg : tokens.gold,
                    background: pkg.featured ? tokens.gold : "transparent",
                    border: `1px solid ${pkg.featured ? tokens.gold : tokens.goldDim}`,
                    textDecoration: "none", transition: "all 0.3s ease",
                  }}>Begin Inquiry</a>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>

      <style>{`
        .step-card:hover { background: ${tokens.bgCardHover} !important; }
        .pricing-card:hover { border-color: ${tokens.goldDim} !important; }
      `}</style>
    </section>
  );
}

// ─── Testimonials ───
function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setActive(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section style={{
      padding: "clamp(60px,10vw,100px) clamp(20px,5vw,80px)",
      background: tokens.bg, borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}`,
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <SectionLabel label="Testimonials" />
          <div style={{ minHeight: "200px", position: "relative" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                position: i === active ? "relative" : "absolute", top: 0, left: 0, right: 0,
                opacity: i === active ? 1 : 0, transition: "opacity 0.8s ease",
                pointerEvents: i === active ? "all" : "none",
              }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 3vw, 24px)", color: tokens.cream, fontWeight: 300, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 24px" }}>
                  "{t.text}"
                </p>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: tokens.gold }}>
                  {t.author} <span style={{ color: tokens.textMuted }}>&middot;</span> <span style={{ color: tokens.textMuted }}>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "32px" }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Testimonial ${i + 1}`} style={{
                width: i === active ? "32px" : "8px", height: "2px", border: "none", cursor: "pointer",
                background: i === active ? tokens.gold : tokens.borderLight, transition: "all 0.4s ease",
              }} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── About ───
function About() {
  return (
    <section id="about" style={{ padding: "clamp(60px,10vw,140px) clamp(20px,5vw,80px)", background: tokens.bgElevated }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "60px", alignItems: "center" }}>
        <FadeIn direction="right">
          <div>
            <SectionLabel label="The Artist" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,5vw,48px)", color: tokens.cream, fontWeight: 400, margin: "0 0 24px", lineHeight: 1.1 }}>
              Floris van de <span style={{ fontStyle: "italic", color: tokens.goldLight }}>Oever</span>
            </h2>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", color: tokens.creamMuted, lineHeight: 1.8, fontWeight: 300, display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ margin: 0 }}>From a childhood spent surrounded by his grandparents' art collection near Artis in Amsterdam, Floris developed an obsessive eye for detail and a deep love for portraiture.</p>
              <p style={{ margin: 0 }}>Today, working from his studio in Haarlem, he merges classical composition with digital precision — creating hyper-realistic portraits where every pixel, every color choice, and every shadow serves the emotional truth of the subject.</p>
              <p style={{ margin: 0 }}>His work explores the themes of feminine beauty, nature, and the interplay between the organic and the digital — always pursuing perfection, never quite satisfied, always pushing further.</p>
            </div>
            <div style={{ display: "flex", gap: "32px", marginTop: "32px", flexWrap: "wrap" }}>
              {[
                { num: "36+", label: "Published Works" },
                { num: "10+", label: "Years Creating" },
                { num: "350k+", label: "Walls Filled via WADM" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: tokens.gold }}>{s.num}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: tokens.textMuted, marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="left" delay={0.2}>
          <div style={{
            aspectRatio: "3/4", background: `linear-gradient(135deg, hsl(35,20%,12%), hsl(25,15%,8%))`,
            border: `1px solid ${tokens.border}`, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: "20px", border: `1px solid ${tokens.goldDim}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", color: tokens.goldDim, fontStyle: "italic", fontWeight: 300 }}>F</div>
              <div style={{ width: "40px", height: "1px", background: tokens.goldDim }} />
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: tokens.goldDim }}>Haarlem Studio</div>
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: 0.15, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Contact Form ───
function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", type: "commission", message: "", budget: "", _gotcha: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => setFormState(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState._gotcha) return; // honeypot
    if (!formState.name || !formState.email || !formState.message) { setError("Please fill in all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) { setError("Please enter a valid email address."); return; }
    setError("");
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("_replyto", formState.email);
      formData.append("inquiryType", formState.type);
      formData.append("budget", formState.budget || "Not specified");
      formData.append("message", formState.message);
      formData.append("_subject", `OEVER.ART Inquiry: ${formState.type} from ${formState.name}`);
      const res = await fetch("https://formspree.io/f/xqedalrr", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
      });
      if (res.ok) { setSubmitted(true); }
      else { const data = await res.json(); setError(data?.errors?.[0]?.message || "Something went wrong. Please email floris@oever.art directly."); }
    } catch (err) {
      setError("Network error. Please email floris@oever.art directly.");
    } finally { setSending(false); }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", background: tokens.bgCard, border: `1px solid ${tokens.border}`,
    color: tokens.cream, fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", outline: "none",
    transition: "border-color 0.3s ease", boxSizing: "border-box",
  };
  const labelStyle = {
    fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
    color: tokens.creamMuted, display: "block", marginBottom: "8px",
  };

  return (
    <section id="contact" style={{ padding: "clamp(60px,10vw,140px) clamp(20px,5vw,80px)", background: tokens.bg }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Get in Touch" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,5vw,48px)", color: tokens.cream, fontWeight: 400, margin: "0 0 16px" }}>
            Start Your <span style={{ fontStyle: "italic", color: tokens.goldLight }}>Journey</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", color: tokens.creamMuted, lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>
            Whether you're commissioning a portrait or have a question about our print collection, we'd love to hear from you.
          </p>
        </FadeIn>

        <GoldLine width="60px" />

        <FadeIn delay={0.15}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "60px 20px", border: `1px solid ${tokens.border}`, marginTop: "40px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: tokens.cream, marginBottom: "12px" }}>Thank You</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: tokens.creamMuted }}>Your inquiry has been received. We'll respond within 48 hours.</p>
            </div>
          ) : (
            <div style={{ marginTop: "40px" }}>
              <form onSubmit={handleSubmit} action="https://formspree.io/f/xqedalrr" method="POST" acceptCharset="UTF-8" style={{ display: "flex", flexDirection: "column", gap: "24px" }} noValidate>
                {/* Honeypot anti-spam — hidden from humans */}
                <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                  <label htmlFor="_gotcha">Do not fill this</label>
                  <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" value={formState._gotcha} onChange={handleChange} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-grid">
                  <div>
                    <label htmlFor="name" style={labelStyle}>Full Name *</label>
                    <input id="name" name="name" type="text" required value={formState.name} onChange={handleChange} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = tokens.goldDim} onBlur={e => e.target.style.borderColor = tokens.border} />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>Email *</label>
                    <input id="email" name="email" type="email" required value={formState.email} onChange={handleChange} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = tokens.goldDim} onBlur={e => e.target.style.borderColor = tokens.border} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-grid">
                  <div>
                    <label htmlFor="type" style={labelStyle}>Inquiry Type</label>
                    <select id="type" name="type" value={formState.type} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                      onFocus={e => e.target.style.borderColor = tokens.goldDim} onBlur={e => e.target.style.borderColor = tokens.border}>
                      <option value="commission" style={{ background: tokens.bgCard }}>Portrait Commission</option>
                      <option value="print" style={{ background: tokens.bgCard }}>Print Inquiry</option>
                      <option value="collaboration" style={{ background: tokens.bgCard }}>Collaboration</option>
                      <option value="other" style={{ background: tokens.bgCard }}>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" style={labelStyle}>Budget Range (Optional)</label>
                    <select id="budget" name="budget" value={formState.budget} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                      onFocus={e => e.target.style.borderColor = tokens.goldDim} onBlur={e => e.target.style.borderColor = tokens.border}>
                      <option value="" style={{ background: tokens.bgCard }}>Select...</option>
                      <option value="under-1000" style={{ background: tokens.bgCard }}>Under €1,000</option>
                      <option value="1000-2500" style={{ background: tokens.bgCard }}>€1,000 – €2,500</option>
                      <option value="2500-5000" style={{ background: tokens.bgCard }}>€2,500 – €5,000</option>
                      <option value="5000+" style={{ background: tokens.bgCard }}>€5,000+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" style={labelStyle}>Your Message *</label>
                  <textarea id="message" name="message" rows={5} required value={formState.message} onChange={handleChange}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                    onFocus={e => e.target.style.borderColor = tokens.goldDim} onBlur={e => e.target.style.borderColor = tokens.border}
                    placeholder="Tell us about your vision, the subject, preferred style, or any details that will help us understand your project..." />
                </div>
                {error && (
                  <div role="alert" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.accent, padding: "12px 16px", border: `1px solid ${tokens.accent}`, background: "rgba(212,80,58,0.08)" }}>
                    {error}
                  </div>
                )}
                <button type="submit" disabled={sending} style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase",
                  color: tokens.bg, background: sending ? tokens.goldDim : tokens.gold, padding: "18px 48px", border: "none", cursor: sending ? "wait" : "pointer",
                  transition: "all 0.4s ease", alignSelf: "flex-start", opacity: sending ? 0.7 : 1,
                }} onMouseEnter={e => { if (!sending) e.target.style.background = tokens.goldLight; }}
                   onMouseLeave={e => { if (!sending) e.target.style.background = tokens.gold; }}>
                  {sending ? "Sending..." : "Send Inquiry"}
                </button>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", color: tokens.textMuted, margin: 0 }}>
                  Or email directly: <a href="mailto:floris@oever.art" style={{ color: tokens.goldDim, textDecoration: "underline" }}>floris@oever.art</a>
                </p>
              </form>
            </div>
          )}
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer style={{ padding: "60px clamp(20px,5vw,80px) 40px", background: tokens.bgElevated, borderTop: `1px solid ${tokens.border}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "40px", marginBottom: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "16px" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: tokens.cream }}>OEVER</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: tokens.gold }}>.</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", fontWeight: 300, color: tokens.goldDim, letterSpacing: "3px", textTransform: "uppercase" }}>ART</span>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.textMuted, lineHeight: 1.6, margin: 0 }}>
              Fine art from Haarlem.<br />Where classic meets digital.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: tokens.gold, marginBottom: "16px" }}>Navigate</h4>
            {["Collection", "Commissions", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.creamMuted, textDecoration: "none", padding: "4px 0", transition: "color 0.3s" }}
                 onMouseEnter={e => e.target.style.color = tokens.gold} onMouseLeave={e => e.target.style.color = tokens.creamMuted}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: tokens.gold, marginBottom: "16px" }}>Connect</h4>
            <a href="https://instagram.com/oever.art" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.creamMuted, textDecoration: "none", padding: "4px 0" }}>Instagram @oever.art</a>
            <a href="mailto:floris@oever.art" style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.creamMuted, textDecoration: "none", padding: "4px 0" }}>floris@oever.art</a>
            <span style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.textMuted, padding: "4px 0" }}>Haarlem, The Netherlands</span>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: tokens.gold, marginBottom: "16px" }}>Shop Prints</h4>
            <a href="https://www.werkaandemuur.nl/nl/beeldmaker/OEVER-ART/65815" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: tokens.creamMuted, textDecoration: "none", padding: "4px 0" }}>Browse on Werk aan de Muur</a>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", color: tokens.textMuted, marginTop: "12px", lineHeight: 1.5 }}>
              Print purchases are fulfilled via Werk aan de Muur. OEVER.ART is an independent creator; WADM does not endorse this website.
            </p>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", color: tokens.textMuted }}>
            &copy; {new Date().getFullYear()} OEVER.ART — All rights reserved.
          </span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", color: tokens.textMuted }}>
            Crafted with precision in Haarlem
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ───
export default function OeverArt() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "collection", "commissions", "about", "contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.3 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: tokens.bg, color: tokens.cream, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 88px; }
        section[id] { scroll-margin-top: 88px; }
        body { background: ${tokens.bg}; overflow-x: hidden; }
        ::selection { background: ${tokens.gold}; color: ${tokens.bg}; }
        :focus-visible { outline: 2px solid ${tokens.gold}; outline-offset: 2px; }
        input::placeholder, textarea::placeholder { color: ${tokens.textMuted}; opacity: 0.6; }
      `}</style>

      {/* Skip to content for accessibility */}
      <a href="#collection" style={{
        position: "absolute", top: "-100px", left: "16px", padding: "12px 24px",
        background: tokens.gold, color: tokens.bg, zIndex: 9999,
        fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", textDecoration: "none",
      }} onFocus={e => e.target.style.top = "16px"} onBlur={e => e.target.style.top = "-100px"}>
        Skip to content
      </a>

      <Nav activeSection={activeSection} />
      <main>
        <Hero />
        <Collection />
        <Commissions />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
