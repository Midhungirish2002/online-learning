import { Link } from "react-router-dom";
import { BookOpen, Users, Award, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Rich Course Content",
        description: "Access high-quality courses with video lessons, quizzes, and interactive materials."
    },
    {
        icon: Users,
        title: "Expert Instructors",
        description: "Learn from experienced professionals passionate about sharing their knowledge."
    },
    {
        icon: Award,
        title: "Earn Certificates",
        description: "Complete courses and receive certificates to showcase your achievements."
    },
    {
        icon: TrendingUp,
        title: "Track Progress",
        description: "Monitor your learning journey with detailed analytics and progress tracking."
    }
];

const categories = [
    { name: "Web Development", count: "45+ courses", color: "bg-blue-500" },
    { name: "Data Science", count: "32+ courses", color: "bg-purple-500" },
    { name: "Business", count: "28+ courses", color: "bg-green-500" },
    { name: "Design", count: "38+ courses", color: "bg-pink-500" }
];

const Home = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-3xl" />
                    <div className="absolute top-16 right-0 h-72 w-72 rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-6xl px-6">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-600/20 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                            <Sparkles size={16} />
                            Welcome to Ocean School
                        </div>

                        <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
                            Learn Without Limits
                        </h1>

                        <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                            Discover thousands of courses taught by expert instructors. Build your skills,
                            earn certificates, and advance your career with Ocean School.
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link
                                to="/student/courses"
                                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
                            >
                                Browse Courses
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full border-2 border-slate-300 dark:border-slate-700 px-8 py-3 text-base font-semibold text-slate-900 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Get Started Free
                            </Link>
                        </div>

                        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 mx-auto max-w-3xl">
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">150+</p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Courses</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">50+</p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Instructors</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">10K+</p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Students</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">98%</p>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Why Choose Ocean School
                    </p>
                    <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                        Everything You Need to Succeed
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg"
                        >
                            <div className="mb-4 inline-flex rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3 text-blue-600 dark:text-blue-400">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Explore Categories
                    </p>
                    <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                        Popular Topics to Learn
                    </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to="/student/courses"
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center transition hover:scale-105 hover:shadow-xl"
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 ${category.color}`} />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {category.name}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                {category.count}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
                    <h2 className="text-4xl font-bold">Ready to Start Learning?</h2>
                    <p className="mt-4 text-lg opacity-90">
                        Join thousands of students already learning on Ocean School
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/register"
                            className="rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-slate-100"
                        >
                            Sign Up Now
                        </Link>
                        <Link
                            to="/student/courses"
                            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
                        >
                            Explore Courses
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
