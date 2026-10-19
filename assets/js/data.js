/* =====================================================================
   PORTFOLIO CONTENT — edit this file to update the website.
   ---------------------------------------------------------------------
   Everything that appears in lists on the site (skills, experience,
   services, projects, social links, contact details) lives here, so you
   never have to touch the layout code to update your content.

   Rules of thumb:
   • Leave a field as "" (empty) or null to HIDE it on the site.
   • Keep the quotes and commas intact — this is a JavaScript file.
   • After editing, refresh the browser to see your changes.
   ===================================================================== */

window.PORTFOLIO = {
  /* -------------------------------------------------------------------
     SITE SETTINGS
     siteUrl: your live domain once you have one, e.g. "https://emediong.dev"
     (no trailing slash). Used for canonical URLs and social sharing.
     ------------------------------------------------------------------- */
  site: {
    siteUrl: "https://emediong-odiong.vercel.app",
  },

  /* -------------------------------------------------------------------
     CONTACT FORM DELIVERY
     endpoint: where the form is POSTed (JSON). Options:
       • ""               → not configured. The form still validates, then
                            offers to send the message via WhatsApp/email.
                            (It never pretends a message was delivered.)
       • "/api/contact"   → the included Vercel serverless function
                            (set RESEND_API_KEY etc. in Vercel — see README).
       • "https://formspree.io/f/xxxxxx" → a Formspree form endpoint.
     ------------------------------------------------------------------- */
  contactForm: {
    endpoint: "",
  },

  /* -------------------------------------------------------------------
     PROFILE & CONTACT
     ------------------------------------------------------------------- */
  profile: {
    name: "Emediong Ndong Odiong",
    shortName: "Emediong",
    initials: "EO",
    titles: ["Full-Stack Web Developer", "Data Entry Professional", "IT Support"],

    // Availability badge shown in the hero and contact section.
    // status: "available" (green) | "limited" (amber) | "unavailable" (grey)
    availability: {
      status: "available",
      label: "Available for freelance projects & full-time roles",
    },

    // Phone / WhatsApp. `whatsapp` must be the international number with
    // no "+" or spaces (Nigeria: 234 + number without the leading 0).
    phoneDisplay: "0810 518 2333",
    phoneInternational: "+2348105182333",
    whatsapp: "2348105182333",
    whatsappMessage: "Hello Emediong, I found your portfolio and I'd like to talk about a project.",

    // Optional — leave "" to hide.
    email: "emediongodiong001@gmail.com",
    location: "",          // e.g. "Uyo, Nigeria" — only if you want it public
    cvUrl: "",             // e.g. "assets/files/Emediong-Odiong-CV.pdf"

    // Profile photo shown in the About section.
    photo: "assets/img/profile.webp",
    photoAlt: "Portrait of Emediong Ndong Odiong wearing a light-blue kaftan",
  },

  /* Social profiles — add your real URLs. Empty ones are hidden. */
  socials: [
    { label: "GitHub", icon: "github", url: "" },
    { label: "LinkedIn", icon: "linkedin", url: "" },
    { label: "X (Twitter)", icon: "x", url: "" },
    { label: "Instagram", icon: "instagram", url: "" },
  ],

  /* -------------------------------------------------------------------
     ABOUT — short "at a glance" cards beside the biography.
     The biography paragraphs themselves are in index.html (section #about)
     so search engines can read them without JavaScript.
     ------------------------------------------------------------------- */
  about: {
    highlights: [
      { title: "Background", text: "Web development, data entry and IT support — three roles that all come down to making technology work reliably for people." },
      { title: "Development interests", text: "Responsive front-ends, clean full-stack architecture, and tools that save businesses time." },
      { title: "Career goals", text: "Growing as a full-stack engineer while helping businesses build a strong, trustworthy online presence." },
    ],
  },

  /* -------------------------------------------------------------------
     SKILLS — review this list and keep only what you're confident in.
     Proficiency levels are intentionally NOT shown. If you want them,
     add a `level` field and update renderSkills() in main.js.
     ------------------------------------------------------------------- */
  skills: [
    { category: "Frontend Development", icon: "layout", items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Responsive Design", "Tailwind CSS"] },
    { category: "Backend Development", icon: "server", items: ["Node.js", "Express", "REST APIs", "Authentication", "Form Handling"] },
    { category: "Databases", icon: "database", items: ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Data Modelling"] },
    { category: "Programming Languages", icon: "code", items: ["JavaScript", "TypeScript", "SQL"] },
    { category: "Developer Tools", icon: "tool", items: ["Git", "GitHub", "VS Code", "npm", "Chrome DevTools", "Vercel"] },
    { category: "Data Entry & Management", icon: "table", items: ["Accurate Data Entry", "Microsoft Excel", "Google Sheets", "Record Organisation", "Data Cleaning", "Confidential Records"] },
    { category: "IT Support & Troubleshooting", icon: "support", items: ["Hardware & Software Setup", "Troubleshooting", "Microsoft Office", "Basic Networking", "User Support", "System Maintenance"] },
  ],

  /* -------------------------------------------------------------------
     EXPERIENCE — fill in `period` (e.g. "2023 — Present") and adjust the
     bullet points so they describe exactly what you did.
     `company`: leave "" if you prefer not to name the employer.
     ------------------------------------------------------------------- */
  experience: [
    {
      role: "Full-Stack Web Developer",
      company: "Freelance & Independent Projects",
      period: "",
      type: "Web Development",
      points: [
        "Design and build responsive websites and web applications from layout through to deployment.",
        "Develop front-end interfaces with HTML, CSS and JavaScript frameworks, and connect them to back-end services and databases.",
        "Maintain existing sites — fixing bugs, improving performance and making layouts work across devices.",
      ],
      tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    },
    {
      role: "Data Entry Professional",
      company: "",
      period: "",
      type: "Data & Records",
      points: [
        "Enter and update records accurately, with close attention to detail.",
        "Organise and maintain information so it stays consistent, searchable and easy to report on.",
        "Handle sensitive information confidentially and in line with company procedures.",
      ],
      tags: ["Accuracy", "Excel", "Record Keeping", "Confidentiality"],
    },
    {
      role: "IT Personnel & Data Entry",
      company: "Deacons Publishers",
      period: "",
      type: "IT Support",
      points: [
        "Serve as IT personnel, supporting the organisation's day-to-day technology needs.",
        "Help colleagues resolve computer and software issues so work keeps moving.",
        "Handle data entry, keeping records accurate, organised and up to date.",
      ],
      tags: ["IT Support", "Troubleshooting", "Data Entry"],
    },
  ],

  /* -------------------------------------------------------------------
     SERVICES
     ------------------------------------------------------------------- */
  services: [
    { title: "Website Design & Development", icon: "monitor", text: "Custom, responsive websites designed around your brand and built to load fast on every device.", cta: "Start a website", projectType: "Website Design & Development" },
    { title: "Full-Stack Web Applications", icon: "layers", text: "Web apps with real functionality — user accounts, dashboards, forms and data — from front-end to database.", cta: "Discuss an app", projectType: "Full-Stack Web Application" },
    { title: "Business & Corporate Websites", icon: "briefcase", text: "Professional sites that explain what you do, build trust and make it easy for customers to reach you.", cta: "Plan my site", projectType: "Business / Corporate Website" },
    { title: "Landing Page Design", icon: "target", text: "Focused, conversion-minded landing pages for products, campaigns, events and launches.", cta: "Get a landing page", projectType: "Landing Page" },
    { title: "E-Commerce Development", icon: "cart", text: "Online stores with product catalogues, carts and checkout flows that are simple for customers to use.", cta: "Build my store", projectType: "E-Commerce Website" },
    { title: "Maintenance & Bug Fixing", icon: "wrench", text: "Fixing broken layouts, errors and slow pages, plus ongoing updates to keep your site healthy.", cta: "Fix my website", projectType: "Website Maintenance / Bug Fixing" },
    { title: "Responsive Optimisation", icon: "phone", text: "Making existing websites look and work properly on phones, tablets and large screens.", cta: "Optimise my site", projectType: "Responsive Optimisation" },
    { title: "Database-Driven Applications", icon: "database", text: "Applications that store, search and manage your business data in a structured, reliable way.", cta: "Talk databases", projectType: "Database-Driven Application" },
    { title: "Data Entry & Organisation", icon: "table", text: "Accurate data entry, spreadsheet clean-up and digital organisation of records and documents.", cta: "Get data help", projectType: "Data Entry / Data Organisation" },
    { title: "IT Support & Troubleshooting", icon: "support", text: "Practical help with computer, software and setup problems so your team can keep working.", cta: "Get IT support", projectType: "IT Support" },
  ],

  /* -------------------------------------------------------------------
     PROJECTS
     status: "Live" | "Demo Project" | "Concept Project" | "In Development"
     filter: "business" | "landing" | "ecommerce" | "webapp"
     demoUrl: a link that genuinely works (a deployed site or a local demo).
              Leave null if the project hasn't been built yet.
     codeUrl: your real GitHub repository URL, or null to hide the button.
     thumbnail: a screenshot (.webp/.png/.jpg) or illustration (.svg).
     thumbType: "screenshot" | "illustration" — shown as a small label so
                visitors know whether they're looking at the real thing.
     caseStudy.results: only add VERIFIED results. Leave [] otherwise.
     ------------------------------------------------------------------- */
  projectFilters: [
    { key: "all", label: "All" },
    { key: "business", label: "Business Websites" },
    { key: "landing", label: "Landing Pages" },
    { key: "ecommerce", label: "E-Commerce" },
    { key: "webapp", label: "Web Applications" },
  ],

  projects: [
    {
      slug: "e-commerce-store",
      title: "E-Commerce Store",
      category: "E-Commerce",
      filter: "ecommerce",
      status: "Demo Project",
      summary: "A working storefront demo with product search, category filters, a persistent cart and a mock checkout flow.",
      tech: ["HTML", "CSS", "JavaScript", "LocalStorage"],
      thumbnail: "assets/img/projects/e-commerce-store.webp",
      thumbType: "screenshot",
      demoUrl: "demos/shop/",
      codeUrl: null,
      caseStudy: {
        overview: "Lumen Supply is a fictional home-goods store built to demonstrate the core shopping experience: browsing a catalogue, filtering and searching products, managing a cart and completing a checkout form.",
        problem: "Small businesses often want to sell online but need a storefront that is fast, easy to navigate on mobile, and doesn't confuse customers at checkout.",
        goals: ["Fast, responsive product grid", "Search and category filtering without page reloads", "A cart that survives page refreshes", "A clear, validated checkout form"],
        approach: "A calm, product-first layout with generous whitespace, a sticky header and a slide-out cart drawer so shoppers never lose their place in the catalogue.",
        features: ["Live product search and category filters", "Sort by price and name", "Slide-out cart with quantity controls", "Cart saved in the browser (localStorage)", "Validated checkout form with order summary", "Keyboard-accessible controls"],
        challenges: ["Keeping cart totals, badge counts and the drawer in sync from a single source of state.", "Making the cart drawer accessible — focus handling, Escape to close and screen-reader labels."],
        results: [],
        note: "This is a demonstration project. No real payments are processed and no orders are stored on a server.",
      },
    },
    {
      slug: "corporate-business-website",
      title: "Corporate Business Website",
      category: "Business Website",
      filter: "business",
      status: "Concept Project",
      summary: "A concept for a professional services firm: clear service pages, team credibility and a strong enquiry flow.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
      thumbnail: "assets/img/projects/corporate-business-website.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept website for a fictional consulting firm, focused on presenting services clearly and turning visitors into enquiries.",
        problem: "Many company websites bury their services in long text and make it hard for potential clients to understand what the firm does or how to get in touch.",
        goals: ["Explain services in under 10 seconds", "Build trust with team and process sections", "Make enquiries possible from every page"],
        approach: "A structured layout with a bold value proposition, scannable service cards, a simple process timeline and a persistent contact call to action.",
        features: ["Service overview and detail pages", "Team and process sections", "Enquiry form", "SEO-friendly page structure"],
        challenges: ["Balancing a corporate, trustworthy tone with a modern visual style."],
        results: [],
        note: "Concept project — this design has not yet been built as a live website.",
      },
    },
    {
      slug: "restaurant-website",
      title: "Restaurant Website",
      category: "Business Website",
      filter: "business",
      status: "Concept Project",
      summary: "A warm, appetising restaurant site concept with an easy-to-read menu, opening hours and table reservations.",
      tech: ["HTML", "CSS", "JavaScript"],
      thumbnail: "assets/img/projects/restaurant-website.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept site for a fictional restaurant, designed around the three things diners look for: the menu, the location and hours, and a way to book a table.",
        problem: "Restaurant websites frequently use PDF menus that are unreadable on phones, which is where most diners browse.",
        goals: ["A mobile-friendly HTML menu", "One-tap directions and calling", "A simple reservation request form"],
        approach: "Rich food photography, warm colours and a menu organised by category with clear prices.",
        features: ["Categorised menu", "Reservation request form", "Opening hours and map", "Click-to-call and WhatsApp ordering"],
        challenges: ["Keeping large food images fast-loading on mobile data."],
        results: [],
        note: "Concept project — this design has not yet been built as a live website.",
      },
    },
    {
      slug: "real-estate-platform",
      title: "Real Estate Platform",
      category: "Web Application",
      filter: "webapp",
      status: "Concept Project",
      summary: "A property listing platform concept with search filters, listing pages and agent enquiries.",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      thumbnail: "assets/img/projects/real-estate-platform.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept platform where buyers and renters can search properties by location, price and type, and contact agents directly.",
        problem: "Property seekers waste time on outdated listings and platforms with weak search tools.",
        goals: ["Fast, filterable search", "Detailed listing pages with photo galleries", "Direct agent enquiries"],
        approach: "A search-first interface with filters always visible and listing cards that surface price, location and key details at a glance.",
        features: ["Search by location, price, bedrooms and type", "Listing detail pages", "Saved listings", "Agent enquiry form", "Admin listing management"],
        challenges: ["Designing a database schema that supports flexible filtering efficiently."],
        results: [],
        note: "Concept project — planned, not yet built.",
      },
    },
    {
      slug: "saas-landing-page",
      title: "SaaS Product Landing Page",
      category: "Landing Page",
      filter: "landing",
      status: "Concept Project",
      summary: "A conversion-focused landing page concept for a software product: features, pricing and sign-up.",
      tech: ["Next.js", "Tailwind CSS"],
      thumbnail: "assets/img/projects/saas-landing-page.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A landing page concept for a fictional productivity tool, structured to move visitors from interest to sign-up.",
        problem: "Product pages often list features without explaining the benefit, so visitors leave without understanding the value.",
        goals: ["Clear headline and value proposition", "Benefit-led feature sections", "Simple pricing comparison", "A prominent sign-up call to action"],
        approach: "A clean product-led design with an app preview, short benefit statements and a three-tier pricing table.",
        features: ["Hero with product preview", "Feature grid", "Pricing table", "FAQ accordion", "Sign-up form"],
        challenges: ["Keeping the page fast while including rich product visuals."],
        results: [],
        note: "Concept project — this design has not yet been built as a live website.",
      },
    },
    {
      slug: "school-management-website",
      title: "School Management Website",
      category: "Web Application",
      filter: "webapp",
      status: "Concept Project",
      summary: "A school website and portal concept covering admissions, announcements, results and parent communication.",
      tech: ["React", "Node.js", "MySQL"],
      thumbnail: "assets/img/projects/school-management-website.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept for a combined public school website and private portal for staff, students and parents.",
        problem: "Schools often rely on paper notices and manual record-keeping, which makes communication slow and records hard to find.",
        goals: ["Public pages for admissions and school information", "Portal for announcements and results", "Role-based access for staff, students and parents"],
        approach: "A friendly public site paired with a clean, dashboard-style portal.",
        features: ["Admissions information and enquiry form", "News and announcements", "Student results view", "Role-based logins"],
        challenges: ["Protecting student data with proper access control."],
        results: [],
        note: "Concept project — planned, not yet built.",
      },
    },
    {
      slug: "online-learning-platform",
      title: "Online Learning Platform",
      category: "Web Application",
      filter: "webapp",
      status: "Concept Project",
      summary: "An e-learning platform concept with course catalogues, lesson pages and learner progress tracking.",
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
      thumbnail: "assets/img/projects/online-learning-platform.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept platform where learners can browse courses, follow lessons and track their progress.",
        problem: "Educators need a simple way to publish structured courses without complicated software.",
        goals: ["Browsable course catalogue", "Structured lessons with progress tracking", "Learner dashboard"],
        approach: "A focused reading experience for lessons and an encouraging dashboard that shows progress.",
        features: ["Course catalogue and search", "Lesson pages with video and notes", "Progress tracking", "Learner accounts"],
        challenges: ["Designing lesson pages that stay readable on small screens."],
        results: [],
        note: "Concept project — planned, not yet built.",
      },
    },
    {
      slug: "appointment-booking-system",
      title: "Appointment Booking System",
      category: "Web Application",
      filter: "webapp",
      status: "Demo Project",
      summary: "A working booking demo: choose a service, pick a date and an available time slot, and manage your bookings.",
      tech: ["HTML", "CSS", "JavaScript", "LocalStorage"],
      thumbnail: "assets/img/projects/appointment-booking-system.webp",
      thumbType: "screenshot",
      demoUrl: "demos/booking/",
      codeUrl: null,
      caseStudy: {
        overview: "A step-by-step booking flow for a fictional wellness clinic. Visitors pick a service, choose a date and time, enter their details, and can view or cancel their bookings.",
        problem: "Many small service businesses still take bookings by phone, which leads to double-bookings and missed calls.",
        goals: ["A clear 3-step booking flow", "Prevent double-booking of a time slot", "Let customers see and cancel their bookings"],
        approach: "A guided stepper with a custom calendar, time slots that disable when taken, and a summary before confirmation.",
        features: ["Service selection with duration and price", "Custom accessible calendar (past dates and Sundays disabled)", "Time slots that become unavailable once booked", "Validated contact form", "'My bookings' list with cancellation", "Data saved in the browser"],
        challenges: ["Building a keyboard-friendly calendar without a third-party library.", "Calculating slot availability per date from stored bookings."],
        results: [],
        note: "This is a demonstration project. Bookings are stored only in your own browser.",
      },
    },
    {
      slug: "publisher-website",
      title: "Publisher & Publications Website",
      category: "Business Website",
      filter: "business",
      status: "Concept Project",
      summary: "A publishing house website concept with a searchable book catalogue, author pages and submission info.",
      tech: ["Next.js", "Headless CMS", "Tailwind CSS"],
      thumbnail: "assets/img/projects/publisher-website.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept website for a fictional publishing house, showcasing its catalogue and authors and explaining how to submit manuscripts or order titles.",
        problem: "Publishers need a catalogue that is easy to browse and easy for staff to keep updated as new titles are released.",
        goals: ["Searchable book catalogue", "Author profiles", "Clear submission and ordering information", "Content editable by non-technical staff"],
        approach: "An editorial, typography-led design that lets book covers stand out.",
        features: ["Book catalogue with categories", "Book detail pages", "Author pages", "Manuscript submission guidelines", "CMS-managed content"],
        challenges: ["Structuring content so staff can add new titles without developer help."],
        results: [],
        note: "Concept project — an independent design exercise, not a website built for any specific publisher.",
      },
    },
    {
      slug: "catering-bakery-website",
      title: "Catering & Bakery Website",
      category: "E-Commerce",
      filter: "ecommerce",
      status: "Concept Project",
      summary: "A bakery and catering concept with a product menu, custom cake requests and event catering enquiries.",
      tech: ["HTML", "CSS", "JavaScript"],
      thumbnail: "assets/img/projects/catering-bakery-website.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept site for a fictional bakery that also offers event catering, combining a product menu with order and enquiry forms.",
        problem: "Bakeries often take custom orders through scattered chats and calls, which makes details easy to lose.",
        goals: ["Showcase products beautifully", "Structured custom cake order form", "Catering enquiry flow", "WhatsApp ordering option"],
        approach: "A soft, inviting palette with large product photography and simple order forms.",
        features: ["Product menu with prices", "Custom cake request form", "Catering packages", "WhatsApp order button"],
        challenges: ["Designing an order form that captures details without feeling long."],
        results: [],
        note: "Concept project — this design has not yet been built as a live website.",
      },
    },
    {
      slug: "tattoo-studio-booking",
      title: "Tattoo Studio Booking Website",
      category: "Landing Page",
      filter: "landing",
      status: "Concept Project",
      summary: "A bold, dark studio site concept with artist portfolios, style galleries and consultation booking.",
      tech: ["HTML", "CSS", "JavaScript"],
      thumbnail: "assets/img/projects/tattoo-studio-booking.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept website for a fictional tattoo studio, built around artist portfolios and a consultation request flow.",
        problem: "Clients want to see an artist's style before booking, but studio work is often scattered across social media.",
        goals: ["Artist profiles with portfolio galleries", "Filter work by style", "Consultation booking with reference image upload"],
        approach: "A dark, high-contrast visual identity that lets the artwork take centre stage.",
        features: ["Artist profiles", "Filterable gallery", "Consultation booking form", "Aftercare information"],
        challenges: ["Presenting many high-resolution images without slowing the site down."],
        results: [],
        note: "Concept project — this design has not yet been built as a live website.",
      },
    },
    {
      slug: "logistics-tracking-platform",
      title: "Logistics & Delivery Tracking",
      category: "Web Application",
      filter: "webapp",
      status: "Demo Project",
      summary: "A working shipment-tracking demo with a delivery timeline, route progress and shipment details.",
      tech: ["HTML", "CSS", "JavaScript"],
      thumbnail: "assets/img/projects/logistics-tracking-platform.webp",
      thumbType: "screenshot",
      demoUrl: "demos/tracking/",
      codeUrl: null,
      caseStudy: {
        overview: "A tracking page for a fictional delivery company. Customers enter a tracking number and see where their parcel is, with a full status timeline.",
        problem: "Customers of delivery businesses constantly call to ask 'where is my package?' — a clear tracking page answers that question for them.",
        goals: ["Simple tracking-number lookup", "Clear current status and estimated delivery", "Full event timeline", "Helpful error messages for invalid numbers"],
        approach: "A single search box leading to a status card, a progress bar along the route and a vertical timeline of events.",
        features: ["Tracking number validation", "Sample shipments in different states", "Route progress indicator", "Event timeline", "Shareable tracking links (?id=…)"],
        challenges: ["Designing status states (in transit, delayed, delivered) that are clear without relying on colour alone."],
        results: [],
        note: "This is a demonstration project using sample shipment data — it is not connected to a real courier.",
      },
    },
    {
      slug: "healthcare-information-website",
      title: "Healthcare Information Website",
      category: "Business Website",
      filter: "business",
      status: "Concept Project",
      summary: "A calm, accessible clinic website concept with services, doctor profiles and appointment requests.",
      tech: ["Next.js", "Tailwind CSS"],
      thumbnail: "assets/img/projects/healthcare-information-website.svg",
      thumbType: "illustration",
      demoUrl: null,
      codeUrl: null,
      caseStudy: {
        overview: "A concept website for a fictional clinic, designed with accessibility and clarity as the top priorities.",
        problem: "Patients — including older users — need to find opening hours, services and contact details quickly and easily.",
        goals: ["Highly readable, accessible design", "Clear service and department pages", "Easy appointment requests", "Emergency contact information always visible"],
        approach: "Calm colours, large readable type, strong contrast and simple navigation.",
        features: ["Services and departments", "Doctor profiles", "Appointment request form", "Health information articles"],
        challenges: ["Meeting accessibility contrast requirements while keeping a soft, calming palette."],
        results: [],
        note: "Concept project — this design has not yet been built as a live website.",
      },
    },
    {
      slug: "developer-portfolio",
      title: "Personal Developer Portfolio",
      category: "Landing Page",
      filter: "landing",
      status: "Live",
      summary: "This website — a fast, accessible portfolio with dark/light themes, project filtering and a content data file.",
      tech: ["HTML", "CSS", "JavaScript", "Vercel Functions"],
      thumbnail: "assets/img/projects/developer-portfolio.webp",
      thumbType: "screenshot",
      demoUrl: "./",
      codeUrl: null,
      caseStudy: {
        overview: "The portfolio you're viewing now. It presents my work, skills and services, and makes it easy for clients and recruiters to contact me.",
        problem: "I needed one professional place to show what I can do and to give potential clients a fast way to reach me.",
        goals: ["Fast, dependency-light and easy to deploy", "All content editable from one data file", "Accessible, responsive and themeable", "Honest presentation of projects"],
        approach: "A dark, developer-inspired design with electric-blue accents, built with plain HTML, CSS and JavaScript — no build step required.",
        features: ["Dark/light theme with saved preference", "Project filtering", "Reusable case-study template", "WhatsApp, call and copy-number actions", "Validated contact form with optional email delivery", "Reduced-motion support and keyboard navigation"],
        challenges: ["Driving all lists from a single data file while keeping key text in HTML for search engines."],
        results: [],
        note: "",
      },
    },
    {
      slug: "business-analytics-dashboard",
      title: "Business Analytics Dashboard",
      category: "Web Application",
      filter: "webapp",
      status: "Demo Project",
      summary: "A working analytics dashboard demo with KPI cards, interactive charts, date ranges and a sortable orders table.",
      tech: ["HTML", "CSS", "JavaScript", "SVG Charts"],
      thumbnail: "assets/img/projects/business-analytics-dashboard.webp",
      thumbType: "screenshot",
      demoUrl: "demos/dashboard/",
      codeUrl: null,
      caseStudy: {
        overview: "A sales dashboard for a fictional retail business, showing revenue, orders and top categories over selectable time ranges.",
        problem: "Business owners often keep sales data in spreadsheets, making it hard to see trends at a glance.",
        goals: ["Headline KPIs with period-over-period change", "Interactive revenue trend chart", "Category breakdown", "Searchable, sortable orders table"],
        approach: "A clean dashboard layout with hand-built SVG charts (no chart library), hover tooltips and a table view of the data.",
        features: ["7 / 30 / 90-day ranges", "KPI cards with change indicators", "Line chart with crosshair tooltip", "Bar chart by category", "Sortable, searchable orders table", "Light and dark themes"],
        challenges: ["Building accessible, responsive SVG charts from scratch.", "Generating realistic sample data deterministically."],
        results: [],
        note: "This is a demonstration project using generated sample data.",
      },
    },
  ],
};
