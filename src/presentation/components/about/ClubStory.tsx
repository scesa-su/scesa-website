import Image from "next/image";
import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  FileTextIcon,
  GemIcon,
  GraduationCapIcon,
  HandshakeIcon,
  LightbulbIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/presentation/components/ui/Badge";
import { BODY, H2, H3, ICON_TILE, SECTION, SMALL } from "./styles";

const MISSION_POINTS = [
  "Growing real interest in engineering and IT through meetings, publications, seminars and hands-on sessions.",
  "Backing local innovation and technical talent at Strathmore University.",
  "Keeping students up to date with what is changing in ICT and modern engineering.",
];

const PILLARS: { name: string; text: string; icon: LucideIcon }[] = [
  { name: "Innovation", icon: LightbulbIcon, text: "We give students room to try ideas, build them and put them in front of real users." },
  { name: "Collaboration", icon: UsersIcon, text: "Most of what we do happens in teams, with other clubs and with people from industry." },
  { name: "Industry Readiness", icon: BriefcaseBusinessIcon, text: "Site visits, mentors and real projects mean members start their first job knowing how the work gets done." },
  { name: "Excellence", icon: GemIcon, text: "We pay attention to detail and keep at a piece of work until it is right." },
];

const COMMUNITIES = [
  "ESA Strathmore",
  "Strathmore Data Community",
  "AWS Rebuild",
  "Google Developer Group",
  "IET",
  "Women in Tech Kenya",
];

// Portfolio p. 7, "Professional Growth".
const PATHWAYS: { name: string; text: string; icon: LucideIcon }[] = [
  { name: "Industry linkages", icon: Building2Icon, text: "Site visits, guest lectures and joint projects put members in front of tech companies early." },
  { name: "Alumni mentorship", icon: GraduationCapIcon, text: "SCESA alumni working in industry give one-on-one career advice, portfolio reviews and introductions." },
  { name: "Career readiness", icon: FileTextIcon, text: "Workshops on CVs, technical interviews and professional communication." },
  { name: "Corporate partnerships", icon: HandshakeIcon, text: "Relationships with companies that lead to internships, sponsorships and recruitment for members." },
  { name: "Certification pathways", icon: BadgeCheckIcon, text: "Subsidised certification programmes and study paths in cloud computing, data science, cybersecurity and more." },
];

export function MissionVision() {
  return (
    <section aria-labelledby="mission-vision" className={SECTION}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <h2 id="mission-vision" className={`${H2} lg:col-span-4`}>
          Mission and vision
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:col-span-8">
          <div>
            <h3 className={H3}>Our mission</h3>
            <p className={`mt-3 ${BODY}`}>We want to build innovation and technical excellence across Strathmore by:</p>
            <ul className={`mt-4 space-y-3 ${SMALL}`}>
              {MISSION_POINTS.map((point) => (
                <li key={point} className="border-l-2 border-brand-accent pl-4">
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={H3}>Our vision</h3>
            <p className={`mt-3 ${BODY}`}>
              A student tech community that can hold its own anywhere, built on partnerships with engineering and IT
              organisations in Kenya, across the region and around the world. We want every member to have access to
              global opportunities, affordable specialised bootcamps and an alumni network that helps them lead.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pillars() {
  return (
    <section aria-labelledby="pillars" className={SECTION}>
      <div className="max-w-3xl">
        <h2 id="pillars" className={H2}>
          Connecting academia to industry
        </h2>
        <p className={`mt-4 ${BODY}`}>
          That is what we stand for. In the spirit of Strathmore&apos;s motto, <i lang="la">Ut Omnes Unum Sint</i>{" "}
          (&ldquo;That all may be one&rdquo;), four ideas guide everything we run.
        </p>
      </div>
      <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map(({ name, text, icon: Icon }) => (
          <li key={name}>
            <span className={ICON_TILE}>
              <Icon aria-hidden className="size-6" />
            </span>
            <h3 className={`mt-5 ${H3}`}>{name}</h3>
            <p className={`mt-2 ${SMALL}`}>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GrowthPathways() {
  return (
    <section aria-labelledby="growth" className={SECTION}>
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <Image
            src="/images/about/board-group-2026.jpeg"
            alt="SCESA members and guests on the steps outside a Strathmore University building, between a Cybersecurity Club banner and a SCESA banner"
            width={2410}
            height={1608}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-4/3 h-auto w-full rounded-3xl object-cover"
          />
          <p className="mt-3 font-hand text-xl text-slate-600 dark:text-slate-300">Madaraka campus, 2026</p>
        </div>
        <div className="lg:col-span-7">
          <h2 id="growth" className={H2}>
            How SCESA builds members up
          </h2>
          <p className={`mt-4 ${BODY}`}>
            Members find their people in our communities and keep up with each other on our community platforms.
          </p>
          <ul aria-label="Communities" className="mt-5 flex flex-wrap gap-2">
            {COMMUNITIES.map((c) => (
              <li key={c}>
                <Badge className="px-3 py-1 text-sm">{c}</Badge>
              </li>
            ))}
          </ul>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            {PATHWAYS.map(({ name, text, icon: Icon }) => (
              <div key={name} className="flex gap-4">
                <span className={`${ICON_TILE} size-10 rounded-lg`}>
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <dt className="text-lg font-semibold text-brand-primary">{name}</dt>
                  <dd className={`mt-1 ${SMALL}`}>{text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
