export type QuestionType = "about" | "soft" | "hard";
export type Role = "all" | "qa" | "pm" | "bsa";
export type Stage = "Phone Screen" | "HR" | "Technical" | "HM Interview" | "Final Round";

export interface PlanItem { n: string; t: string; }
export interface Question {
  id: string;
  q: string;
  role: Role;
  type: QuestionType;
  stage: Stage;
  plan: PlanItem[];
}

export const defaultQuestions: Question[] = [
  { id:"q1", q:"Tell me about yourself", role:"all", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"I'm Kristina — BSA, QA, PM with 3+ years in enterprise healthcare IT and ERP/CRM systems"},
    {n:"2",t:"Bachelor's degree in Business Informatics"},
    {n:"3",t:"Started as intern QA engineer → grew to QA Lead with PM responsibilities"},
    {n:"4",t:"Key achievements at Softrust: reduced production defects 7% → 0% + implemented Agile ceremonies"},
    {n:"5",t:"Second chapter: independent consultant — PM and AI developer"},
    {n:"6",t:"Built end-to-end system that eliminated lost orders and automated supplier communication"},
    {n:"7",t:"Big fan of IT, AI, and new technologies"},
    {n:"8",t:"Close: 'I'm really excited to bring this background to [company name]' — adapt per role"},
  ]},
  { id:"q2", q:"Walk me through your resume", role:"all", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"2023 — intern QA at Softrust, 2nd most complex project, no docs"},
    {n:"2",t:"Grew to QA Lead — 5 parallel projects, 7 core modules, 300K users"},
    {n:"3",t:"Took on PM responsibilities — no dedicated PM on team"},
    {n:"4",t:"2025 — independent consultant, ERP in 9 days, 337 orders, 0 failures"},
    {n:"5",t:"Now — looking for international opportunity, this role is right next step"},
  ]},
  { id:"q3", q:"Why are you interested in this role / company?", role:"all", type:"about", stage:"Phone Screen", plan:[
    {n:"JB QA",t:"TeamCity is daily tool — step 2 in every test cycle"},
    {n:"JB PM",t:"Want to contribute to delivery of tools I use every day"},
    {n:"Affirm",t:"Remote-first, automation-driven, fintech — matches background"},
    {n:"!",t:"Always add 1 specific detail from website — shows research"},
  ]},
  { id:"q4", q:"Why are you looking for a new opportunity?", role:"all", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"Great experience at Softrust — grew from intern to QA Lead + PM"},
    {n:"2",t:"Reached a plateau — achieved what I could in that environment"},
    {n:"3",t:"Decision: move into international IT for growth"},
    {n:"4",t:"This role is the right next step for the direction I want to grow"},
  ]},
  { id:"q5", q:"Do you require work authorization / sponsorship?", role:"all", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"In process of obtaining work permit — happy to discuss timeline"},
    {n:"2",t:"JetBrains → relocating, Madrid preferred"},
    {n:"3",t:"Affirm → eligible to work in Canada"},
    {n:"4",t:"Practical step already started, not a barrier"},
  ]},
  { id:"q6", q:"What are your salary expectations?", role:"all", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"Ask their range first: 'What is the range budgeted for this role?'"},
    {n:"2",t:"If they push → give researched range for the market"},
    {n:"3",t:"Open to discussing full package including benefits"},
  ]},
  { id:"q7", q:"What is your weakness?", role:"all", type:"about", stage:"HR", plan:[
    {n:"1",t:"Name it: conversational English — not native, takes effort under pressure"},
    {n:"2",t:"Context: written English strong — documentation, reports daily"},
    {n:"3",t:"Action: private tutor + speaking club + daily English practice"},
    {n:"4",t:"Progress: real improvement over past months"},
    {n:"5",t:"Upside: made me more deliberate and clear communicator"},
  ]},
  { id:"q8", q:"What is your greatest strength?", role:"all", type:"about", stage:"HR", plan:[
    {n:"1",t:"Strength: systems thinking — solve root cause, not symptoms"},
    {n:"2",t:"Example: new QA engineers picking up tasks wrong → mandatory test-case review"},
    {n:"3",t:"Impact: 4 engineers → 0 production defects in initial phase"},
    {n:"4",t:"In this role: same — find friction, build system that removes it"},
  ]},
  { id:"q9", q:"Where do you see yourself in 5 years?", role:"all", type:"about", stage:"HR", plan:[
    {n:"QA",t:"Senior QA — deep CI/CD quality and integration testing expertise"},
    {n:"PM",t:"Senior PM at intersection of AI and product delivery"},
    {n:"BSA",t:"Senior BSA moving toward PM — analytical foundation + higher decisions"},
    {n:"!",t:"Check interviewer's title first. Never aim at their exact position."},
  ]},
  { id:"q10", q:"How big is your team?", role:"all", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"QA team I led: 3 specialists — Junior QA to Middle QA, only QA Lead"},
    {n:"2",t:"Full project team: 7 people — developers, analysts, QA across levels"},
    {n:"3",t:"Across 5 parallel projects: many more stakeholders regularly"},
  ]},
  { id:"q11", q:"Tell me about a time you failed.", role:"all", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"Joined Softrust as intern, 2nd most complex project, almost no documentation"},
    {n:"T",t:"Learn project, regulations, hard skills — execute QA tasks"},
    {n:"A",t:"FAILURE: focused only on hard skills → became isolated from team after 2 months"},
    {n:"A",t:"FIX: deliberate shift — studied Agile, joined team rituals, proposed process improvements"},
    {n:"R",t:"Gained soft skills, facilitation, process thinking → led to QA Lead + PM responsibilities"},
    {n:"L",t:"Lesson: technical skill alone is not enough — being part of a team is an active skill"},
  ]},
  { id:"q12", q:"Tell me about working on multiple projects simultaneously.", role:"all", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"5 concurrent regional implementations, parallel timelines, different stakeholders"},
    {n:"T",t:"Quality across all 5 + manage QA team of 3 + stakeholder reporting"},
    {n:"A",t:"3-step framework: 1) stakeholder + priority + deadline in tracker"},
    {n:"",t:"→ 2) conversation to confirm time required"},
    {n:"",t:"→ 3) estimate team workload vs current priorities"},
    {n:"R",t:"Met deadlines across all 5 → moved from high-risk → assigned new project"},
    {n:"L",t:"Prioritization at scale needs structure, not just effort"},
  ]},
  { id:"q13", q:"What types of testing have you done most?", role:"qa", type:"hard", stage:"Phone Screen", plan:[
    {n:"1",t:"Primary: integration, API, regression, system testing"},
    {n:"2",t:"Tools: Postman (API), Jaeger (traces), Allure, Jira"},
    {n:"3",t:"Context: healthcare platform — payment, insurance, government integrations"},
    {n:"4",t:"Also: functional, smoke, sanity, exploratory — every release cycle"},
  ]},
  { id:"q14", q:"Have you worked with CI/CD tools?", role:"qa", type:"hard", stage:"Phone Screen", plan:[
    {n:"1",t:"Yes — TeamCity is step 2 in my daily test workflow"},
    {n:"2",t:"Trigger build → collect artifacts → monitor statuses → start test"},
    {n:"3",t:"User perspective: know what silent build failure looks like and how to trace it"},
    {n:"4",t:"Also: Bitbucket, Docker for local env and container deployment"},
  ]},
  { id:"q15", q:"Are you comfortable testing without full specifications?", role:"qa", type:"soft", stage:"Phone Screen", plan:[
    {n:"S",t:"First project at Softrust — 2nd most complex, only documentation = page navigation"},
    {n:"A",t:"Study adjacent functionality → form hypothesis → test it → trace result"},
    {n:"R",t:"Built a habit — working without specs is my default mode now"},
  ]},
  { id:"q16", q:"How do you approach testing a new feature with no specification?", role:"qa", type:"hard", stage:"Technical", plan:[
    {n:"1",t:"Study adjacent functionality to understand system logic"},
    {n:"2",t:"Form hypotheses about expected behavior"},
    {n:"3",t:"Write test cases → submit for dev review"},
    {n:"4",t:"Execute, trace results, update cases based on findings"},
    {n:"5",t:"Document gaps and flag for stakeholders"},
  ]},
  { id:"q17", q:"Explain your approach to risk-based testing.", role:"qa", type:"hard", stage:"Technical", plan:[
    {n:"1",t:"Prioritize by: business impact × probability of defect"},
    {n:"2",t:"Critical paths always fully covered — edge cases deprioritized if time pressure"},
    {n:"3",t:"Define what blocks release vs ships as known issue"},
    {n:"4",t:"Communicate risk clearly — stakeholder decides to ship, my job to inform"},
  ]},
  { id:"q18", q:"How do you use Jaeger in your work?", role:"qa", type:"hard", stage:"Technical", plan:[
    {n:"1",t:"Distributed tracing — follow request chain across microservices"},
    {n:"2",t:"Localize exactly where in chain a failure occurs"},
    {n:"3",t:"Used for: government portal, insurance, payment integrations"},
    {n:"4",t:"Without it: multi-service failures are hard to reproduce"},
  ]},
  { id:"q19", q:"How did you use TeamCity in testing workflow?", role:"qa", type:"hard", stage:"Technical", plan:[
    {n:"1",t:"Step 2 in every test cycle — after getting a task"},
    {n:"2",t:"Collect artifacts from build, monitor statuses"},
    {n:"3",t:"Real case: caught silent build failure that would have misled test result"},
    {n:"4",t:"Traced it back, reported to developer, saved incorrect test execution"},
  ]},
  { id:"q20", q:"Write a SQL query to find duplicate records.", role:"qa", type:"hard", stage:"Technical", plan:[
    {n:"1",t:"SELECT column, COUNT(*) FROM table"},
    {n:"2",t:"GROUP BY column"},
    {n:"3",t:"HAVING COUNT(*) > 1"},
    {n:"4",t:"Context: used SQL to validate data mapping in integration testing"},
  ]},
  { id:"q21", q:"Tell me about a time you found a critical bug close to release.", role:"qa", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"Regression cycle, close to release deadline on regional implementation"},
    {n:"T",t:"Decide: escalate and delay, or document as known issue"},
    {n:"A",t:"Document with full steps + assess business impact + escalate with risk summary"},
    {n:"R",t:"Release delayed one sprint → fix implemented → no production incident"},
    {n:"L",t:"Quality = communicating risk clearly at the right moment"},
  ]},
  { id:"q22", q:"Tell me about a process improvement you introduced.", role:"qa", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"New QA engineers going straight to testing without understanding the task"},
    {n:"T",t:"Reduce rework and missed edge cases — responsibility as QA Lead"},
    {n:"A",t:"Mandatory step: write test cases first → submit to mentor for review → then test"},
    {n:"R",t:"4 engineers onboarded → 0 production defects in initial phase"},
    {n:"L",t:"30-min review costs less than 1 production incident"},
  ]},
  { id:"q23", q:"How do you make release-readiness decisions?", role:"qa", type:"hard", stage:"HM Interview", plan:[
    {n:"1",t:"Check 4 exit criteria:"},
    {n:"",t:"→ Test case coverage — all critical scenarios covered?"},
    {n:"",t:"→ Open defects — any critical/high severity unresolved?"},
    {n:"",t:"→ Regression — complete and green?"},
    {n:"",t:"→ Stakeholder sign-off — UAT confirmed?"},
    {n:"2",t:"Track in Jira — defect trends, execution progress, open issues"},
    {n:"3",t:"Grey areas: document known issues + ship/delay = stakeholder decision"},
  ]},
  { id:"q24", q:"How do you prefer to collaborate with developers?", role:"qa", type:"soft", stage:"Final Round", plan:[
    {n:"1",t:"Involve before testing — review requirements together"},
    {n:"2",t:"Constructive defect feedback — clear reproduction + impact, not blame"},
    {n:"3",t:"Example: introduced requirements review step with devs before each sprint"},
    {n:"4",t:"QA vs Dev is not competition — shared goal is no production incident"},
  ]},
  { id:"q25", q:"What would you do in your first 30 days? (QA)", role:"qa", type:"soft", stage:"Final Round", plan:[
    {n:"1",t:"Use the product as a user first — understand what QA is protecting"},
    {n:"2",t:"Talk to every team member: biggest pain in quality right now?"},
    {n:"3",t:"Map the release process — where do defects typically appear?"},
    {n:"4",t:"Find one small quick win — visible contribution, not a big change"},
  ]},
  { id:"q26", q:"How many years of PM experience do you have?", role:"pm", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"3+ years hands-on PM — title was QA Lead, functions were PM"},
    {n:"2",t:"No dedicated PM → I took it: sprint planning, deadline tracking, reporting"},
    {n:"3",t:"5 parallel projects, 7 engineers, cross-team coordination"},
    {n:"4",t:"Result: team moved from high-risk → assigned new project by client"},
  ]},
  { id:"q27", q:"Have you worked as liaison between technical and business teams?", role:"pm", type:"soft", stage:"Phone Screen", plan:[
    {n:"1",t:"Yes — daily at Softrust across 5 projects"},
    {n:"2",t:"Example: 3 teams assigned same feature → facilitated session → shared service"},
    {n:"3",t:"Also: patient registration legal edge case — aligned business, dev, compliance"},
  ]},
  { id:"q28", q:"Tell me about a time you took ownership without being asked.", role:"pm", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"Softrust — no dedicated PM, team missing deadlines, no reporting"},
    {n:"T",t:"Nobody asked — I saw the problem and decided to fix it"},
    {n:"A",t:"Sprint planning + Kanban + messenger channel + reminders + deadline board + reports"},
    {n:"R",t:"Deadlines met → penalties stopped → high-risk status removed → new project assigned"},
    {n:"L",t:"Ownership is not about title — it is about seeing a problem and deciding to solve it"},
  ]},
  { id:"q29", q:"Describe a time you identified a risk before it became a problem.", role:"pm", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"Sprint planning — same clinical feature, 3 tasks, 3 teams, no domain knowledge"},
    {n:"T",t:"If built separately → 3 inconsistent implementations, integration risk, maintenance"},
    {n:"A",t:"Facilitated cross-team session → proposed shared service + frontend-only for other teams"},
    {n:"R",t:"Approved, shipped as one clean implementation → also introduced pre-sprint requirements review"},
    {n:"L",t:"Risk identification happens at planning, not testing — earlier = cheaper"},
  ]},
  { id:"q30", q:"Describe a process you built from scratch.", role:"pm", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"No coordination structure — meetings skipped, ownership unclear, deadline visibility poor"},
    {n:"T",t:"Build infrastructure the team would actually use"},
    {n:"A",t:"4 pieces: messenger channel + calendar reminders + Kanban board + physical deadline board"},
    {n:"",t:"+ structured stakeholder reports — task volume, priorities, engagement, highlights"},
    {n:"R",t:"Delivery improved, stakeholders had regular visibility without chasing"},
    {n:"L",t:"Simple systems that remove friction beat complex ones nobody uses"},
  ]},
  { id:"q31", q:"What do you do when a team member misses deadlines?", role:"pm", type:"soft", stage:"HM Interview", plan:[
    {n:"1",t:"First: 1:1 conversation — understand the reason, not assume"},
    {n:"2",t:"Adjust plan if workload is the issue"},
    {n:"3",t:"Set clear expectations and a recovery timeline"},
    {n:"4",t:"Escalate only if pattern repeats after conversation"},
    {n:"5",t:"Never: public blame or assumption of bad intent"},
  ]},
  { id:"q32", q:"What would you prioritize in your first 90 days? (PM)", role:"pm", type:"soft", stage:"HM Interview", plan:[
    {n:"M1",t:"Understand — existing processes, team dynamics, current pain points"},
    {n:"M2",t:"Map — where are the bottlenecks, what is missing"},
    {n:"M3",t:"Propose one concrete improvement — visible, not a big change"},
    {n:"!",t:"Rule: don't break what already works — earn trust before changing things"},
  ]},
  { id:"q33", q:"How do you handle disagreement with your plan from the team?", role:"pm", type:"soft", stage:"Final Round", plan:[
    {n:"1",t:"Listen fully — understand the argument before responding"},
    {n:"2",t:"If argument is strong → adjust the plan, say so explicitly"},
    {n:"3",t:"If staying with plan → explain reasoning, not just the decision"},
    {n:"4",t:"Never: override without explanation or dismiss without listening"},
  ]},
  { id:"q34", q:"How many years of BA experience do you have?", role:"bsa", type:"about", stage:"Phone Screen", plan:[
    {n:"1",t:"3+ years combined BSA/QA Lead — BA work throughout, increasing focus from 2024"},
    {n:"2",t:"Requirements: gathered, documented BRD/PRD, gap analysis, acceptance criteria"},
    {n:"3",t:"Liaison: business stakeholders ↔ engineering — daily"},
    {n:"4",t:"Independent project: full BA lifecycle end-to-end, ERP in 9 days"},
  ]},
  { id:"q35", q:"Are you familiar with Salesforce?", role:"bsa", type:"hard", stage:"Phone Screen", plan:[
    {n:"1",t:"No direct Salesforce experience — say it clearly"},
    {n:"2",t:"But: worked with CRM-integrated ERP systems, validated data flows, mapped integrations"},
    {n:"3",t:"Evidence of speed: full ERP stack mastered in 9-day delivery"},
    {n:"4",t:"Close: researching Salesforce now in preparation for this role"},
  ]},
  { id:"q36", q:"Walk me through how you gather requirements.", role:"bsa", type:"hard", stage:"Technical", plan:[
    {n:"1",t:"Stakeholder interviews — who, what, why"},
    {n:"2",t:"On-site observation if possible — see real process, not the described one"},
    {n:"3",t:"Document AS-IS → identify gaps → define TO-BE"},
    {n:"4",t:"Produce BRD (what business needs) + PRD (what system does)"},
    {n:"5",t:"Define acceptance criteria — how we know it is done"},
    {n:"6",t:"Review with stakeholders → sign-off before development starts"},
  ]},
  { id:"q37", q:"How do you handle conflicting requirements?", role:"bsa", type:"soft", stage:"Technical", plan:[
    {n:"S",t:"Patient registration — business, dev, compliance had different expectations"},
    {n:"T",t:"Resolve without losing any stakeholder's core requirement"},
    {n:"A",t:"Document each position → facilitate joint session → propose configurable setting solution"},
    {n:"R",t:"All agreed → one clean implementation covered all legal cases"},
    {n:"L",t:"Framework: document first → facilitate second → propose third (never bilateral)"},
  ]},
  { id:"q38", q:"Walk me through a requirements document you produced.", role:"bsa", type:"hard", stage:"Technical", plan:[
    {n:"1",t:"Context: independent ERP project — BRD and PRD from scratch"},
    {n:"2",t:"BRD: business problem → current state → 4 gaps → stakeholder map → functional requirements"},
    {n:"3",t:"PRD: user workflows → system architecture → 30+ API integration specs → acceptance criteria → out of scope"},
    {n:"4",t:"UML: AS-IS and TO-BE process diagrams for stakeholder communication"},
    {n:"5",t:"Outcome: 9-day delivery, 0 rework after launch"},
  ]},
  { id:"q39", q:"Tell me about a complex system you analyzed end-to-end.", role:"bsa", type:"soft", stage:"HM Interview", plan:[
    {n:"S",t:"Small business client — coffee shop + flower boutique, no order system"},
    {n:"T",t:"Sole analyst + PM — full lifecycle from discovery to production"},
    {n:"A",t:"Interviews → observation → 4 critical gaps → BRD/PRD → UML → 30+ API delivery"},
    {n:"R",t:"9 days, 337 orders month 1, 0 failures, 0 lost orders"},
    {n:"L",t:"Real requirement ≠ first thing stakeholder says → gap analysis revealed root problem"},
  ]},
  { id:"q40", q:"How do you prioritize requirements when everything is urgent?", role:"bsa", type:"hard", stage:"HM Interview", plan:[
    {n:"1",t:"MoSCoW: Must / Should / Could / Won't for this release"},
    {n:"2",t:"Ask: what breaks the business if not delivered? → Must"},
    {n:"3",t:"Estimate impact vs effort for each item"},
    {n:"4",t:"Document the prioritization — stakeholder sign-off on what is deferred"},
    {n:"5",t:"Revisit each sprint — priorities change"},
  ]},
  { id:"q41", q:"How do you work with engineers who push back on requirements?", role:"bsa", type:"soft", stage:"Final Round", plan:[
    {n:"1",t:"First: understand the technical constraint — it may be valid"},
    {n:"2",t:"If constraint is real → find alternative that meets business need differently"},
    {n:"3",t:"If pushback is preference → explain business impact clearly"},
    {n:"4",t:"Always document the decision — what changed and why"},
    {n:"5",t:"Requirements are not sacred — the business outcome is"},
  ]},
  { id:"q42", q:"What does success look like after 6 months? (BSA)", role:"bsa", type:"soft", stage:"Final Round", plan:[
    {n:"1",t:"Understand the Salesforce + billing system stack"},
    {n:"2",t:"Own at least one end-to-end requirements lifecycle independently"},
    {n:"3",t:"Build trust with Engineering and Product teams"},
    {n:"4",t:"Deliver one process improvement in how requirements are gathered"},
  ]},
];
