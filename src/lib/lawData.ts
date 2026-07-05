export interface LawItem {
  slug: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  status: "Published" | "Under Discussion";
  impact: "high" | "medium" | "low";
  fullText: string;
  keyPoints: string[];
  howItAffectsYou: string;
  whatYouCanDo: string[];
  source: string;
  effectiveDate?: string;
  isStillActive?: boolean;
  activeStatusNote?: string;
  originalLegalText?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[€]/g, "eur")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const allLaws: LawItem[] = [
  {
    slug: slugify("Rent Cap Extended Through 2029"),
    category: "Housing",
    title: "Rent Cap Extended Through 2029",
    summary: "The Mietpreisbremse now covers 206 municipalities including Munich, limiting rent increases to 10% above benchmark.",
    date: "Apr 8, 2026",
    status: "Published",
    impact: "high",
    effectiveDate: "January 1, 2026",
    fullText: "The German federal government has extended the Mietpreisbremse (rent brake) through 2029, expanding it to cover 206 municipalities across the country. This regulation limits how much landlords can charge when re-letting apartments — specifically, new rents cannot exceed 10% above the local benchmark rent (Mietspiegel). The extension comes after years of debate and rising housing costs in major German cities.",
    keyPoints: [
      "Applies to 206 municipalities including all major cities",
      "New rents capped at 10% above local benchmark (Mietspiegel)",
      "Covers re-lettings — not newly built apartments",
      "Landlords must disclose previous rent upon request",
      "Tenants can reclaim excess rent paid in the first 30 months"
    ],
    howItAffectsYou: "If you're renting or looking for an apartment in a covered city like Munich, your landlord cannot charge more than 10% above the benchmark rent. If you suspect your rent is too high, you have the legal right to request disclosure of the previous tenant's rent and challenge the amount. This could save you hundreds of euros per month.",
    whatYouCanDo: [
      "Check if your city is covered under the expanded list",
      "Look up the Mietspiegel (rent benchmark) for your area",
      "Request your landlord disclose the previous rent if you recently moved in",
      "Contact your local Mieterverein (tenant association) for free advice",
      "File a complaint if your rent exceeds the allowed cap"
    ],
    source: "Bundesgesetzblatt, Federal Housing Ministry"
  },
  {
    slug: slugify("Munich Expands Tenant Advisory Services"),
    category: "Housing",
    title: "Munich Expands Tenant Advisory Services",
    summary: "The city funds 12 new Mieterverein walk-in clinics across high-renter neighborhoods.",
    date: "Mar 30, 2026",
    status: "Published",
    impact: "medium",
    fullText: "Munich's city council has approved funding for 12 new walk-in tenant advisory clinics operated in partnership with the Mieterverein München. These clinics will be located in neighborhoods with high renter populations, providing free initial consultations on tenancy law, rent disputes, and eviction protection.",
    keyPoints: [
      "12 new walk-in clinics across Munich",
      "Free initial legal consultations for tenants",
      "Operated by Mieterverein München with city funding",
      "Focus on neighborhoods with high renter density",
      "Services include rent review, eviction protection, and deposit disputes"
    ],
    howItAffectsYou: "If you live in Munich, you now have easier access to free legal advice about your tenancy. Whether you're dealing with a rent increase, maintenance issues, or concerns about eviction, you can walk into one of these new clinics without an appointment for an initial consultation.",
    whatYouCanDo: [
      "Find your nearest Mieterverein walk-in clinic on the city website",
      "Bring your rental contract for a free initial review",
      "Ask about your rights regarding rent increases or deposit returns",
      "Consider joining the Mieterverein for ongoing legal protection"
    ],
    source: "Munich City Council Press Release"
  },
  {
    slug: slugify("Mini-Job Threshold Rises to EUR556 per month"),
    category: "Student Work",
    title: "Mini-Job Threshold Rises to €556/month",
    summary: "The earnings cap for tax-free mini-jobs increases again — affecting over 7 million workers.",
    date: "Apr 8, 2026",
    status: "Published",
    impact: "high",
    effectiveDate: "July 1, 2026",
    fullText: "Starting July 2026, the monthly earnings threshold for mini-jobs (geringfügige Beschäftigung) will rise to €556 per month, up from the current €538. This adjustment is tied to the minimum wage increase and affects approximately 7.4 million workers across Germany, many of whom are students. Mini-job earnings remain exempt from income tax and most social security contributions for employees.",
    keyPoints: [
      "New monthly cap: €556 (up from €538)",
      "Annual cap rises to €6,672",
      "Linked to minimum wage adjustment",
      "No income tax on mini-job earnings for employees",
      "Employer pays flat-rate social security contributions",
      "Multiple mini-jobs are combined for threshold calculation"
    ],
    howItAffectsYou: "If you work a mini-job — common among students — you can now earn up to €556/month without paying income tax or employee social security contributions. If you're currently working near the old limit, you may be able to take on a few more hours. Be careful with multiple mini-jobs though: earnings from all mini-jobs are combined.",
    whatYouCanDo: [
      "Talk to your employer about adjusting your hours if you were at the old cap",
      "Check if you have multiple mini-jobs — combined earnings must stay under €556",
      "Review whether a midi-job (€556–€2,000) might be more beneficial for you",
      "Track your monthly earnings to avoid accidentally exceeding the threshold"
    ],
    source: "Federal Ministry of Labour and Social Affairs"
  },
  {
    slug: slugify("Deutschlandticket Price Locked Through 2027"),
    category: "Mobility",
    title: "Deutschlandticket Price Locked Through 2027",
    summary: "Federal-state agreement freezes the €49 transit pass price for another 18 months.",
    date: "Apr 6, 2026",
    status: "Published",
    impact: "high",
    fullText: "In a landmark agreement between the federal government and all 16 state governments, the Deutschlandticket monthly transit pass will remain at €49 through the end of 2027. A planned price increase to €59 has been shelved after intense public debate. The federal government will increase its subsidy by €1.5 billion annually to cover the difference.",
    keyPoints: [
      "Price stays at €49/month through December 2027",
      "Planned €59 price hike is cancelled",
      "Federal subsidy increases by €1.5 billion/year",
      "Valid on all local and regional public transit nationwide",
      "Monthly subscription — can be cancelled each month"
    ],
    howItAffectsYou: "You can continue using the Deutschlandticket at €49/month for all local and regional public transit across Germany. This is especially valuable if you commute by train or bus, as it often replaces much more expensive monthly passes. The price certainty through 2027 lets you plan your budget with confidence.",
    whatYouCanDo: [
      "Subscribe if you haven't already — it pays for itself with just a few trips",
      "Cancel your old regional monthly pass if the Deutschlandticket is cheaper",
      "Use it for weekend trips across Germany on regional trains",
      "Check if your employer offers a subsidized Jobticket version"
    ],
    source: "Federal Ministry of Transport"
  },
  {
    slug: slugify("BAföG Reform Higher Rates and Looser Eligibility"),
    category: "Benefits",
    title: "BAföG Reform: Higher Rates & Looser Eligibility",
    summary: "Monthly support rises by 5% and the parental income threshold is raised — more students now qualify.",
    date: "Apr 2, 2026",
    status: "Published",
    impact: "high",
    effectiveDate: "October 1, 2026",
    fullText: "The 29th BAföG amendment brings significant improvements for students. The maximum monthly rate increases by 5% to €992, while the parental income allowance is raised by 6.5%, meaning an estimated 150,000 additional students will now qualify. The housing supplement also increases for students not living with their parents. The age limit for eligibility has been raised to 45 for first-time applicants.",
    keyPoints: [
      "Maximum monthly rate: €992 (up 5%)",
      "Parental income threshold raised by 6.5%",
      "~150,000 additional students now eligible",
      "Housing supplement increased to €380/month",
      "Age limit raised to 45 for first-time applicants",
      "Half is a grant (non-repayable), half is an interest-free loan"
    ],
    howItAffectsYou: "If you're a student, you may now qualify for BAföG even if you were previously rejected due to your parents' income. The higher rates also mean more support for living costs. Remember: half of BAföG is a grant you never repay, and the loan portion is interest-free with a repayment cap of €10,010.",
    whatYouCanDo: [
      "Re-apply if you were previously rejected — the new income thresholds may qualify you",
      "Check the BAföG calculator at bafög.de to estimate your entitlement",
      "Apply early — processing can take 2-3 months",
      "Gather your parents' tax documents (Steuerbescheid) for the application",
      "Visit your university's Studierendenwerk for in-person help"
    ],
    source: "Federal Ministry of Education and Research"
  },
  {
    slug: slugify("Bundesrat Reviews Nationwide Rent Freeze Proposal"),
    category: "Housing",
    title: "Bundesrat Reviews Nationwide Rent Freeze Proposal",
    summary: "A proposal to freeze rents for 3 years in cities with housing shortages is being debated.",
    date: "Apr 9, 2026",
    status: "Under Discussion",
    impact: "high",
    fullText: "The Bundesrat is reviewing a legislative proposal that would impose a 3-year rent freeze in cities officially designated as having housing shortages (angespannte Wohnungsmärkte). During the freeze period, landlords would be prohibited from raising rents beyond inflation adjustment. The proposal has support from several SPD- and Green-led state governments but faces opposition from CDU-led states and landlord associations.",
    keyPoints: [
      "3-year rent freeze proposed for shortage areas",
      "Would cover approximately 130 cities",
      "Rent increases limited to inflation adjustment only",
      "Exemptions for newly built apartments and major renovations",
      "Currently in committee review at the Bundesrat"
    ],
    howItAffectsYou: "If enacted, this could freeze your rent for 3 years if you live in a designated shortage area. This would provide significant financial relief, especially in cities like Munich, Berlin, and Hamburg where rents have been rising rapidly. However, the law is still under discussion and may change before any vote.",
    whatYouCanDo: [
      "Follow the legislative process — a vote is expected by late 2026",
      "Contact your local representatives to voice your opinion",
      "Check if your city is classified as a housing shortage area",
      "Document your current rent level for future reference"
    ],
    source: "Bundesrat Committee on Housing and Urban Development"
  },
  {
    slug: slugify("Student Tax Filing Deadline May Be Extended"),
    category: "Taxes",
    title: "Student Tax Filing Deadline May Be Extended",
    summary: "An automatic 2-month extension for voluntary income tax returns is under committee review.",
    date: "Apr 4, 2026",
    status: "Under Discussion",
    impact: "medium",
    fullText: "A proposal in the Bundestag finance committee would grant students an automatic 2-month extension for filing voluntary income tax returns, pushing the deadline from July 31 to October 31. The measure recognizes that many students file voluntarily to reclaim withheld taxes from part-time jobs, but often miss the optimal filing window due to exam periods.",
    keyPoints: [
      "Voluntary tax returns deadline would extend to October 31",
      "Applies specifically to students filing voluntarily",
      "Aims to help students reclaim withheld income tax",
      "Currently in Bundestag finance committee review",
      "Would apply starting tax year 2026"
    ],
    howItAffectsYou: "If you work part-time and have taxes withheld, filing a voluntary return can get you hundreds of euros back. This extension would give you more time to file without needing to rush during exam season. Even if this doesn't pass, you can still file voluntary returns up to 4 years retroactively.",
    whatYouCanDo: [
      "File your tax return for previous years — you likely have refunds waiting",
      "Use free tax tools like ELSTER or student-focused tax apps",
      "Keep receipts for work-related expenses, study materials, and commuting costs",
      "Consider filing even without this extension — the 4-year window is generous"
    ],
    source: "Bundestag Finance Committee"
  },
  {
    slug: slugify("Remote Work Rights for Student Employees"),
    category: "Student Work",
    title: "Remote Work Rights for Student Employees",
    summary: "Draft legislation would give working students the right to request remote arrangements.",
    date: "Apr 3, 2026",
    status: "Under Discussion",
    impact: "low",
    fullText: "A draft bill in the Bundestag would extend the right to request remote work arrangements (Homeoffice) to student employees — including Werkstudenten and mini-jobbers in eligible roles. Employers would be required to consider the request and provide a written reason if denied. The bill is modeled on the existing Dutch remote work law.",
    keyPoints: [
      "Right to request (not guarantee) remote work",
      "Applies to Werkstudenten and mini-job employees",
      "Employer must respond in writing within 4 weeks",
      "Denial must include specific business reasons",
      "Does not apply to roles requiring physical presence"
    ],
    howItAffectsYou: "If you're a working student in a desk-based role, this would give you the formal right to request working from home. Your employer would have to seriously consider it and explain in writing if they say no. This could help you better balance lectures, study time, and work.",
    whatYouCanDo: [
      "Talk to your employer informally about remote work possibilities now",
      "Document your productivity and work patterns to support a future request",
      "Follow the bill's progress through the Bundestag"
    ],
    source: "Bundestag Labour Committee"
  },
  {
    slug: slugify("Free Public Transit for Under-25s Proposed"),
    category: "Mobility",
    title: "Free Public Transit for Under-25s Proposed",
    summary: "A Green Party bill proposes eliminating fares for all residents under 25 starting 2028.",
    date: "Apr 1, 2026",
    status: "Under Discussion",
    impact: "medium",
    fullText: "The Green Party has introduced a bill proposing free public transit for all residents under 25, starting in 2028. The estimated cost of €3.2 billion annually would be covered through a combination of federal funding and a proposed mobility surcharge on high-emission vehicles. The bill aims to reduce car dependency among young people and accelerate the climate transition.",
    keyPoints: [
      "Free local and regional transit for under-25s",
      "Proposed start date: January 2028",
      "Estimated annual cost: €3.2 billion",
      "Funded via federal budget and vehicle surcharges",
      "Covers all local and regional transit, not long-distance (ICE/IC)"
    ],
    howItAffectsYou: "If you're under 25, this could eliminate your transit costs entirely for local and regional travel. Combined with or replacing the Deutschlandticket, this would save you €588 or more per year. However, the proposal still needs to pass through both the Bundestag and Bundesrat, and faces significant political hurdles.",
    whatYouCanDo: [
      "Support the proposal by contacting your representatives",
      "In the meantime, use the Deutschlandticket at €49/month",
      "Check if your university offers a discounted Semesterticket",
      "Follow the legislative debate as it progresses"
    ],
    source: "Green Party Parliamentary Group"
  },
];

export function getLawBySlug(slug: string): LawItem | undefined {
  return allLaws.find((law) => law.slug === slug);
}
