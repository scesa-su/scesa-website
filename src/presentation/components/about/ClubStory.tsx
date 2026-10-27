import Image from "next/image";
import { BODY, H2, H3, SECTION } from "./styles";

const MISSION_POINTS = [
  "Growing real interest in engineering and IT through meetings, publications, seminars and hands-on sessions.",
  "Backing local innovation and technical talent at Strathmore University.",
  "Keeping students up to date with what is changing in ICT and modern engineering.",
];

const PILLARS = [
  { name: "Innovation", text: "We give students room to try ideas, build them and put them in front of real users." },
  { name: "Collaboration", text: "Most of what we do happens in teams, with other clubs and with people from industry." },
  { name: "Industry Readiness", text: "Site visits, mentors and real projects mean members start their first job knowing how the work gets done." },
  { name: "Excellence", text: "We pay attention to detail and keep at a piece of work until it is right." },
];

// Portfolio p. 7, "Professional Growth".
const PATHWAYS = [
  { name: "Industry linkages", text: "Site visits, guest lectures and joint projects put members in front of tech companies early." },
  { name: "Alumni mentorship", text: "SCESA alumni working in industry give one-on-one career advice, portfolio reviews and introductions." },
  { name: "Career readiness", text: "Workshops on CVs, technical interviews and professional communication." },
  { name: "Corporate partnerships", text: "Relationships with companies that lead to internships, sponsorships and recruitment for members." },
  { name: "Certification pathways", text: "Subsidised certification programmes and study paths in cloud computing, data science, cybersecurity and more." },
];

export function MissionVision() {
  return (
    <section aria-labelledby="mission-vision" className={SECTION}>
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h2 id="mission-vision" className={H2}>
            Mission and vision
          </h2>
          <h3 className={`mt-8 ${H3}`}>Our mission</h3>
          <p className={`mt-3 ${BODY}`}>We want to build innovation and technical excellence across Strathmore by:</p>
          <ul className={`mt-3 list-disc space-y-2 pl-6 ${BODY}`}>
            {MISSION_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <h3 className={`mt-8 ${H3}`}>Our vision</h3>
          <p className={`mt-3 ${BODY}`}>
            A student tech community that can hold its own anywhere, built on partnerships with engineering and IT
            organisations in Kenya, across the region and around the world. We want every member to have access to
            global opportunities, affordable specialised bootcamps and an alumni network that helps them lead.
          </p>
        </div>
        <Image
          src="/images/about/members-auditorium.jpeg"
          alt="Students seated in a Strathmore University auditorium during a SCESA session"
          width={1120}
          height={840}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full rounded-2xl"
        />
      </div>
    </section>
  );
}

export function Pillars() {
  return (
    <section aria-labelledby="pillars" className={SECTION}>
      <h2 id="pillars" className={H2}>
        What we stand for
      </h2>
      <p className={`mt-3 max-w-3xl ${BODY}`}>
        Strathmore&apos;s motto, <i lang="la">Ut Omnes Unum Sint</i> (&ldquo;That all may be one&rdquo;), sums up how
        we like to work. Four ideas guide everything we run.
      </p>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((pillar) => (
          <li key={pillar.name} className="border-t-2 border-brand-accent pt-4">
            <h3 className={H3}>{pillar.name}</h3>
            <p className="mt-2 text-md text-slate-600 dark:text-slate-300">{pillar.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GrowthPathways() {
  return (
    <section aria-labelledby="growth" className={SECTION}>
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h2 id="growth" className={H2}>
            How SCESA builds members up
          </h2>
          <p className={`mt-3 ${BODY}`}>
            Members find their people in communities such as ESA Strathmore, Strathmore Data Community, AWS Rebuild,
            Google Developer Group, IET and Women in Tech Kenya, and more than 250 of them keep up through our WhatsApp
            community. Beyond that, SCESA offers:
          </p>
          <dl className="mt-6 space-y-5">
            {PATHWAYS.map((p) => (
              <div key={p.name}>
                <dt className="text-lg font-semibold text-brand-primary">{p.name}</dt>
                <dd className="mt-1 text-md text-slate-600 dark:text-slate-300">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Image
          src="/images/about/board-group-2026.jpeg"
          alt="SCESA members and guests on the steps outside a Strathmore University building, between a Cybersecurity Club banner and a SCESA banner"
          width={2410}
          height={1608}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full rounded-2xl lg:mt-16"
        />
      </div>
    </section>
  );
}
