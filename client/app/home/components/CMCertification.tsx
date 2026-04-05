import Link from "next/link"
import Certificate from '@/assets/images/certificate.png'
import Image from "next/image"

const CMCertification = () => {
    return (
        <section className="bg-[#f6fbf8] py-24">
            <div className="mx-auto max-w-7xl px-6">

                <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

                    {/* LEFT CONTENT */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-semibold text-[#0b6b2a] leading-tight">
                            Get Certified <br /> Boost Your Career
                        </h2>

                        <p className="mt-4 text-base md:text-lg text-[#355e4a] max-w-xl">
                            Join our <span className="font-semibold text-[#0d8f44]">CM Certification</span> crash course and gain industry-recognized credentials from our empaneled institute.
                        </p>

                        {/* FEATURES */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-[#1f4431]">
                                <span className="h-2 w-2 rounded-full bg-[#0d8f44]" />
                                Industry-recognized certification
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#1f4431]">
                                <span className="h-2 w-2 rounded-full bg-[#0d8f44]" />
                                Fast-track crash course
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#1f4431]">
                                <span className="h-2 w-2 rounded-full bg-[#0d8f44]" />
                                Learn from experienced mentors
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
                                Learn More
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
                                    CM Certification
                                </h3>

                                <p className="mt-2 text-sm text-[#355e4a]">
                                    Validate your skills and stand out in the competitive market with a trusted certification.
                                </p>

                                <div className="mt-6 w-full rounded-xl bg-[#f6fbf8] p-4 text-sm text-[#1f4431]">
                                    Duration: 4 Weeks <br />
                                    Mode: Online <br />
                                    Certificate: Included
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default CMCertification