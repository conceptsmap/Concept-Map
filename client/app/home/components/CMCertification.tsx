import Link from "next/link"
import Certificate from '@/assets/images/certificate.png'
import Image from "next/image"



const CMCertification = () => {
    return (
        <section className="mt-12">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-[#0b6b2a]/15 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm md:text-base text-[#1f4431] flex items-center gap-3">
                        <Image src={Certificate} height={80} width={80} alt="CM Certification" />
                        Join our <b>CM Certification</b> crash course and get certified by our empaneled institute.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex w-fit rounded-full bg-[#0d8f44] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b6b2a]"
                    >
                        Enroll Now
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CMCertification