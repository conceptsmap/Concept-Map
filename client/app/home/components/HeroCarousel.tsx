"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
    ChevronLeft, ChevronRight, Search, Star, TrendingUp,
    ShoppingCart, Play, DollarSign, BarChart2, CheckCircle,
    Zap, Shield, Users, Clock, Sparkles, ArrowUpRight, Bell,
} from "lucide-react"
import { useRouter } from "next/navigation"

const INTERVAL = 6000
const TOTAL = 5

export default function HeroCarousel() {
    const router = useRouter()
    const [active, setActive] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => setActive((p) => (p + 1) % TOTAL), INTERVAL)
    }, [])

    // useEffect(() => {
    //     resetTimer()
    //     return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // }, [resetTimer])

    const goTo = (i: number) => { setActive((i + TOTAL) % TOTAL); resetTimer() }

    const slides = [
        {
            eyebrow: "The Creative Marketplace",
            title: ["Find & Sell", "High-Quality", "Scripts"],
            description: "A curated marketplace where elite scriptwriters and top agencies connect, transact, and create together.",
            primaryCta: "Browse Marketplace",
            secondaryCta: "Start Selling",
            visual: <MarketplaceVisual />,
        },
        {
            eyebrow: "How It Works",
            title: ["Start in", "Minutes,", "Not Days"],
            description: "Create your account, shortlist scripts that match your vision, and complete your purchase in a few guided steps.",
            primaryCta: "Get Started",
            secondaryCta: "View Process",
            visual: <OnboardingVisual />,
        },
        {
            eyebrow: "For Buyers",
            title: ["Discover Scripts", "That Drive", "Results"],
            description: "Filter by style, tone, and format. Preview before you buy. Instant access after checkout.",
            primaryCta: "Explore Scripts",
            secondaryCta: "See Categories",
            visual: <BuyerVisual />,
        },
        {
            eyebrow: "For Creators",
            title: ["Monetize", "Your Ideas", "Your Way"],
            description: "Publish scripts, set your pricing, control licensing, and watch your earnings grow through your creator dashboard.",
            primaryCta: "Start Selling",
            secondaryCta: "Creator Guide",
            visual: <CreatorVisual />,
        },
        {
            eyebrow: "Community",
            title: ["Built for", "Creative Teams", "at Scale"],
            description: "Agencies and independent creators trust ConceptsMap for quality scripts, reliable licensing, and fast collaboration.",
            primaryCta: "Join Community",
            secondaryCta: "Read Stories",
            visual: <CommunityVisual />,
        },
    ]

    return (
        <div className="relative w-full overflow-hidden" style={{ background: "#013913" }}>

            {/* ── Layered background ── */}
            <div className="pointer-events-none absolute inset-0">
                {/* Primary green glow — left */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse 65% 70% at 5% 50%, rgba(29,191,115,0.16) 0%, transparent 65%)",
                }} />
                {/* Secondary glow — top right */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse 50% 45% at 95% 10%, rgba(29,191,115,0.07) 0%, transparent 60%)",
                }} />
                {/* Subtle dot grid */}
                <div style={{
                    position: "absolute", inset: 0, opacity: 0.035,
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                }} />
                {/* Large diffuse orb — right panel area */}
                <div style={{
                    position: "absolute", width: 500, height: 500, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(29,191,115,0.09), transparent 70%)",
                    top: "-100px", right: "-50px", filter: "blur(60px)", pointerEvents: "none",
                }} />
                {/* Small accent orb — bottom left */}
                <div style={{
                    position: "absolute", width: 240, height: 240, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(29,191,115,0.07), transparent 70%)",
                    bottom: "5%", left: "25%", filter: "blur(40px)", pointerEvents: "none",
                }} />
            </div>

            {/* ── Slide track ── */}
            <div
                className="flex transition-transform duration-700 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${active * 100}%)` }}
            >
                {slides.map((slide) => (
                    <section
                        key={slide.eyebrow}
                        className="relative w-full flex-none flex"
                        style={{ minHeight: 700, paddingTop: "1.5rem", paddingBottom: "5rem" }}
                    >
                        <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 px-6 md:px-10 items-center">

                            {/* ── LEFT TEXT ── */}
                            <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0">

                                {/* Eyebrow */}
                                <div className="inline-flex items-center gap-2 mb-5">
                                    <div style={{
                                        width: 7, height: 7, borderRadius: "50%",
                                        background: "#1DBF73",
                                        boxShadow: "0 0 0 3px rgba(29,191,115,0.2), 0 0 12px rgba(29,191,115,0.5)",
                                        animation: "pulseGlow 2s ease-in-out infinite",
                                    }} />
                                    <span style={{
                                        fontSize: 11, letterSpacing: "0.14em", fontWeight: 700,
                                        color: "#1DBF73", textTransform: "uppercase" as const,
                                    }}>
                                        {slide.eyebrow}
                                    </span>
                                </div>

                                {/* Title — last line accented green */}
                                <h2 style={{
                                    fontWeight: 900, lineHeight: 1.06,
                                    letterSpacing: "-0.03em", color: "#ffffff",
                                    fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                                }}>
                                    {slide.title.map((line, i) => (
                                        <span key={i} style={{ display: "block" }}>
                                            {i === slide.title.length - 1
                                                ? <span style={{
                                                    color: "transparent",
                                                    backgroundImage: "linear-gradient(90deg,#1DBF73,#10d98a)",
                                                    WebkitBackgroundClip: "text",
                                                    backgroundClip: "text",
                                                }}>{line}</span>
                                                : line}
                                        </span>
                                    ))}
                                </h2>

                                <p style={{
                                    marginTop: "1.25rem",
                                    fontSize: "1.05rem",
                                    lineHeight: 1.75,
                                    color: "rgba(255,255,255,0.58)",
                                    maxWidth: 420,
                                }}>
                                    {slide.description}
                                </p>

                                {/* CTAs */}
                                <div className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start">
                                    <button
                                        onClick={() => router.push("/login")}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 8,
                                            padding: "14px 28px", borderRadius: 14,
                                            background: "linear-gradient(135deg, #1DBF73 0%, #12a862 100%)",
                                            color: "#fff", fontWeight: 800, fontSize: 14,
                                            border: "none", cursor: "pointer",
                                            boxShadow: "0 0 0 1px rgba(29,191,115,0.4), 0 8px 32px rgba(29,191,115,0.35)",
                                            letterSpacing: "-0.01em",
                                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                        }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget as HTMLElement
                                            el.style.transform = "translateY(-2px)"
                                            el.style.boxShadow = "0 0 0 1px rgba(29,191,115,0.5), 0 12px 40px rgba(29,191,115,0.45)"
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget as HTMLElement
                                            el.style.transform = "translateY(0)"
                                            el.style.boxShadow = "0 0 0 1px rgba(29,191,115,0.4), 0 8px 32px rgba(29,191,115,0.35)"
                                        }}
                                    >
                                        {slide.primaryCta}
                                        <ArrowUpRight size={15} />
                                    </button>

                                    <button
                                        onClick={() => router.push("/login")}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 8,
                                            padding: "14px 28px", borderRadius: 14,
                                            background: "rgba(255,255,255,0.05)",
                                            color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 14,
                                            border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
                                            backdropFilter: "blur(16px)",
                                            letterSpacing: "-0.01em",
                                            transition: "background 0.15s ease, border-color 0.15s ease",
                                        }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget as HTMLElement
                                            el.style.background = "rgba(255,255,255,0.09)"
                                            el.style.borderColor = "rgba(255,255,255,0.2)"
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget as HTMLElement
                                            el.style.background = "rgba(255,255,255,0.05)"
                                            el.style.borderColor = "rgba(255,255,255,0.12)"
                                        }}
                                    >
                                        {slide.secondaryCta}
                                    </button>
                                </div>

                                {/* Social proof row */}
                                <div className="mt-10 flex items-center gap-5 justify-center lg:justify-start">
                                    {/* Avatar stack */}
                                    <div className="flex -space-x-2">
                                        {(["#7c3aed", "#db2777", "#d97706", "#059669", "#2563eb"] as const).map((c, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: 32, height: 32, borderRadius: "50%",
                                                    background: c, border: "2px solid #010f06",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: 10, fontWeight: 800, color: "#fff",
                                                }}
                                            >
                                                {["AK", "JM", "SR", "PL", "TK"][i]}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 16 }}>
                                        <div className="flex items-center gap-1 mb-0.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />)}
                                            <span style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginLeft: 4 }}>4.9</span>
                                        </div>
                                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
                                            Trusted by 240+ creators & agencies
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT VISUAL ── */}
                            <div className="relative flex items-center justify-center" style={{ minHeight: 480, paddingLeft: "2rem", paddingRight: "1rem" }}>
                                {slide.visual}
                            </div>

                        </div>
                    </section>
                ))}
            </div>

            {/* ── Navigation arrows ── */}
            {(["left", "right"] as const).map((side) => (
                <button
                    key={side}
                    aria-label={side === "left" ? "Previous slide" : "Next slide"}
                    onClick={() => goTo(side === "left" ? active - 1 : active + 1)}
                    style={{
                        position: "absolute", top: "50%", transform: "translateY(-50%)",
                        [side]: 16, zIndex: 20,
                        width: 42, height: 42, borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backdropFilter: "blur(16px)", color: "#fff", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s",
                    }}
                >
                    {side === "left" ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
                </button>
            ))}

            {/* ── Dot navigation ── */}
            <div style={{
                position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
                display: "flex", alignItems: "center", gap: 8, zIndex: 20,
            }}>
                {Array.from({ length: TOTAL }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        style={{
                            borderRadius: 99, border: "none", cursor: "pointer", padding: 0,
                            transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            width: i === active ? 30 : 8,
                            height: 8,
                            background: i === active ? "#1DBF73" : "rgba(255,255,255,0.2)",
                            boxShadow: i === active ? "0 0 12px rgba(29,191,115,0.7)" : "none",
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   SHARED DESIGN PRIMITIVES
══════════════════════════════════════════════════════ */

/** Main floating glass panel */
function GlassPanel({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 22,
            backdropFilter: "blur(28px)",
            boxShadow: [
                "0 32px 96px rgba(0,0,0,0.6)",
                "0 1px 0 rgba(255,255,255,0.07) inset",
                "0 -1px 0 rgba(0,0,0,0.3) inset",
            ].join(", "),
            overflow: "hidden",
            animation: "panelFloat 5.5s ease-in-out infinite",
            ...style,
        }}>
            {children}
        </div>
    )
}

/** Floating bubble notification card */
function Bubble({ children, style = {}, float = true }: { children: React.ReactNode; style?: React.CSSProperties; float?: boolean }) {
    const isRight = style.right !== undefined
    return (
        <div style={{
            position: "absolute",
            background: "rgba(5,24,14,0.88)",
            border: "1px solid rgba(29,191,115,0.22)",
            borderRadius: 18,
            backdropFilter: "blur(24px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
            padding: "11px 15px",
            zIndex: 10,
            animation: float
                ? isRight
                    ? "floatBubble 3s ease-in-out infinite"
                    : "floatBubbleAlt 3.6s ease-in-out infinite 0.6s"
                : undefined,
            ...style,
        }}>
            {children}
        </div>
    )
}

/** Fake browser window chrome */
function WindowChrome({ title }: { title: string }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.025)",
        }}>
            <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
                ))}
            </div>
            <div style={{
                flex: 1, height: 22, borderRadius: 7,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em" }}>{title}</span>
            </div>
        </div>
    )
}

/** Tab bar */
function TabBar({ tabs, active, onChange }: { tabs: string[]; active: number; onChange: (i: number) => void }) {
    return (
        <div style={{
            display: "flex", gap: 2, padding: "8px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.1)",
        }}>
            {tabs.map((t, i) => (
                <button
                    key={t}
                    onClick={() => onChange(i)}
                    style={{
                        padding: "5px 13px", borderRadius: 9,
                        border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.01em",
                        background: i === active ? "rgba(29,191,115,0.14)" : "transparent",
                        color: i === active ? "#1DBF73" : "rgba(255,255,255,0.35)",
                        transition: "all 0.2s",
                        borderBottom: i === active ? "1px solid rgba(29,191,115,0.35)" : "1px solid transparent",
                    }}
                >
                    {t}
                </button>
            ))}
        </div>
    )
}

/** Small green pill badge */
function Pill({ children, color = "green" }: { children: React.ReactNode; color?: "green" | "amber" | "blue" | "red" }) {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
        green: { bg: "rgba(29,191,115,0.15)", text: "#1DBF73", border: "rgba(29,191,115,0.3)" },
        amber: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", border: "rgba(245,158,11,0.3)" },
        blue: { bg: "rgba(99,102,241,0.15)", text: "#818cf8", border: "rgba(99,102,241,0.3)" },
        red: { bg: "rgba(239,68,68,0.15)", text: "#f87171", border: "rgba(239,68,68,0.3)" },
    }
    const c = colors[color]
    return (
        <span style={{
            fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 99,
            background: c.bg, color: c.text,
            border: `1px solid ${c.border}`,
            letterSpacing: "0.05em", textTransform: "uppercase" as const,
        }}>
            {children}
        </span>
    )
}

/** Icon bubble (small colored square icon container) */
function IconBox({ children, color = "#1DBF73" }: { children: React.ReactNode; color?: string }) {
    return (
        <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: color + "20",
            border: `1px solid ${color}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            {children}
        </div>
    )
}

/** Stat metric card */
function StatCard({ label, value, sub, subColor = "#1DBF73" }: {
    label: string; value: string; sub?: string; subColor?: string
}) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)",
            padding: "10px 12px",
        }}>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginBottom: 4, fontWeight: 500 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em" }}>{value}</p>
            {sub && <p style={{ fontSize: 10, color: subColor, marginTop: 4, fontWeight: 700 }}>{sub}</p>}
        </div>
    )
}

/** Mini bar chart */
function BarChart({ bars, days }: { bars: number[]; days: string[] }) {
    return (
        <>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 52 }}>
                {bars.map((h, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: `${h}%`,
                            borderRadius: "5px 5px 2px 2px",
                            transformOrigin: "bottom",
                            animation: `growBar 0.55s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s both`,
                            background: i === bars.length - 1
                                ? "linear-gradient(180deg, #1DBF73, #12a862)"
                                : `rgba(29,191,115,${0.12 + (h / 300)})`,
                        }}
                    />
                ))}
            </div>
            <div style={{ display: "flex", marginTop: 6 }}>
                {days.map(d => (
                    <span key={d} style={{ flex: 1, textAlign: "center" as const, fontSize: 9, color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                        {d}
                    </span>
                ))}
            </div>
        </>
    )
}

/* ═══════════════════════════════════════════════════════
   SLIDE VISUAL COMPONENTS
══════════════════════════════════════════════════════ */

function MarketplaceVisual() {
    const [tab, setTab] = useState(0)
    const scripts = [
        { title: "Summer Sale Blast", genre: "Horror", price: "$49", rating: 4.9, sales: 128, hot: true },
        { title: "Tech Reveal 2.0", genre: "Action", price: "$79", rating: 4.7, sales: 84 },
        { title: "Emotional Journey", genre: "Romance", price: "$35", rating: 4.8, sales: 210 },
        { title: "Product Drop Hype", genre: "Crime", price: "$65", rating: 4.6, sales: 67 },
    ]
    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 470 }}>
            <GlassPanel style={{ width: "100%" }}>
                <WindowChrome title="conceptsmap.io/marketplace" />
                <TabBar tabs={["Synopsis", "Script", "StoryBoard"]} active={tab} onChange={setTab} />

                <div style={{ padding: "12px 14px 0" }}>
                    {/* Search */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: "rgba(255,255,255,0.05)", borderRadius: 11,
                        border: "1px solid rgba(255,255,255,0.08)", padding: "8px 12px", marginBottom: 10,
                    }}>
                        <Search size={13} color="rgba(255,255,255,0.3)" />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>Search by genre, tone, format…</span>
                    </div>
                    {/* Genre pills */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" as const }}>
                        {["All", "Crime", "Romance", "Horror", "Action"].map((g, i) => (
                            <span key={g} style={{
                                fontSize: 10, fontWeight: 700, padding: "4px 11px", borderRadius: 99,
                                background: i === 0 ? "#1DBF73" : "rgba(255,255,255,0.06)",
                                color: i === 0 ? "#fff" : "rgba(255,255,255,0.45)",
                                border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                                letterSpacing: "0.01em",
                            }}>{g}</span>
                        ))}
                    </div>
                    {/* Script rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingBottom: 14 }}>
                        {scripts.map((s) => (
                            <div key={s.title} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                background: "rgba(255,255,255,0.04)", borderRadius: 13,
                                border: "1px solid rgba(255,255,255,0.07)", padding: "10px 12px",
                            }}>
                                <IconBox color="#1DBF73"><Play size={13} color="#1DBF73" /></IconBox>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.title}</p>
                                        {s.hot && <Pill color="amber">🔥 Hot</Pill>}
                                    </div>
                                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{s.genre} · {s.sales} sales</p>
                                </div>
                                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                                    <p style={{ fontSize: 14, fontWeight: 900, color: "#1DBF73", letterSpacing: "-0.02em" }}>{s.price}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end", marginTop: 2 }}>
                                        <Star size={9} fill="#f59e0b" color="#f59e0b" />
                                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)" }}>{s.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassPanel>

            {/* Bubble: total scripts */}
            <Bubble style={{ top: -22, right: -26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <IconBox color="#1DBF73"><TrendingUp size={14} color="#1DBF73" /></IconBox>
                    <div>
                        <p style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>2,400+</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.42)", fontWeight: 500 }}>Scripts available</p>
                    </div>
                </div>
            </Bubble>

            {/* Bubble: live purchase */}
            <Bubble style={{ bottom: -20, left: -22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconBox color="#10b981"><ShoppingCart size={13} color="#10b981" /></IconBox>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>Just purchased!</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>Summer Sale Blast · $49</p>
                    </div>
                </div>
            </Bubble>
        </div>
    )
}

function OnboardingVisual() {
    const steps = [
        { icon: <Users size={14} />, label: "Create account", sub: "Sign up in seconds", done: true },
        { icon: <Search size={14} />, label: "Browse & shortlist", sub: "Filter to your needs", done: true },
        { icon: <ShoppingCart size={14} />, label: "Purchase & license", sub: "Secure checkout", active: true },
        { icon: <CheckCircle size={14} />, label: "Download & deploy", sub: "Instant campaign ready", done: false },
    ]
    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
            <GlassPanel style={{ width: "100%" }}>
                <WindowChrome title="conceptsmap.io/get-started" />

                <div style={{ padding: "14px 16px 0" }}>
                    {/* Progress bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                            Setup Progress
                        </p>
                        <Pill color="green">75% done</Pill>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden", marginBottom: 18 }}>
                        <div style={{
                            width: "75%", height: "100%", borderRadius: 99,
                            background: "linear-gradient(90deg, #1DBF73, #10d98a, #1dbf8c, #10d98a, #1DBF73)",
                            backgroundSize: "300% auto",
                            boxShadow: "0 0 10px rgba(29,191,115,0.5)",
                            animation: "shimmer 2.2s linear infinite",
                        }} />
                    </div>

                    {/* Step list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
                        {steps.map((s, i) => (
                            <div key={s.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 12,
                                        background: s.done ? "#1DBF73" : s.active ? "rgba(29,191,115,0.1)" : "rgba(255,255,255,0.04)",
                                        border: s.done ? "none" : s.active ? "1.5px solid #1DBF73" : "1px solid rgba(255,255,255,0.08)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: s.done ? "#fff" : s.active ? "#1DBF73" : "rgba(255,255,255,0.2)",
                                        boxShadow: s.active ? "0 0 16px rgba(29,191,115,0.25)" : "none",
                                    }}>
                                        {s.done ? <CheckCircle size={15} /> : s.icon}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div style={{
                                            width: 1, height: 22, marginTop: 3,
                                            background: s.done ? "rgba(29,191,115,0.35)" : "rgba(255,255,255,0.07)",
                                        }} />
                                    )}
                                </div>
                                <div style={{ paddingTop: 9, flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <p style={{
                                            fontSize: 13, fontWeight: 800,
                                            color: s.done ? "#fff" : s.active ? "#1DBF73" : "rgba(255,255,255,0.28)",
                                            letterSpacing: "-0.01em",
                                        }}>{s.label}</p>
                                        {s.active && <Pill color="green">In progress</Pill>}
                                    </div>
                                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", marginTop: 2 }}>{s.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Time badge */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        background: "rgba(29,191,115,0.07)", borderRadius: 12,
                        border: "1px solid rgba(29,191,115,0.14)", padding: "11px 14px", marginBottom: 14,
                    }}>
                        <Clock size={15} color="#1DBF73" />
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                            Avg onboarding: <span style={{ color: "#1DBF73", fontWeight: 800 }}>under 4 minutes</span>
                        </p>
                    </div>
                </div>
            </GlassPanel>

            <Bubble style={{ top: -22, right: -24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconBox color="#1DBF73"><Zap size={14} color="#1DBF73" /></IconBox>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Quick setup</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>No credit card needed</p>
                    </div>
                </div>
            </Bubble>

            <Bubble style={{ bottom: -20, left: -18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconBox color="#10b981"><Shield size={13} color="#10b981" /></IconBox>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>SSL Secured</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>End-to-end encrypted</p>
                    </div>
                </div>
            </Bubble>
        </div>
    )
}

function BuyerVisual() {
    const [tab, setTab] = useState(0)
    const scripts = [
        { title: "The Comeback Story", tone: "Emotional", dur: "30s", match: 98 },
        { title: "Quick Bold Launch", tone: "Urgent", dur: "15s", match: 94 },
        { title: "Luxury Brand Feel", tone: "Refined", dur: "60s", match: 87 },
    ]
    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
            <GlassPanel style={{ width: "100%" }}>
                <WindowChrome title="conceptsmap.io/discover" />
                <TabBar tabs={["Recommended", "Top Rated", "New"]} active={tab} onChange={setTab} />

                <div style={{ padding: "12px 14px 0" }}>
                    {/* Tone filters */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" as const }}>
                        {["Emotional", "Humorous", "Urgent", "Corporate"].map((c, i) => (
                            <span key={c} style={{
                                fontSize: 10, fontWeight: 700, padding: "4px 11px", borderRadius: 99,
                                background: i === 0 ? "rgba(29,191,115,0.15)" : "rgba(255,255,255,0.05)",
                                color: i === 0 ? "#1DBF73" : "rgba(255,255,255,0.4)",
                                border: i === 0 ? "1px solid rgba(29,191,115,0.3)" : "1px solid rgba(255,255,255,0.07)",
                            }}>{c}</span>
                        ))}
                    </div>

                    {/* Script cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 14 }}>
                        {scripts.map((s) => (
                            <div key={s.title} style={{
                                background: "rgba(255,255,255,0.04)", borderRadius: 14,
                                border: "1px solid rgba(255,255,255,0.07)", padding: "12px 14px",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{s.title}</p>
                                        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                            {[s.tone, s.dur].map(t => (
                                                <span key={t} style={{
                                                    fontSize: 9, padding: "3px 8px", borderRadius: 7, fontWeight: 700,
                                                    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)",
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {/* SVG match ring */}
                                    <div style={{ position: "relative", width: 46, height: 46, flexShrink: 0 }}>
                                        <svg width="46" height="46" viewBox="0 0 46 46">
                                            <circle cx="23" cy="23" r="19" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
                                            <circle
                                                cx="23" cy="23" r="19" fill="none"
                                                stroke="#1DBF73" strokeWidth="3" strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 19 * s.match / 100} ${2 * Math.PI * 19}`}
                                                transform="rotate(-90 23 23)"
                                            />
                                        </svg>
                                        <span style={{
                                            position: "absolute", inset: 0, display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: 11, fontWeight: 900, color: "#1DBF73",
                                        }}>{s.match}</span>
                                    </div>
                                </div>
                                {/* Audio preview */}
                                <div style={{
                                    marginTop: 10, display: "flex", alignItems: "center", gap: 8,
                                    background: "rgba(255,255,255,0.04)", borderRadius: 9,
                                    border: "1px solid rgba(255,255,255,0.06)", padding: "7px 10px",
                                }}>
                                    <div style={{
                                        width: 24, height: 24, borderRadius: 7, background: "rgba(29,191,115,0.15)",
                                        border: "1px solid rgba(29,191,115,0.25)",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        <Play size={10} color="#1DBF73" />
                                    </div>
                                    <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
                                        <div style={{ width: `${s.match * 0.35}%`, height: "100%", background: "linear-gradient(90deg,#1DBF73,#10d98a)", borderRadius: 99 }} />
                                    </div>
                                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Preview</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassPanel>

            <Bubble style={{ top: -22, right: -24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconBox color="#f87171"><Sparkles size={13} color="#f87171" /></IconBox>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>AI-matched</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>Personalised picks</p>
                    </div>
                </div>
            </Bubble>

            <Bubble style={{ bottom: -20, left: -20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconBox color="#1DBF73"><Zap size={13} color="#1DBF73" /></IconBox>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Instant access</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>Download after checkout</p>
                    </div>
                </div>
            </Bubble>
        </div>
    )
}

function CreatorVisual() {
    const [tab, setTab] = useState(0)
    const bars = [38, 55, 47, 70, 65, 88, 100]
    const days = ["M", "T", "W", "T", "F", "S", "S"]

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
            <GlassPanel style={{ width: "100%" }}>
                <WindowChrome title="conceptsmap.io/creator/dashboard" />
                <TabBar tabs={["Earnings", "Analytics", "Scripts"]} active={tab} onChange={setTab} />

                <div style={{ padding: "14px 14px 0" }}>
                    {/* Stat row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                        <StatCard label="This week" value="$1,284" sub="↑ 23%" />
                        <StatCard label="Active scripts" value="12" sub="4 featured" />
                        <StatCard label="Avg rating" value="4.9" sub="★ 318 reviews" />
                    </div>

                    {/* Bar chart */}
                    <div style={{
                        background: "rgba(255,255,255,0.03)", borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.07)", padding: "12px 14px", marginBottom: 12,
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
                                DAILY REVENUE
                            </p>
                            <Pill color="green">This week</Pill>
                        </div>
                        <BarChart bars={bars} days={days} />
                    </div>

                    {/* Controls row */}
                    <div style={{ display: "flex", gap: 8, paddingBottom: 14 }}>
                        {[
                            { icon: <Shield size={13} color="#1DBF73" />, label: "Licensing active", accent: true },
                            { icon: <BarChart2 size={13} color="rgba(255,255,255,0.45)" />, label: "Deep analytics", accent: false },
                        ].map(b => (
                            <div key={b.label} style={{
                                flex: 1, display: "flex", alignItems: "center", gap: 8,
                                background: b.accent ? "rgba(29,191,115,0.07)" : "rgba(255,255,255,0.04)",
                                borderRadius: 11, padding: "10px 12px",
                                border: b.accent ? "1px solid rgba(29,191,115,0.18)" : "1px solid rgba(255,255,255,0.07)",
                            }}>
                                {b.icon}
                                <span style={{ fontSize: 11, fontWeight: 700, color: b.accent ? "#1DBF73" : "rgba(255,255,255,0.45)" }}>
                                    {b.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassPanel>

            <Bubble style={{ top: -22, right: -26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <IconBox color="#1DBF73"><DollarSign size={15} color="#1DBF73" /></IconBox>
                    <div>
                        <p style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>$1,284</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Earned this week</p>
                    </div>
                </div>
            </Bubble>

            <Bubble style={{ bottom: -20, left: -20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconBox color="#818cf8"><Bell size={13} color="#818cf8" /></IconBox>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>New sale · $79</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>"Tech Reveal 2.0" just sold</p>
                    </div>
                </div>
            </Bubble>
        </div>
    )
}

function CommunityVisual() {
    const [tab, setTab] = useState(0)
    const members = [
        { initials: "AK", hex: "#7c3aed", name: "Anika K.", role: "Scriptwriter", scripts: 57, badge: true },
        { initials: "JM", hex: "#db2777", name: "James M.", role: "Agency Lead", scripts: 34 },
        { initials: "SR", hex: "#d97706", name: "Sofia R.", role: "Freelancer", scripts: 28 },
    ]

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
            <GlassPanel style={{ width: "100%" }}>
                <WindowChrome title="conceptsmap.io/community" />
                <TabBar tabs={["Top Creators", "Agencies", "Rising"]} active={tab} onChange={setTab} />

                <div style={{ padding: "14px 14px 0" }}>
                    {/* Community banner */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "rgba(29,191,115,0.06)", borderRadius: 14,
                        border: "1px solid rgba(29,191,115,0.14)", padding: "13px 16px", marginBottom: 12,
                    }}>
                        <div>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginBottom: 3, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>
                                Active community
                            </p>
                            <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>
                                840 <span style={{ fontSize: 15, color: "#1DBF73" }}>creators</span>
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 14 }}>
                            {[{ val: "320", sub: "agencies" }, { val: "4.8★", sub: "avg rating" }].map(s => (
                                <div key={s.sub} style={{ textAlign: "center" as const }}>
                                    <p style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{s.val}</p>
                                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
                        {members.map((m, i) => (
                            <div key={m.name} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                background: "rgba(255,255,255,0.04)", borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.07)", padding: "10px 12px",
                            }}>
                                <span style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.22)", width: 18 }}>#{i + 1}</span>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                                    background: m.hex + "25", border: `1px solid ${m.hex}45`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 11, fontWeight: 900, color: m.hex,
                                }}>{m.initials}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <p style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{m.name}</p>
                                        {m.badge && <Pill color="green">Top Creator</Pill>}
                                    </div>
                                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{m.role}</p>
                                </div>
                                <div style={{ textAlign: "right" as const }}>
                                    <p style={{ fontSize: 15, fontWeight: 900, color: "#1DBF73", letterSpacing: "-0.02em" }}>{m.scripts}</p>
                                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>scripts</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingBottom: 14 }}>
                        {[
                            { icon: <CheckCircle size={13} color="#1DBF73" />, title: "Verified creators", sub: "ID & portfolio" },
                            { icon: <Shield size={13} color="#1DBF73" />, title: "Secure licensing", sub: "Every transaction" },
                        ].map(b => (
                            <div key={b.title} style={{
                                display: "flex", alignItems: "center", gap: 8,
                                background: "rgba(29,191,115,0.06)", borderRadius: 11,
                                border: "1px solid rgba(29,191,115,0.13)", padding: "10px 12px",
                            }}>
                                {b.icon}
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{b.title}</p>
                                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>{b.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassPanel>

            <Bubble style={{ top: -22, right: -24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: "#7c3aed25", border: "1px solid #7c3aed45",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 900, color: "#a78bfa",
                    }}>PL</div>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>Priya L. joined!</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>New verified creator</p>
                    </div>
                </div>
            </Bubble>

            <Bubble style={{ bottom: -20, left: -20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <IconBox color="#f59e0b"><DollarSign size={13} color="#f59e0b" /></IconBox>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>$420k+ paid</p>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>To creators this year</p>
                    </div>
                </div>
            </Bubble>
        </div>
    )
}