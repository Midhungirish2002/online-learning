import {
    Briefcase,
    Download,
    Github,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Send,
    Sparkles
} from "lucide-react";

const services = [
    {
        title: "Web Design",
        description:
            "Crafting clean, conversion-focused interfaces with intentional typography, spacing, and storytelling."
    },
    {
        title: "Frontend Development",
        description:
            "Building responsive, high-performance React applications with reusable components and smooth interactions."
    },
    {
        title: "Brand Websites",
        description:
            "Designing memorable portfolio and business sites that reflect personality and communicate value quickly."
    }
];

const projects = [
    {
        title: "Creator Portfolio",
        category: "Personal Branding",
        summary:
            "A high-contrast portfolio for a visual artist with editorial layouts, fluid sections, and custom motion.",
        stack: "React, Tailwind, Framer Motion"
    },
    {
        title: "E-Learning Redesign",
        category: "EdTech Product",
        summary:
            "A complete student dashboard revamp focused on clarity, engagement, and measurable course completion.",
        stack: "React, Charts, API Integration"
    },
    {
        title: "Studio Launch Site",
        category: "Agency Website",
        summary:
            "A marketing-focused launch site with an animated hero, service storytelling, and lead capture workflow.",
        stack: "Vite, React, SEO Setup"
    }
];

const timeline = [
    {
        period: "2024 - Present",
        role: "Freelance Frontend Developer",
        org: "Independent",
        detail: "Delivering custom websites and portfolios for founders, creators, and small businesses."
    },
    {
        period: "2022 - 2024",
        role: "UI Developer",
        org: "Product Team",
        detail: "Built and maintained reusable interface systems for internal and client-facing products."
    }
];

const Home = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-[#f7f3ea] text-[#191512]">
            <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-[#d1864d]/25 blur-3xl" />
                    <div className="absolute top-16 right-0 h-72 w-72 rounded-full bg-[#4d7350]/20 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-6xl px-6">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2c241e]/20 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5c50]">
                                <Sparkles size={14} />
                                Portfolio
                            </p>

                            <h1 className="font-serif text-5xl leading-[1.05] text-[#201814] sm:text-6xl md:text-7xl">
                                Sumanth-style
                                <br />
                                Portfolio Presence
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5b4e45] sm:text-lg">
                                I design and build polished digital experiences that balance
                                clarity, character, and performance. This is your personal space to
                                showcase work, story, and impact.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <a
                                    href="#projects"
                                    className="rounded-full bg-[#1f1915] px-7 py-3 text-sm font-semibold text-[#f9f5ef] transition hover:bg-[#000000]"
                                >
                                    View Projects
                                </a>
                                <a
                                    href="#contact"
                                    className="rounded-full border border-[#1f1915]/30 px-7 py-3 text-sm font-semibold text-[#1f1915] transition hover:bg-white/70"
                                >
                                    Let&apos;s Talk
                                </a>
                            </div>

                            <div className="mt-10 flex items-center gap-6 text-[#5b4e45]">
                                <a
                                    href="#"
                                    className="transition hover:text-[#1a1511]"
                                    aria-label="GitHub"
                                >
                                    <Github size={18} />
                                </a>
                                <a
                                    href="#"
                                    className="transition hover:text-[#1a1511]"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin size={18} />
                                </a>
                                <a
                                    href="#"
                                    className="transition hover:text-[#1a1511]"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-md">
                            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-[#cf8a4f]/35 via-[#e9dcc5]/70 to-[#5f835f]/30 blur-lg" />
                            <div className="relative rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur">
                                <div className="rounded-3xl border border-[#2d241f]/15 bg-[#f0e6d5] p-8 text-center">
                                    <p className="text-xs uppercase tracking-[0.18em] text-[#735f50]">
                                        Based in
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-[#1e1713]">
                                        Hyderabad, India
                                    </p>
                                    <p className="mt-4 text-sm text-[#5c4f45]">
                                        Open to remote freelance work and full-time frontend roles.
                                    </p>
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                                    <div className="rounded-2xl border border-[#2d241f]/10 bg-white px-3 py-4">
                                        <p className="text-xl font-bold text-[#1f1915]">3+</p>
                                        <p className="text-[11px] uppercase tracking-wide text-[#7d6c5e]">
                                            Years
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-[#2d241f]/10 bg-white px-3 py-4">
                                        <p className="text-xl font-bold text-[#1f1915]">20+</p>
                                        <p className="text-[11px] uppercase tracking-wide text-[#7d6c5e]">
                                            Projects
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-[#2d241f]/10 bg-white px-3 py-4">
                                        <p className="text-xl font-bold text-[#1f1915]">12</p>
                                        <p className="text-[11px] uppercase tracking-wide text-[#7d6c5e]">
                                            Clients
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-16" id="about">
                <div className="grid gap-8 rounded-3xl border border-[#2b221d]/10 bg-white/70 p-8 backdrop-blur lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b6657]">
                            About Me
                        </p>
                        <h2 className="mt-3 font-serif text-3xl leading-tight text-[#1f1915] sm:text-4xl">
                            Building thoughtful interfaces with personality
                        </h2>
                    </div>
                    <div>
                        <p className="text-[#574a41] leading-relaxed">
                            I am a frontend developer focused on crafting premium web experiences. I
                            like strong visual direction, clean structure, and interaction details
                            that feel intentional without being noisy.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {[
                                "React",
                                "JavaScript",
                                "Tailwind CSS",
                                "UI Architecture",
                                "Responsive Design",
                                "API Integration"
                            ].map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full border border-[#2b221d]/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#4f4138]"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-16" id="services">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b6657]">
                            Services
                        </p>
                        <h2 className="mt-2 font-serif text-3xl text-[#1f1915] sm:text-4xl">
                            What I can do for you
                        </h2>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {services.map((item) => (
                        <article
                            key={item.title}
                            className="group rounded-3xl border border-[#2b221d]/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:border-[#2b221d]/25"
                        >
                            <div className="mb-5 inline-flex rounded-2xl bg-[#efe4cd] p-3 text-[#3b2e24]">
                                <Briefcase size={18} />
                            </div>
                            <h3 className="text-lg font-semibold text-[#211914]">{item.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#5c4f45]">
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-16" id="projects">
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b6657]">
                        Projects
                    </p>
                    <h2 className="mt-2 font-serif text-3xl text-[#1f1915] sm:text-4xl">
                        Selected work
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <article
                            key={project.title}
                            className="rounded-3xl border border-[#2b221d]/10 bg-white p-6 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.45)]"
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#876f5e]">
                                {project.category}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-[#1f1915]">
                                {project.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#5b4e45]">
                                {project.summary}
                            </p>
                            <p className="mt-5 text-xs font-medium uppercase tracking-wide text-[#7d685a]">
                                {project.stack}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-16" id="experience">
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b6657]">
                        Experience
                    </p>
                    <h2 className="mt-2 font-serif text-3xl text-[#1f1915] sm:text-4xl">
                        Career timeline
                    </h2>
                </div>

                <div className="space-y-4">
                    {timeline.map((entry) => (
                        <article
                            key={`${entry.period}-${entry.role}`}
                            className="rounded-3xl border border-[#2b221d]/10 bg-white/80 p-6"
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a715f]">
                                {entry.period}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-[#1f1915]">
                                {entry.role}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-[#6a584d]">{entry.org}</p>
                            <p className="mt-3 text-sm leading-relaxed text-[#5a4c42]">
                                {entry.detail}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-20" id="contact">
                <div className="grid gap-8 rounded-3xl border border-[#2b221d]/10 bg-[#1f1915] p-8 text-[#f8f0e2] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#cebba2]">
                            Contact
                        </p>
                        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                            Let&apos;s build something great
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-[#decfb8]">
                            Have a project in mind? Reach out with your idea, timeline, and goals.
                        </p>

                        <div className="mt-8 space-y-3 text-sm text-[#ecdfcb]">
                            <p className="flex items-center gap-2">
                                <Mail size={15} /> youremail@example.com
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone size={15} /> +91 00000 00000
                            </p>
                            <p className="flex items-center gap-2">
                                <MapPin size={15} /> Hyderabad, India
                            </p>
                        </div>
                    </div>

                    <form className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-5">
                        <input
                            type="text"
                            placeholder="Your name"
                            className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm placeholder:text-[#cbb99d] focus:border-[#f4ddbb] focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm placeholder:text-[#cbb99d] focus:border-[#f4ddbb] focus:outline-none"
                        />
                        <textarea
                            rows="4"
                            placeholder="Tell me about your project"
                            className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm placeholder:text-[#cbb99d] focus:border-[#f4ddbb] focus:outline-none"
                        />
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-[#f4ddbb] px-5 py-2.5 text-sm font-semibold text-[#1f1915] transition hover:bg-[#ffe8c7]"
                        >
                            <Send size={15} />
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            <footer className="border-t border-[#2b221d]/10 bg-[#f3ede2] py-7">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-[#5f5248] sm:flex-row sm:text-sm">
                    <p>Copyright {currentYear}. Your Name. All rights reserved.</p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 font-semibold text-[#2b221d] transition hover:text-black"
                    >
                        <Download size={14} />
                        Download Resume
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
