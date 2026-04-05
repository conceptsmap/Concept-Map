import Link from "next/link"
import Certificate from '@/assets/images/certificate.png'
import Image from "next/image"

const CMCertification = () => {
    return (
        <section className=" bg-[#f6fbf8] py-32">
            <div className="mx-auto max-w-7xl px-6">

                <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-semibold text-[#0b6b2a] leading-tight">
                            Advance Your Career <br /> with CM Certification
                        </h2>

                        <p className="mt-4 text-base md:text-lg text-[#355e4a] max-w-xl">
                            Enroll in our structured <span className="font-semibold text-[#0d8f44]">CM Certification Program</span> and earn a recognized credential from our empaneled institute, designed to validate your expertise and enhance your professional credibility.
                        </p>

                        {/* FEATURES */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-[#1f4431]">
                                <span className="h-2 w-2 rounded-full bg-[#0d8f44]" />
                                Industry-recognized certification aligned with current standards
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#1f4431]">
                                <span className="h-2 w-2 rounded-full bg-[#0d8f44]" />
                                Accelerated learning through a focused, outcome-driven curriculum
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#1f4431]">
                                <span className="h-2 w-2 rounded-full bg-[#0d8f44]" />
                                Guidance and mentorship from experienced professionals
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-8 flex gap-4">
                            <Link
                                href="/register"
                                className="rounded-full bg-[#0d8f44] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b6b2a]"
                            >
                                Enroll Now
                            </Link>

                            <Link
                                href="/learn-more"
                                className="rounded-full border border-[#0d8f44]/30 px-6 py-3 text-sm font-semibold text-[#0d8f44] hover:bg-[#0d8f44]/10 transition"
                            >
                                View Program Details
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative">
                        <div className="absolute -top-6 -left-6 h-24 w-24 rounded-2xl bg-[#0d8f44]/10" />
                        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-2xl bg-[#0b6b2a]/10" />

                        <div className="relative rounded-3xl border border-[#0b6b2a]/10 bg-white p-8 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <Image
                                    src={Certificate}
                                    height={120}
                                    width={120}
                                    alt="CM Certification"
                                />

                                <h3 className="mt-4 text-xl font-semibold text-[#0b6b2a]">
                                    CM Certification Program
                                </h3>

                                <p className="mt-2 text-sm text-[#355e4a]">
                                    Demonstrate your capabilities with a certification that reflects both practical knowledge and industry relevance.
                                </p>

                                {/* <div className="mt-6 w-full rounded-xl bg-[#f6fbf8] p-4 text-sm text-[#1f4431]">
                                    Duration: 4 Weeks <br />
                                    Delivery Mode: Online <br />
                                    Certification: Included upon completion
                                </div> */}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default CMCertification