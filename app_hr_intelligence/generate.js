#!/usr/bin/env node
// Generator for HR Intelligence metadata files
// Run: node generate.js
// Produces: metadata_app.json and metadata_app_data.json

const fs = require('fs');
const path = require('path');

// ─── Reference Data ───────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { code: 'ENG', name: 'Engineering', cost_center: 'CC-100', weight: 0.20 },
  { code: 'SAL', name: 'Sales', cost_center: 'CC-200', weight: 0.15 },
  { code: 'MKT', name: 'Marketing', cost_center: 'CC-300', weight: 0.08 },
  { code: 'HRD', name: 'Human Resources', cost_center: 'CC-400', weight: 0.04 },
  { code: 'FIN', name: 'Finance', cost_center: 'CC-500', weight: 0.05 },
  { code: 'LEG', name: 'Legal', cost_center: 'CC-600', weight: 0.03 },
  { code: 'OPS', name: 'Operations', cost_center: 'CC-700', weight: 0.06 },
  { code: 'SUP', name: 'Customer Support', cost_center: 'CC-800', weight: 0.07 },
  { code: 'PRD', name: 'Product', cost_center: 'CC-900', weight: 0.05 },
  { code: 'DES', name: 'Design', cost_center: 'CC-1000', weight: 0.04 },
  { code: 'DAT', name: 'Data Science', cost_center: 'CC-1100', weight: 0.04 },
  { code: 'SEC', name: 'Security', cost_center: 'CC-1200', weight: 0.03 },
  { code: 'QAT', name: 'Quality Assurance', cost_center: 'CC-1300', weight: 0.03 },
  { code: 'DOP', name: 'DevOps', cost_center: 'CC-1400', weight: 0.03 },
  { code: 'RES', name: 'Research', cost_center: 'CC-1500', weight: 0.02 },
  { code: 'PRC', name: 'Procurement', cost_center: 'CC-1600', weight: 0.02 },
  { code: 'FAC', name: 'Facilities', cost_center: 'CC-1700', weight: 0.02 },
  { code: 'ITS', name: 'IT Services', cost_center: 'CC-1800', weight: 0.02 },
  { code: 'EXC', name: 'Executive', cost_center: 'CC-1900', weight: 0.01 },
  { code: 'STR', name: 'Strategy', cost_center: 'CC-2000', weight: 0.01 }
];

const LOCATIONS = [
  { code: 'NYC', name: 'New York Office', city: 'New York', country: 'USA', region: 'North America', weight: 0.15, col: 1.20 },
  { code: 'LDN', name: 'London Office', city: 'London', country: 'United Kingdom', region: 'Europe', weight: 0.12, col: 1.15 },
  { code: 'BER', name: 'Berlin Office', city: 'Berlin', country: 'Germany', region: 'Europe', weight: 0.08, col: 1.05 },
  { code: 'TKY', name: 'Tokyo Office', city: 'Tokyo', country: 'Japan', region: 'Asia Pacific', weight: 0.07, col: 1.10 },
  { code: 'SYD', name: 'Sydney Office', city: 'Sydney', country: 'Australia', region: 'Asia Pacific', weight: 0.06, col: 1.08 },
  { code: 'TOR', name: 'Toronto Office', city: 'Toronto', country: 'Canada', region: 'North America', weight: 0.07, col: 1.05 },
  { code: 'SGP', name: 'Singapore Office', city: 'Singapore', country: 'Singapore', region: 'Asia Pacific', weight: 0.08, col: 1.12 },
  { code: 'SAO', name: 'Sao Paulo Office', city: 'Sao Paulo', country: 'Brazil', region: 'South America', weight: 0.06, col: 0.75 },
  { code: 'MUM', name: 'Mumbai Office', city: 'Mumbai', country: 'India', region: 'Asia Pacific', weight: 0.09, col: 0.60 },
  { code: 'DXB', name: 'Dubai Office', city: 'Dubai', country: 'UAE', region: 'Middle East', weight: 0.05, col: 1.00 },
  { code: 'AMS', name: 'Amsterdam Office', city: 'Amsterdam', country: 'Netherlands', region: 'Europe', weight: 0.07, col: 1.10 },
  { code: 'SFO', name: 'San Francisco Office', city: 'San Francisco', country: 'USA', region: 'North America', weight: 0.10, col: 1.30 }
];

const LEVELS = [
  { code: 'L1', name: 'Intern', rank: 1, weight: 0.05, salary_base: 35000 },
  { code: 'L2', name: 'Junior', rank: 2, weight: 0.15, salary_base: 55000 },
  { code: 'L3', name: 'Mid-Level', rank: 3, weight: 0.25, salary_base: 75000 },
  { code: 'L4', name: 'Senior', rank: 4, weight: 0.20, salary_base: 100000 },
  { code: 'L5', name: 'Staff', rank: 5, weight: 0.15, salary_base: 130000 },
  { code: 'L6', name: 'Principal', rank: 6, weight: 0.10, salary_base: 160000 },
  { code: 'L7', name: 'Director', rank: 7, weight: 0.07, salary_base: 200000 },
  { code: 'L8', name: 'C-Suite', rank: 8, weight: 0.03, salary_base: 280000 }
];

const SKILLS = [
  { code: 'JS', name: 'JavaScript', category: 'Technical' },
  { code: 'PY', name: 'Python', category: 'Technical' },
  { code: 'RS', name: 'Rust', category: 'Technical' },
  { code: 'GO', name: 'Go', category: 'Technical' },
  { code: 'SQL', name: 'SQL', category: 'Technical' },
  { code: 'AWS', name: 'AWS Cloud', category: 'Technical' },
  { code: 'K8S', name: 'Kubernetes', category: 'Technical' },
  { code: 'ML', name: 'Machine Learning', category: 'Technical' },
  { code: 'DS', name: 'Data Science', category: 'Technical' },
  { code: 'SEC', name: 'Cybersecurity', category: 'Technical' },
  { code: 'NET', name: 'Networking', category: 'Technical' },
  { code: 'UXD', name: 'UX Design', category: 'Technical' },
  { code: 'MOB', name: 'Mobile Development', category: 'Technical' },
  { code: 'DEV', name: 'DevOps', category: 'Technical' },
  { code: 'QA', name: 'Test Automation', category: 'Technical' },
  { code: 'LDR', name: 'Leadership', category: 'Soft Skill' },
  { code: 'COM', name: 'Communication', category: 'Soft Skill' },
  { code: 'PM', name: 'Project Management', category: 'Soft Skill' },
  { code: 'NEG', name: 'Negotiation', category: 'Soft Skill' },
  { code: 'PRE', name: 'Presentation', category: 'Soft Skill' },
  { code: 'ANA', name: 'Analytical Thinking', category: 'Soft Skill' },
  { code: 'CRT', name: 'Critical Thinking', category: 'Soft Skill' },
  { code: 'TMW', name: 'Teamwork', category: 'Soft Skill' },
  { code: 'AGI', name: 'Agile Methodology', category: 'Process' },
  { code: 'SCR', name: 'Scrum', category: 'Process' },
  { code: 'KAN', name: 'Kanban', category: 'Process' },
  { code: 'FNA', name: 'Financial Analysis', category: 'Domain' },
  { code: 'MKA', name: 'Market Analysis', category: 'Domain' },
  { code: 'REG', name: 'Regulatory Compliance', category: 'Domain' },
  { code: 'CRM', name: 'CRM Systems', category: 'Domain' }
];

const DEPT_SKILLS = {
  ENG: ['JS','PY','RS','GO','SQL','AWS','K8S','DEV','QA','MOB','AGI','SCR'],
  SAL: ['NEG','PRE','COM','CRM','MKA','LDR','ANA'],
  MKT: ['COM','PRE','MKA','CRM','ANA','UXD'],
  HRD: ['COM','LDR','PM','NEG','PRE','ANA'],
  FIN: ['FNA','SQL','ANA','CRT','REG'],
  LEG: ['REG','NEG','CRT','ANA','COM'],
  OPS: ['PM','AGI','KAN','ANA','LDR','K8S'],
  SUP: ['COM','CRM','TMW','PRE','ANA'],
  PRD: ['PM','AGI','SCR','ANA','UXD','COM','LDR'],
  DES: ['UXD','COM','PRE','CRT','AGI'],
  DAT: ['PY','ML','DS','SQL','ANA','AWS'],
  SEC: ['SEC','NET','AWS','PY','CRT'],
  QAT: ['QA','PY','JS','AGI','SCR','ANA'],
  DOP: ['K8S','AWS','DEV','GO','PY','NET'],
  RES: ['ML','PY','DS','ANA','CRT'],
  PRC: ['NEG','FNA','REG','ANA','COM'],
  FAC: ['PM','COM','TMW','ANA'],
  ITS: ['NET','AWS','K8S','SEC','DEV'],
  EXC: ['LDR','COM','NEG','PRE','ANA','CRT','PM'],
  STR: ['ANA','CRT','MKA','FNA','LDR','PRE']
};

const TRAININGS = [
  { code: 'TRN-AWS', name: 'AWS Solutions Architect', duration: 5, cost: 2500, skill: 'AWS', status_dist: [0.1,0.2,0.6,0.1] },
  { code: 'TRN-K8S', name: 'Kubernetes Administration', duration: 3, cost: 1800, skill: 'K8S', status_dist: [0.15,0.25,0.5,0.1] },
  { code: 'TRN-ML', name: 'Machine Learning Fundamentals', duration: 10, cost: 4500, skill: 'ML', status_dist: [0.1,0.3,0.5,0.1] },
  { code: 'TRN-RS', name: 'Rust Programming Bootcamp', duration: 5, cost: 2000, skill: 'RS', status_dist: [0.1,0.2,0.6,0.1] },
  { code: 'TRN-SEC', name: 'Cybersecurity Essentials', duration: 4, cost: 2200, skill: 'SEC', status_dist: [0.1,0.15,0.65,0.1] },
  { code: 'TRN-LDR', name: 'Leadership Development', duration: 3, cost: 3000, skill: 'LDR', status_dist: [0.1,0.2,0.6,0.1] },
  { code: 'TRN-AGI', name: 'Agile Practitioner', duration: 2, cost: 1200, skill: 'AGI', status_dist: [0.05,0.15,0.7,0.1] },
  { code: 'TRN-PM', name: 'Project Management Professional', duration: 5, cost: 3500, skill: 'PM', status_dist: [0.1,0.25,0.55,0.1] },
  { code: 'TRN-DS', name: 'Data Science with Python', duration: 8, cost: 3800, skill: 'DS', status_dist: [0.1,0.3,0.5,0.1] },
  { code: 'TRN-UX', name: 'UX Research and Design', duration: 4, cost: 2000, skill: 'UXD', status_dist: [0.1,0.2,0.6,0.1] },
  { code: 'TRN-NEG', name: 'Advanced Negotiation', duration: 2, cost: 1500, skill: 'NEG', status_dist: [0.05,0.15,0.7,0.1] },
  { code: 'TRN-SQL', name: 'Advanced SQL and Database Design', duration: 3, cost: 1600, skill: 'SQL', status_dist: [0.1,0.2,0.6,0.1] },
  { code: 'TRN-COM', name: 'Effective Communication', duration: 2, cost: 1000, skill: 'COM', status_dist: [0.05,0.1,0.75,0.1] },
  { code: 'TRN-FNA', name: 'Financial Modeling', duration: 4, cost: 2800, skill: 'FNA', status_dist: [0.1,0.2,0.6,0.1] },
  { code: 'TRN-REG', name: 'Regulatory Compliance Training', duration: 2, cost: 1200, skill: 'REG', status_dist: [0.05,0.1,0.75,0.1] }
];

const TEAMS = [
  { code: 'PLAT', name: 'Platform Team', dept: 'ENG' },
  { code: 'FEND', name: 'Frontend Team', dept: 'ENG' },
  { code: 'BEND', name: 'Backend Team', dept: 'ENG' },
  { code: 'MOBI', name: 'Mobile Team', dept: 'ENG' },
  { code: 'INFR', name: 'Infrastructure Team', dept: 'DOP' },
  { code: 'SALE', name: 'Enterprise Sales', dept: 'SAL' },
  { code: 'SMBS', name: 'SMB Sales', dept: 'SAL' },
  { code: 'SDRS', name: 'SDR Team', dept: 'SAL' },
  { code: 'DMAR', name: 'Digital Marketing', dept: 'MKT' },
  { code: 'BMAR', name: 'Brand Marketing', dept: 'MKT' },
  { code: 'TAQC', name: 'Talent Acquisition', dept: 'HRD' },
  { code: 'COMP', name: 'Compensation and Benefits', dept: 'HRD' },
  { code: 'FINA', name: 'Financial Planning', dept: 'FIN' },
  { code: 'ACCT', name: 'Accounting', dept: 'FIN' },
  { code: 'CORP', name: 'Corporate Legal', dept: 'LEG' },
  { code: 'SUPT', name: 'Technical Support', dept: 'SUP' },
  { code: 'CSUC', name: 'Customer Success', dept: 'SUP' },
  { code: 'POWN', name: 'Product Owners', dept: 'PRD' },
  { code: 'UXTE', name: 'UX Team', dept: 'DES' },
  { code: 'MLTE', name: 'ML Engineering', dept: 'DAT' },
  { code: 'SECE', name: 'Security Engineering', dept: 'SEC' },
  { code: 'QAAU', name: 'QA Automation', dept: 'QAT' },
  { code: 'RESE', name: 'Research Lab', dept: 'RES' },
  { code: 'ITOP', name: 'IT Operations', dept: 'ITS' },
  { code: 'EXEC', name: 'Executive Team', dept: 'EXC' }
];

const FIRST_NAMES = [
  'James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','David','Elizabeth',
  'William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Christopher','Karen',
  'Charles','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra',
  'Donald','Ashley','Steven','Dorothy','Paul','Kimberly','Andrew','Emily','Joshua','Donna',
  'Kenneth','Michelle','Kevin','Carol','Brian','Amanda','George','Melissa','Timothy','Deborah',
  'Ronald','Stephanie','Edward','Rebecca','Jason','Sharon','Jeffrey','Laura','Ryan','Cynthia',
  'Jacob','Kathleen','Gary','Amy','Nicholas','Angela','Eric','Shirley','Jonathan','Anna',
  'Stephen','Brenda','Larry','Pamela','Justin','Emma','Scott','Nicole','Brandon','Helen',
  'Benjamin','Samantha','Samuel','Katherine','Raymond','Christine','Gregory','Debra','Frank','Rachel',
  'Alexander','Carolyn','Patrick','Janet','Jack','Catherine','Dennis','Maria','Jerry','Heather',
  'Tyler','Diane','Aaron','Ruth','Jose','Julie','Adam','Olivia','Nathan','Joyce',
  'Henry','Virginia','Douglas','Victoria','Zachary','Kelly','Peter','Lauren','Kyle','Christina',
  'Noah','Joan','Ethan','Evelyn','Jeremy','Judith','Walter','Megan','Christian','Andrea',
  'Keith','Cheryl','Roger','Hannah','Terry','Jacqueline','Austin','Martha','Sean','Gloria',
  'Gerald','Teresa','Carl','Ann','Harold','Sara','Dylan','Madison','Arthur','Frances',
  'Lawrence','Kathryn','Jordan','Janice','Jesse','Jean','Bryan','Abigail','Billy','Alice',
  'Bruce','Judy','Gabriel','Sophia','Joe','Grace','Logan','Denise','Albert','Amber',
  'Willie','Doris','Alan','Marilyn','Vincent','Danielle','Eugene','Beverly','Russell','Isabella',
  'Elijah','Theresa','Philip','Diana','Bobby','Natalie','Randy','Brittany','Harry','Charlotte',
  'Howard','Marie','Roy','Kayla','Wayne','Alexis','Liam','Lori'
];

const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
  'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
  'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson',
  'Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
  'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts',
  'Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes',
  'Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper',
  'Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson',
  'Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes',
  'Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez'
];

// ─── Deterministic pseudo-random ──────────────────────────────────────────────
let _seed = 42;
function rand() {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return (_seed >>> 0) / 0x7fffffff;
}
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function weightedPick(arr) {
  let r = rand(), cum = 0;
  for (const item of arr) { cum += item.weight; if (r < cum) return item; }
  return arr[arr.length - 1];
}
function pickN(arr, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(rand() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// ─── metadata_app.json ───────────────────────────────────────────────────────

function buildMetadataApp() {
  const app = {
    _comment: '=== APP HR INTELLIGENCE REACTIVE EXAMPLE ===',
    _description: 'Comprehensive HR system demonstrating entity modeling, relators, computations, events, and intelligence artifacts. Tracks 520 employees across 20 departments, 12 international locations, with skills, training, salary, performance, vacation, sentiment, and team data.',

    organizations: [{
      id: 'model1-testing-org',
      label: { en: 'Model1 Testing Org' },
      use_seed: true
    }],

    tenants: [{
      id: 'model1-testing-tenant',
      organization_id: 'model1-testing-org',
      label: { en: 'Model1 Testing Tenant' },
      use_seed: true
    }],

    universals: [],
    property_definitions: [],
    event_definitions: [],
    computations: [],
    data_schemas: [],
    artifact_definitions: [],
    apps: [],
    users: [],
    foundation_role_assignments: []
  };

  // ── Enumeration Universals ──────────────────────────────────────────────
  const enums = [
    { id: 'hr-employment-status', label: 'Employment Status', desc: 'Employee employment status enumeration' },
    { id: 'hr-contract-type', label: 'Contract Type', desc: 'Employment contract type enumeration' },
    { id: 'hr-event-type', label: 'Career Event Type', desc: 'Career and performance event type enumeration' },
    { id: 'hr-perf-rating', label: 'Performance Rating', desc: 'Performance review rating enumeration' },
    { id: 'hr-skill-proficiency', label: 'Skill Proficiency', desc: 'Skill proficiency level enumeration' },
    { id: 'hr-training-status', label: 'Training Status', desc: 'Training program status enumeration' },
    { id: 'hr-sentiment-rating', label: 'Sentiment Rating', desc: 'Employee sentiment survey rating enumeration' }
  ];
  for (const e of enums) {
    app.universals.push({
      _comment: `=== ENUMERATION UNIVERSAL: ${e.label} ===`,
      id: e.id,
      temporal_nature: 'Endurant',
      meta_category: 'Kind',
      label: { en: e.label },
      description: { en: e.desc },
      label_schema: { separator: '', max_length: 30, fallback_language: 'en' },
      use_seed: true
    });
    app.property_definitions.push({
      id: `${e.id}-name-prop`,
      universal_id: e.id,
      label: { en: 'Name' },
      property_schema: {
        predicates: ['name', 'code'],
        relator: { relator_type: 'Attribution' },
        constraints: {
          property_value_type: { type: 'Categorical', reference_universal_id: null, ordered: false },
          cardinality: { min: 1, max: 1 }
        }
      },
      label_options: { participates: true, sequence: 1 },
      use_seed: true
    });
  }

  // ── Entity Universals ──────────────────────────────────────────────────
  const entities = [
    { id: 'hr-employee', label: 'Employee', desc: 'Core employee record', temporal: 'Endurant', sep: ' ', max: 50 },
    { id: 'hr-department', label: 'Department', desc: 'Organizational unit', temporal: 'Endurant', sep: ' - ', max: 40 },
    { id: 'hr-level', label: 'Career Level', desc: 'Career grade or band', temporal: 'Endurant', sep: ' - ', max: 30 },
    { id: 'hr-location', label: 'Office Location', desc: 'Office site or location', temporal: 'Endurant', sep: ', ', max: 40 },
    { id: 'hr-contract', label: 'Employment Contract', desc: 'Employment contract details', temporal: 'Perdurant', sep: ' - ', max: 40 },
    { id: 'hr-skill', label: 'Skill', desc: 'Skill or competency type', temporal: 'Endurant', sep: ' - ', max: 40 },
    { id: 'hr-training', label: 'Training Program', desc: 'Training or certification program', temporal: 'Perdurant', sep: ' - ', max: 50 },
    { id: 'hr-salary-record', label: 'Salary Record', desc: 'Salary change history entry', temporal: 'Perdurant', sep: ' - ', max: 40 },
    { id: 'hr-perf-event', label: 'Performance Event', desc: 'Career or performance event record', temporal: 'Perdurant', sep: ' - ', max: 50 },
    { id: 'hr-vacation', label: 'Vacation Record', desc: 'Annual vacation allocation and usage', temporal: 'Perdurant', sep: ' - ', max: 30 },
    { id: 'hr-sentiment', label: 'Sentiment Survey', desc: 'Employee eNPS survey response', temporal: 'Perdurant', sep: ' - ', max: 40 },
    { id: 'hr-team', label: 'Team', desc: 'Team grouping within department', temporal: 'Endurant', sep: ' - ', max: 40 }
  ];
  for (const e of entities) {
    app.universals.push({
      _comment: `=== ENTITY: ${e.label} ===`,
      id: e.id,
      temporal_nature: e.temporal,
      meta_category: 'Kind',
      label: { en: e.label },
      description: { en: e.desc },
      label_schema: { separator: e.sep, max_length: e.max, fallback_language: 'en' },
      use_seed: true
    });
  }

  // ── Artifact Target Universal ──────────────────────────────────────────
  app.universals.push({
    _comment: '=== ENTITY: HR Analytics Summary (artifact target) ===',
    id: 'hr-analytics-summary',
    temporal_nature: 'Endurant',
    meta_category: 'Kind',
    label: { en: 'HR Analytics Summary' },
    description: { en: 'Materialized aggregate for HR analytics artifact definitions' },
    label_schema: { separator: ' - ', max_length: 50, fallback_language: 'en' },
    use_seed: true
  });

  // ── Relator Universals ──────────────────────────────────────────────────
  const relators = [
    { id: 'hr-emp-dept-rel', label: 'Employee Department', desc: 'Employee belongs to department', type: 'aggregation-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'department', uid: 'hr-department' }] },
    { id: 'hr-emp-level-rel', label: 'Employee Level', desc: 'Employee has career level', type: 'attribution-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'level', uid: 'hr-level' }] },
    { id: 'hr-emp-location-rel', label: 'Employee Location', desc: 'Employee works at location', type: 'attribution-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'location', uid: 'hr-location' }] },
    { id: 'hr-emp-contract-rel', label: 'Employee Contract', desc: 'Employee has employment contract', type: 'composition-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'contract', uid: 'hr-contract' }] },
    { id: 'hr-emp-skill-rel', label: 'Employee Skill', desc: 'Employee possesses skill', type: 'attribution-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'skill', uid: 'hr-skill' }] },
    { id: 'hr-emp-training-rel', label: 'Employee Training', desc: 'Employee enrolled in training program', type: 'participation-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'training', uid: 'hr-training' }] },
    { id: 'hr-training-skill-rel', label: 'Training Skill', desc: 'Training develops target skill (skill-gap affinity)', type: 'association-relator', roles: [{ name: 'training', uid: 'hr-training' }, { name: 'skill', uid: 'hr-skill' }] },
    { id: 'hr-emp-salary-rel', label: 'Employee Salary', desc: 'Employee salary history entry', type: 'composition-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'salary_record', uid: 'hr-salary-record' }] },
    { id: 'hr-emp-perf-rel', label: 'Employee Performance', desc: 'Employee performance event', type: 'composition-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'perf_event', uid: 'hr-perf-event' }] },
    { id: 'hr-emp-vacation-rel', label: 'Employee Vacation', desc: 'Employee vacation record', type: 'composition-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'vacation', uid: 'hr-vacation' }] },
    { id: 'hr-emp-sentiment-rel', label: 'Employee Sentiment', desc: 'Employee sentiment survey response', type: 'composition-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'sentiment', uid: 'hr-sentiment' }] },
    { id: 'hr-emp-team-rel', label: 'Employee Team', desc: 'Employee is team member', type: 'participation-relator', roles: [{ name: 'employee', uid: 'hr-employee' }, { name: 'team', uid: 'hr-team' }] },
    { id: 'hr-team-dept-rel', label: 'Team Department', desc: 'Team belongs to department', type: 'aggregation-relator', roles: [{ name: 'team', uid: 'hr-team' }, { name: 'department', uid: 'hr-department' }] }
  ];
  for (const r of relators) {
    app.universals.push({
      _comment: `=== RELATOR: ${r.label} ===`,
      id: r.id,
      temporal_nature: 'Perdurant',
      meta_category: 'Relator',
      label: { en: r.label },
      description: { en: r.desc },
      roles: r.roles.map(role => ({ name: role.name, universal_id: role.uid })),
      taxonomy: [{ relator_universal_id: 'generalization-relator', target_universal_id: r.type }],
      use_seed: true
    });
  }

  // ── Property Definitions ──────────────────────────────────────────────

  function catProp(id, uid, label, predicates, opts = {}) {
    const def = {
      id, universal_id: uid, label: { en: label },
      property_schema: {
        predicates,
        relator: { relator_type: 'Attribution' },
        constraints: {
          property_value_type: { type: 'Categorical', reference_universal_id: opts.ref || null, ordered: opts.ordered || false },
          cardinality: { min: opts.min ?? 1, max: opts.max ?? 1 }
        }
      },
      use_seed: true
    };
    if (opts.desc) def.description = { en: opts.desc };
    if (opts.label_seq) def.label_options = { participates: true, sequence: opts.label_seq, ...(opts.prefix ? { prefix: opts.prefix } : {}) };
    if (opts.allowed_values) def.property_schema.constraints.property_value_type.allowed_values = opts.allowed_values;
    return def;
  }
  function measProp(id, uid, label, predicates, frame, opts = {}) {
    const def = {
      id, universal_id: uid, label: { en: label },
      property_schema: {
        predicates,
        relator: { relator_type: 'Attribution' },
        constraints: {
          property_value_type: { type: 'Measurement', measurement_frame_id: frame },
          cardinality: { min: opts.min ?? 0, max: opts.max ?? 1 }
        }
      },
      use_seed: true
    };
    if (opts.desc) def.description = { en: opts.desc };
    if (opts.label_seq) def.label_options = { participates: true, sequence: opts.label_seq };
    return def;
  }

  // Employee
  app.property_definitions.push(
    catProp('hr-emp-employee-id', 'hr-employee', 'Employee ID', ['identifier', 'code'], { label_seq: 1, prefix: '#' }),
    catProp('hr-emp-first-name', 'hr-employee', 'First Name', ['name', 'first']),
    catProp('hr-emp-last-name', 'hr-employee', 'Last Name', ['name', 'last'], { label_seq: 2 }),
    catProp('hr-emp-email', 'hr-employee', 'Email', ['email', 'contact']),
    catProp('hr-emp-hire-date', 'hr-employee', 'Hire Date', ['date', 'hire'], { ordered: true, desc: 'Date of hire (ISO 8601)' }),
    catProp('hr-emp-status-prop', 'hr-employee', 'Employment Status', ['status'], { ref: 'hr-employment-status', desc: 'Current employment status' })
  );

  // Department
  app.property_definitions.push(
    catProp('hr-dept-code', 'hr-department', 'Department Code', ['code', 'identifier']),
    catProp('hr-dept-name', 'hr-department', 'Department Name', ['name'], { label_seq: 1 }),
    catProp('hr-dept-cost-center', 'hr-department', 'Cost Center', ['cost_center', 'code'])
  );

  // Level
  app.property_definitions.push(
    catProp('hr-level-code', 'hr-level', 'Level Code', ['code', 'identifier'], { label_seq: 1 }),
    catProp('hr-level-name', 'hr-level', 'Level Name', ['name'], { label_seq: 2 }),
    measProp('hr-level-rank', 'hr-level', 'Rank', ['rank', 'order'], 'std-integer', { min: 1, max: 1, desc: 'Numeric rank 1-8 for ordering' })
  );

  // Location
  app.property_definitions.push(
    catProp('hr-loc-code', 'hr-location', 'Location Code', ['code', 'identifier']),
    catProp('hr-loc-name', 'hr-location', 'Location Name', ['name'], { label_seq: 1 }),
    catProp('hr-loc-city', 'hr-location', 'City', ['city', 'address']),
    catProp('hr-loc-country', 'hr-location', 'Country', ['country', 'address'], { label_seq: 2 }),
    catProp('hr-loc-region', 'hr-location', 'Region', ['region', 'area'])
  );

  // Contract
  app.property_definitions.push(
    catProp('hr-contract-start-date', 'hr-contract', 'Start Date', ['date', 'start'], { ordered: true, label_seq: 1, desc: 'Contract start date' }),
    catProp('hr-contract-end-date', 'hr-contract', 'End Date', ['date', 'end'], { min: 0, ordered: true, desc: 'Contract end date (null for permanent)' }),
    catProp('hr-contract-type-prop', 'hr-contract', 'Contract Type', ['type', 'contract'], { ref: 'hr-contract-type' }),
    measProp('hr-contract-annual-salary', 'hr-contract', 'Annual Salary', ['salary', 'annual'], 'std-currency', { min: 1, max: 1 }),
    catProp('hr-contract-currency', 'hr-contract', 'Currency', ['currency'], { allowed_values: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'BRL', 'INR', 'AED'] })
  );

  // Skill
  app.property_definitions.push(
    catProp('hr-skill-code', 'hr-skill', 'Skill Code', ['code', 'identifier']),
    catProp('hr-skill-name', 'hr-skill', 'Skill Name', ['name'], { label_seq: 1 }),
    catProp('hr-skill-category', 'hr-skill', 'Category', ['category', 'group'], { label_seq: 2 })
  );

  // Training
  app.property_definitions.push(
    catProp('hr-training-code', 'hr-training', 'Training Code', ['code', 'identifier']),
    catProp('hr-training-name', 'hr-training', 'Training Name', ['name'], { label_seq: 1 }),
    measProp('hr-training-duration', 'hr-training', 'Duration (Days)', ['duration', 'days'], 'std-quantity', { min: 1, max: 1 }),
    measProp('hr-training-cost', 'hr-training', 'Cost', ['cost', 'price'], 'std-currency', { min: 1, max: 1 }),
    catProp('hr-training-status-prop', 'hr-training', 'Status', ['status'], { ref: 'hr-training-status' })
  );

  // Salary Record
  app.property_definitions.push(
    catProp('hr-salary-effective-date', 'hr-salary-record', 'Effective Date', ['date', 'effective'], { ordered: true, label_seq: 1 }),
    measProp('hr-salary-base', 'hr-salary-record', 'Base Salary', ['salary', 'base'], 'std-currency', { min: 1, max: 1 }),
    measProp('hr-salary-bonus', 'hr-salary-record', 'Bonus', ['bonus', 'incentive'], 'std-currency'),
    catProp('hr-salary-currency', 'hr-salary-record', 'Currency', ['currency'], { allowed_values: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD', 'BRL', 'INR', 'AED'] }),
    measProp('hr-salary-total-comp', 'hr-salary-record', 'Total Compensation', ['total', 'compensation'], 'std-currency', { desc: 'Computed: base_salary + bonus' })
  );

  // Performance Event
  app.property_definitions.push(
    catProp('hr-perf-event-date', 'hr-perf-event', 'Event Date', ['date', 'event'], { ordered: true, label_seq: 1 }),
    catProp('hr-perf-event-type-prop', 'hr-perf-event', 'Event Type', ['type', 'event'], { ref: 'hr-event-type', label_seq: 2 }),
    catProp('hr-perf-rating-prop', 'hr-perf-event', 'Rating', ['rating', 'performance'], { ref: 'hr-perf-rating', min: 0 }),
    catProp('hr-perf-notes', 'hr-perf-event', 'Notes', ['notes', 'comment'], { min: 0 })
  );

  // Vacation
  app.property_definitions.push(
    catProp('hr-vacation-year', 'hr-vacation', 'Year', ['year'], { label_seq: 1, ordered: true }),
    measProp('hr-vacation-days-allocated', 'hr-vacation', 'Days Allocated', ['days', 'allocated'], 'std-quantity', { min: 1, max: 1 }),
    measProp('hr-vacation-days-used', 'hr-vacation', 'Days Used', ['days', 'used'], 'std-quantity', { min: 1, max: 1 }),
    measProp('hr-vacation-remaining', 'hr-vacation', 'Days Remaining', ['days', 'remaining'], 'std-quantity', { desc: 'Computed: days_allocated - days_used' })
  );

  // Sentiment
  app.property_definitions.push(
    catProp('hr-sentiment-survey-date', 'hr-sentiment', 'Survey Date', ['date', 'survey'], { ordered: true, label_seq: 1 }),
    measProp('hr-sentiment-score', 'hr-sentiment', 'Score', ['score', 'rating'], 'std-integer', { min: 1, max: 1, desc: 'eNPS score 0-10' }),
    catProp('hr-sentiment-category', 'hr-sentiment', 'Category', ['category', 'classification'], { min: 0, desc: 'Computed: Promoter (9-10), Passive (7-8), Detractor (0-6)' })
  );

  // Team
  app.property_definitions.push(
    catProp('hr-team-code', 'hr-team', 'Team Code', ['code', 'identifier']),
    catProp('hr-team-name', 'hr-team', 'Team Name', ['name'], { label_seq: 1 })
  );

  // ── Artifact Summary Properties ─────────────────────────────────────────
  const summaryProps = [
    catProp('hr-summary-department', 'hr-analytics-summary', 'Department', ['department', 'dimension'], { min: 0, label_seq: 1 }),
    catProp('hr-summary-location', 'hr-analytics-summary', 'Location', ['location', 'dimension'], { min: 0, label_seq: 2 }),
    catProp('hr-summary-level', 'hr-analytics-summary', 'Level', ['level', 'dimension'], { min: 0 }),
    catProp('hr-summary-skill', 'hr-analytics-summary', 'Skill', ['skill', 'dimension'], { min: 0 }),
    measProp('hr-summary-headcount', 'hr-analytics-summary', 'Headcount', ['headcount', 'count', 'measure'], 'std-quantity'),
    measProp('hr-summary-total-salary', 'hr-analytics-summary', 'Total Salary', ['salary', 'total', 'measure'], 'std-currency'),
    measProp('hr-summary-avg-salary', 'hr-analytics-summary', 'Average Salary', ['salary', 'average', 'measure'], 'std-currency'),
    measProp('hr-summary-count', 'hr-analytics-summary', 'Count', ['count', 'measure'], 'std-quantity'),
    measProp('hr-summary-avg-score', 'hr-analytics-summary', 'Average Score', ['score', 'average', 'measure'], 'std-ratio'),
    measProp('hr-summary-total-allocated', 'hr-analytics-summary', 'Total Days Allocated', ['days', 'allocated', 'total', 'measure'], 'std-quantity'),
    measProp('hr-summary-total-used', 'hr-analytics-summary', 'Total Days Used', ['days', 'used', 'total', 'measure'], 'std-quantity'),
    measProp('hr-summary-termination-count', 'hr-analytics-summary', 'Termination Count', ['termination', 'count', 'measure'], 'std-quantity'),
    measProp('hr-summary-event-count', 'hr-analytics-summary', 'Event Count', ['event', 'count', 'measure'], 'std-quantity'),
    measProp('hr-summary-response-count', 'hr-analytics-summary', 'Response Count', ['response', 'count', 'measure'], 'std-quantity'),
    measProp('hr-summary-skill-count', 'hr-analytics-summary', 'Skill Count', ['skill', 'count', 'measure'], 'std-quantity'),
    catProp('hr-summary-threshold-state', 'hr-analytics-summary', 'Threshold State', ['threshold', 'state'], { min: 0, allowed_values: ['not_crossed', 'crossed'] })
  ];
  app.property_definitions.push(...summaryProps);

  // ── Event Definitions ──────────────────────────────────────────────────
  app.event_definitions = [
    {
      id: 'hr-employee-hired', app_id: 'hr-intelligence-app', scope: 'tenant',
      label: { en: 'Employee Hired' }, description: { en: 'Event emitted when a new employee is hired' },
      payload_schema: [
        { name: 'employee_id', field_type: 'uuid' },
        { name: 'employee_name', field_type: 'string' },
        { name: 'department', field_type: 'string' },
        { name: 'location', field_type: 'string' }
      ],
      use_seed: true
    },
    {
      id: 'hr-employee-promoted', app_id: 'hr-intelligence-app', scope: 'tenant',
      label: { en: 'Employee Promoted' }, description: { en: 'Event emitted when an employee is promoted' },
      payload_schema: [
        { name: 'employee_id', field_type: 'uuid' },
        { name: 'employee_name', field_type: 'string' },
        { name: 'new_level', field_type: 'string' }
      ],
      use_seed: true
    },
    {
      id: 'hr-employee-terminated', app_id: 'hr-intelligence-app', scope: 'tenant',
      label: { en: 'Employee Terminated' }, description: { en: 'Event emitted when an employee is terminated' },
      payload_schema: [
        { name: 'employee_id', field_type: 'uuid' },
        { name: 'employee_name', field_type: 'string' },
        { name: 'department', field_type: 'string' }
      ],
      use_seed: true
    },
    {
      id: 'hr-high-turnover-threshold-event', app_id: 'hr-intelligence-app', scope: 'tenant',
      label: { en: 'High Turnover Threshold Crossed' },
      description: { en: 'Event emitted when department termination count exceeds threshold' },
      payload_schema: [
        { name: 'artifact_instance_id', field_type: 'uuid' },
        { name: 'measure_value', field_type: 'measurement', measurement_frame: 'Quantity' }
      ],
      use_seed: true
    },
    {
      id: 'hr-low-enps-threshold-event', app_id: 'hr-intelligence-app', scope: 'tenant',
      label: { en: 'Low eNPS Threshold Crossed' },
      description: { en: 'Event emitted when department average eNPS score drops below threshold' },
      payload_schema: [
        { name: 'artifact_instance_id', field_type: 'uuid' },
        { name: 'measure_value', field_type: 'measurement', measurement_frame: 'Ratio' }
      ],
      use_seed: true
    }
  ];

  // ── Computations ────────────────────────────────────────────────────────
  app.computations = [
    {
      _comment: '=== COMPUTATION 1: Total Compensation = base_salary + bonus ===',
      id: 'hr-total-comp-calc', code: 'hr_total_comp', app_id: 'hr-intelligence-app',
      label: { en: 'Total Compensation Calculation' },
      description: { en: 'Computes total_compensation = base_salary + bonus on salary records' },
      inputs: [
        { source: 'property', variable_name: 'base_salary', property_id: 'hr-salary-base' },
        { source: 'property', variable_name: 'bonus', property_id: 'hr-salary-bonus' }
      ],
      formula: 'let base = base_salary.value; let b = bonus.value; base + b',
      output: { target_property_id: 'hr-salary-total-comp' },
      trigger_conditions: [
        { type: 'PropertyChange', property_id: 'hr-salary-base' },
        { type: 'PropertyChange', property_id: 'hr-salary-bonus' }
      ],
      priority: 'Normal', use_seed: true
    },
    {
      _comment: '=== COMPUTATION 2: Vacation Remaining = allocated - used ===',
      id: 'hr-vacation-remaining-calc', code: 'hr_vacation_remaining', app_id: 'hr-intelligence-app',
      label: { en: 'Vacation Remaining Calculation' },
      description: { en: 'Computes remaining = days_allocated - days_used on vacation records' },
      inputs: [
        { source: 'property', variable_name: 'allocated', property_id: 'hr-vacation-days-allocated' },
        { source: 'property', variable_name: 'used', property_id: 'hr-vacation-days-used' }
      ],
      formula: 'let a = allocated.value; let u = used.value; a - u',
      output: { target_property_id: 'hr-vacation-remaining' },
      trigger_conditions: [
        { type: 'PropertyChange', property_id: 'hr-vacation-days-allocated' },
        { type: 'PropertyChange', property_id: 'hr-vacation-days-used' }
      ],
      priority: 'Normal', use_seed: true
    },
    {
      _comment: '=== COMPUTATION 3: eNPS Category = Promoter/Passive/Detractor ===',
      id: 'hr-enps-category-calc', code: 'hr_enps_category', app_id: 'hr-intelligence-app',
      label: { en: 'eNPS Category Calculation' },
      description: { en: 'Classifies sentiment score: 9-10=Promoter, 7-8=Passive, 0-6=Detractor' },
      inputs: [
        { source: 'property', variable_name: 'score', property_id: 'hr-sentiment-score' }
      ],
      formula: 'let s = score.value; if s >= 9.0 { 2.0 } else if s >= 7.0 { 1.0 } else { 0.0 }',
      output: {},
      trigger_conditions: [
        { type: 'PropertyChange', property_id: 'hr-sentiment-score' }
      ],
      priority: 'Normal', use_seed: true
    },
    {
      _comment: '=== COMPUTATION 4: Emit Performance Event ===',
      id: 'hr-emit-perf-event', code: 'hr_emit_perf_event', app_id: 'hr-intelligence-app',
      label: { en: 'Emit Performance Event Notification' },
      description: { en: 'Publishes notification when performance event type changes' },
      inputs: [
        { source: 'property', variable_name: 'event_type', property_id: 'hr-perf-event-type-prop' }
      ],
      formula: '0.0',
      output: {},
      trigger_conditions: [
        { type: 'PropertyChange', property_id: 'hr-perf-event-type-prop' }
      ],
      event_bindings: [
        { event: 'events.hr-employee-promoted', direction: 'publish', trigger: 'always' }
      ],
      priority: 'Normal', use_seed: true
    }
  ];

  // ── Artifact Definitions ────────────────────────────────────────────────
  app.artifact_definitions = [
    {
      _comment: '=== ARTIFACT 1: Headcount by Department and Location ===',
      id: 'hr-headcount-by-dept-location', name: 'Headcount by Department and Location',
      description: { en: 'Employee headcount aggregated by department and office location' },
      source: { universal_id: 'hr-employee' },
      artifact_universal_id: 'hr-analytics-summary',
      app_id: 'hr-intelligence-app',
      dimensions: [
        { id: 'hr-hc-dept-dim', code: 'department', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-dept-rel', role_name: 'department' }], property_id: 'hr-dept-name' }, artifact_property_id: 'hr-summary-department', use_seed: true },
        { id: 'hr-hc-loc-dim', code: 'location', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-location-rel', role_name: 'location' }], property_id: 'hr-loc-name' }, artifact_property_id: 'hr-summary-location', use_seed: true }
      ],
      measures: [
        { id: 'hr-hc-headcount', code: 'headcount', function: 'Count', artifact_property_id: 'hr-summary-headcount', use_seed: true }
      ],
      thresholds: [], materialization: { strategy: 'Eager' }, use_seed: true
    },
    {
      _comment: '=== ARTIFACT 2: Salary by Department and Level ===',
      id: 'hr-salary-by-dept-level', name: 'Salary by Department and Level',
      description: { en: 'Salary aggregation by department and career level via employee relator paths' },
      source: { universal_id: 'hr-salary-record' },
      artifact_universal_id: 'hr-analytics-summary',
      app_id: 'hr-intelligence-app',
      dimensions: [
        { id: 'hr-sal-dept-dim', code: 'department', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-salary-rel', role_name: 'employee' }, { relator_universal_id: 'hr-emp-dept-rel', role_name: 'department' }], property_id: 'hr-dept-name' }, artifact_property_id: 'hr-summary-department', use_seed: true },
        { id: 'hr-sal-level-dim', code: 'level', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-salary-rel', role_name: 'employee' }, { relator_universal_id: 'hr-emp-level-rel', role_name: 'level' }], property_id: 'hr-level-name' }, artifact_property_id: 'hr-summary-level', use_seed: true }
      ],
      measures: [
        { id: 'hr-sal-total', code: 'total_salary', property_id: 'hr-salary-base', function: 'Sum', artifact_property_id: 'hr-summary-total-salary', use_seed: true },
        { id: 'hr-sal-avg', code: 'avg_salary', property_id: 'hr-salary-base', function: 'Avg', artifact_property_id: 'hr-summary-avg-salary', use_seed: true },
        { id: 'hr-sal-count', code: 'count', function: 'Count', artifact_property_id: 'hr-summary-count', use_seed: true }
      ],
      thresholds: [], materialization: { strategy: 'Eager' }, use_seed: true
    },
    {
      _comment: '=== ARTIFACT 3: Skills by Department ===',
      id: 'hr-skills-by-dept', name: 'Skills by Department',
      description: { en: 'Skill distribution by department, navigating employee -> department and employee -> skill' },
      source: { universal_id: 'hr-employee' },
      artifact_universal_id: 'hr-analytics-summary',
      app_id: 'hr-intelligence-app',
      dimensions: [
        { id: 'hr-sk-dept-dim', code: 'department', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-dept-rel', role_name: 'department' }], property_id: 'hr-dept-name' }, artifact_property_id: 'hr-summary-department', use_seed: true },
        { id: 'hr-sk-skill-dim', code: 'skill', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-skill-rel', role_name: 'skill' }], property_id: 'hr-skill-name' }, artifact_property_id: 'hr-summary-skill', use_seed: true }
      ],
      measures: [
        { id: 'hr-sk-count', code: 'skill_count', function: 'Count', artifact_property_id: 'hr-summary-skill-count', use_seed: true }
      ],
      thresholds: [], materialization: { strategy: 'Eager' }, use_seed: true
    },
    {
      _comment: '=== ARTIFACT 4: eNPS by Department and Location (with threshold) ===',
      id: 'hr-enps-by-dept-location', name: 'eNPS by Department and Location',
      description: { en: 'Employee net promoter score aggregated by department and location with low-eNPS threshold' },
      source: { universal_id: 'hr-sentiment' },
      artifact_universal_id: 'hr-analytics-summary',
      app_id: 'hr-intelligence-app',
      dimensions: [
        { id: 'hr-enps-dept-dim', code: 'department', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-sentiment-rel', role_name: 'employee' }, { relator_universal_id: 'hr-emp-dept-rel', role_name: 'department' }], property_id: 'hr-dept-name' }, artifact_property_id: 'hr-summary-department', use_seed: true },
        { id: 'hr-enps-loc-dim', code: 'location', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-sentiment-rel', role_name: 'employee' }, { relator_universal_id: 'hr-emp-location-rel', role_name: 'location' }], property_id: 'hr-loc-name' }, artifact_property_id: 'hr-summary-location', use_seed: true }
      ],
      measures: [
        { id: 'hr-enps-avg', code: 'avg_score', property_id: 'hr-sentiment-score', function: 'Avg', artifact_property_id: 'hr-summary-avg-score', use_seed: true },
        { id: 'hr-enps-count', code: 'response_count', function: 'Count', artifact_property_id: 'hr-summary-response-count', use_seed: true }
      ],
      thresholds: [
        { id: 'hr-low-enps-threshold', code: 'low_enps', measure_id: 'hr-enps-avg', condition: { operator: 'LessThan', value: 5.0 }, event_type_id: 'hr-low-enps-threshold-event', state_property_id: 'hr-summary-threshold-state', reset_on: 'OnDimensionChange', use_seed: true }
      ],
      materialization: { strategy: 'Eager' }, use_seed: true
    },
    {
      _comment: '=== ARTIFACT 5: Vacation by Department ===',
      id: 'hr-vacation-by-dept', name: 'Vacation by Department',
      description: { en: 'Vacation allocation and usage aggregated by department' },
      source: { universal_id: 'hr-vacation' },
      artifact_universal_id: 'hr-analytics-summary',
      app_id: 'hr-intelligence-app',
      dimensions: [
        { id: 'hr-vac-dept-dim', code: 'department', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-vacation-rel', role_name: 'employee' }, { relator_universal_id: 'hr-emp-dept-rel', role_name: 'department' }], property_id: 'hr-dept-name' }, artifact_property_id: 'hr-summary-department', use_seed: true }
      ],
      measures: [
        { id: 'hr-vac-allocated', code: 'total_allocated', property_id: 'hr-vacation-days-allocated', function: 'Sum', artifact_property_id: 'hr-summary-total-allocated', use_seed: true },
        { id: 'hr-vac-used', code: 'total_used', property_id: 'hr-vacation-days-used', function: 'Sum', artifact_property_id: 'hr-summary-total-used', use_seed: true },
        { id: 'hr-vac-count', code: 'count', function: 'Count', artifact_property_id: 'hr-summary-count', use_seed: true }
      ],
      thresholds: [], materialization: { strategy: 'Eager' }, use_seed: true
    },
    {
      _comment: '=== ARTIFACT 6: Turnover by Department (with threshold) ===',
      id: 'hr-turnover-by-dept', name: 'Turnover by Department',
      description: { en: 'Performance event counts by department with high-turnover threshold on termination count' },
      source: { universal_id: 'hr-perf-event' },
      artifact_universal_id: 'hr-analytics-summary',
      app_id: 'hr-intelligence-app',
      dimensions: [
        { id: 'hr-to-dept-dim', code: 'department', source: { type: 'RelatorPath', path: [{ relator_universal_id: 'hr-emp-perf-rel', role_name: 'employee' }, { relator_universal_id: 'hr-emp-dept-rel', role_name: 'department' }], property_id: 'hr-dept-name' }, artifact_property_id: 'hr-summary-department', use_seed: true }
      ],
      measures: [
        { id: 'hr-to-term-count', code: 'termination_count', function: 'Count', artifact_property_id: 'hr-summary-termination-count', use_seed: true },
        { id: 'hr-to-event-count', code: 'event_count', function: 'Count', artifact_property_id: 'hr-summary-event-count', use_seed: true }
      ],
      thresholds: [
        { id: 'hr-high-turnover-threshold', code: 'high_turnover', measure_id: 'hr-to-term-count', condition: { operator: 'GreaterThan', value: 10.0 }, event_type_id: 'hr-high-turnover-threshold-event', state_property_id: 'hr-summary-threshold-state', reset_on: 'OnDimensionChange', use_seed: true }
      ],
      materialization: { strategy: 'Eager' }, use_seed: true
    }
  ];

  // ── App, Modules ────────────────────────────────────────────────────────
  app.apps = [{
    id: 'hr-intelligence-app',
    tenant_id: 'model1-testing-tenant',
    label: { en: 'HR Intelligence Application' },
    description: { en: 'Comprehensive HR analytics application with employee management, performance tracking, skill-gap analysis, sentiment monitoring, and intelligence artifacts' },
    use_seed: true,
    modules: [
      {
        id: 'hr-core-module', use_seed: true,
        label: { en: 'HR Core Module' },
        description: { en: 'Core HR operations: employees, departments, contracts, salary management' },
        context: { subscribed_events: [], publishable_events: ['hr-employee-hired', 'hr-employee-terminated'] }
      },
      {
        id: 'hr-talent-module', use_seed: true,
        label: { en: 'Talent Management Module' },
        description: { en: 'Skills, training, performance reviews, and career development tracking' },
        context: { subscribed_events: ['hr-employee-hired'], publishable_events: ['hr-employee-promoted'] }
      },
      {
        id: 'hr-analytics-module', use_seed: true,
        label: { en: 'HR Analytics Module' },
        description: { en: 'Intelligence artifacts, sentiment analysis, and workforce analytics' },
        context: { subscribed_events: ['hr-employee-promoted', 'hr-employee-terminated'], publishable_events: [] }
      }
    ]
  }];

  // ── Users & Role Assignments ────────────────────────────────────────────
  const userDefs = [
    { id: 'hr-admin-alice', email: 'hr-admin-alice@test.model1.ai', name: 'Alice HR Admin', role: 'AppAdmin' },
    { id: 'hr-admin-bob', email: 'hr-admin-bob@test.model1.ai', name: 'Bob HR Admin', role: 'AppAdmin' },
    { id: 'hr-admin-carol', email: 'hr-admin-carol@test.model1.ai', name: 'Carol HR Admin', role: 'AppAdmin' },
    { id: 'hr-analyst-dave', email: 'hr-analyst-dave@test.model1.ai', name: 'Dave HR Analyst', role: 'AppUser' },
    { id: 'hr-analyst-emma', email: 'hr-analyst-emma@test.model1.ai', name: 'Emma HR Analyst', role: 'AppUser' },
    { id: 'hr-analyst-frank', email: 'hr-analyst-frank@test.model1.ai', name: 'Frank HR Analyst', role: 'AppUser' },
    { id: 'hr-dev-grace', email: 'hr-dev-grace@test.model1.ai', name: 'Grace HR Developer', role: 'AppDeveloper' },
    { id: 'hr-dev-henry', email: 'hr-dev-henry@test.model1.ai', name: 'Henry HR Developer', role: 'AppDeveloper' },
    { id: 'hr-dev-iris', email: 'hr-dev-iris@test.model1.ai', name: 'Iris HR Developer', role: 'AppDeveloper' }
  ];
  for (const u of userDefs) {
    app.users.push({
      id: u.id, tenant_id: 'model1-testing-tenant', email: u.email,
      display_name: u.name, password: 'TestPass123!_', is_active: true,
      roles: [u.role], use_seed: true
    });
    app.foundation_role_assignments.push({
      id: `fra-${u.id}`, user_id: u.id, role: u.role,
      scope: { type: 'App', tenant_id: 'model1-testing-tenant', app_id: 'hr-intelligence-app' },
      assigned_by: 'hr-admin-alice', use_seed: true
    });
  }

  return app;
}

// ─── metadata_app_data.json ──────────────────────────────────────────────────

function buildMetadataAppData() {
  const data = {
    _comment: '=== APP HR INTELLIGENCE REACTIVE EXAMPLE - INSTANCE DATA ===',
    _description: '520 employees across 20 departments, 12 locations, 8 levels, 30 skills, 15 training programs, 25 teams with full relator instances',
    instances: [],
    relator_instances: []
  };

  const T = 'model1-testing-tenant';

  // ── Enum Instances ──────────────────────────────────────────────────────
  const enumSets = {
    'hr-employment-status': ['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION'],
    'hr-contract-type': ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'],
    'hr-event-type': ['HIRE', 'PROMOTION', 'PERFORMANCE_REVIEW', 'PROBATION_START', 'PROBATION_END', 'TERMINATION'],
    'hr-perf-rating': ['EXCEPTIONAL', 'EXCEEDS_EXPECTATIONS', 'MEETS_EXPECTATIONS', 'BELOW_EXPECTATIONS', 'NEEDS_IMPROVEMENT'],
    'hr-skill-proficiency': ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    'hr-training-status': ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    'hr-sentiment-rating': ['VERY_DISSATISFIED', 'DISSATISFIED', 'NEUTRAL', 'SATISFIED', 'VERY_SATISFIED']
  };
  for (const [uid, values] of Object.entries(enumSets)) {
    for (const val of values) {
      const slug = val.toLowerCase().replace(/_/g, '-');
      data.instances.push({
        id: `${uid}-${slug}`, universal_id: uid, tenant_id: T,
        properties: { [`${uid}-name-prop`]: val }, use_seed: true
      });
    }
  }

  // ── Department Instances ────────────────────────────────────────────────
  for (const d of DEPARTMENTS) {
    data.instances.push({
      id: `hr-dept-${d.code.toLowerCase()}`, universal_id: 'hr-department', tenant_id: T,
      properties: { 'hr-dept-code': d.code, 'hr-dept-name': d.name, 'hr-dept-cost-center': d.cost_center },
      use_seed: true
    });
  }

  // ── Location Instances ──────────────────────────────────────────────────
  for (const l of LOCATIONS) {
    data.instances.push({
      id: `hr-loc-${l.code.toLowerCase()}`, universal_id: 'hr-location', tenant_id: T,
      properties: { 'hr-loc-code': l.code, 'hr-loc-name': l.name, 'hr-loc-city': l.city, 'hr-loc-country': l.country, 'hr-loc-region': l.region },
      use_seed: true
    });
  }

  // ── Level Instances ─────────────────────────────────────────────────────
  for (const l of LEVELS) {
    data.instances.push({
      id: `hr-level-${l.code.toLowerCase()}`, universal_id: 'hr-level', tenant_id: T,
      properties: { 'hr-level-code': l.code, 'hr-level-name': l.name, 'hr-level-rank': { value: l.rank, unit: 'units' } },
      use_seed: true
    });
  }

  // ── Skill Instances ─────────────────────────────────────────────────────
  for (const s of SKILLS) {
    data.instances.push({
      id: `hr-skill-${s.code.toLowerCase()}`, universal_id: 'hr-skill', tenant_id: T,
      properties: { 'hr-skill-code': s.code, 'hr-skill-name': s.name, 'hr-skill-category': s.category },
      use_seed: true
    });
  }

  // ── Training Instances ──────────────────────────────────────────────────
  for (const t of TRAININGS) {
    data.instances.push({
      id: `hr-training-${t.code.toLowerCase().replace(/trn-/,'')}`, universal_id: 'hr-training', tenant_id: T,
      properties: {
        'hr-training-code': t.code,
        'hr-training-name': t.name,
        'hr-training-duration': { value: t.duration, unit: 'days' },
        'hr-training-cost': { value: t.cost, unit: 'usd' },
        'hr-training-status-prop': `hr-training-status-${t.status_dist[2] > 0.5 ? 'completed' : 'in-progress'}`
      },
      use_seed: true
    });
  }

  // ── Training-Skill relator instances ────────────────────────────────────
  for (const t of TRAININGS) {
    const trainingId = `hr-training-${t.code.toLowerCase().replace(/trn-/,'')}`;
    const skillId = `hr-skill-${t.skill.toLowerCase()}`;
    data.relator_instances.push({
      id: `hr-rel-${t.code.toLowerCase().replace(/trn-/,'trn')}-skill`,
      relator_id: 'hr-training-skill-rel', tenant_id: T,
      participants: { training: trainingId, skill: skillId },
      use_seed: true
    });
  }

  // ── Team Instances ──────────────────────────────────────────────────────
  for (const t of TEAMS) {
    data.instances.push({
      id: `hr-team-${t.code.toLowerCase()}`, universal_id: 'hr-team', tenant_id: T,
      properties: { 'hr-team-code': t.code, 'hr-team-name': t.name },
      use_seed: true
    });
    // Team-Department relator
    data.relator_instances.push({
      id: `hr-rel-team-${t.code.toLowerCase()}-dept`,
      relator_id: 'hr-team-dept-rel', tenant_id: T,
      participants: { team: `hr-team-${t.code.toLowerCase()}`, department: `hr-dept-${t.dept.toLowerCase()}` },
      use_seed: true
    });
  }

  // ── Currency by country ─────────────────────────────────────────────────
  const LOC_CURRENCY = { USA: 'USD', 'United Kingdom': 'GBP', Germany: 'EUR', Japan: 'JPY', Australia: 'AUD', Canada: 'CAD', Singapore: 'SGD', Brazil: 'BRL', India: 'INR', UAE: 'AED', Netherlands: 'EUR' };

  // ── Employee Generation ─────────────────────────────────────────────────
  const NUM_EMPLOYEES = 520;
  const usedEmails = new Set();

  for (let i = 0; i < NUM_EMPLOYEES; i++) {
    const idx = String(i + 1).padStart(3, '0');
    const empId = `hr-emp-${idx}`;

    const dept = weightedPick(DEPARTMENTS);
    const loc = weightedPick(LOCATIONS);
    const level = weightedPick(LEVELS);
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);

    // Unique email
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    let emailSuffix = 1;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailSuffix}@company.com`;
      emailSuffix++;
    }
    usedEmails.add(email);

    // Hire date: between 2015-01-01 and 2025-06-30
    const hireYear = randInt(2015, 2025);
    const hireMonth = String(randInt(1, 12)).padStart(2, '0');
    const hireDay = String(randInt(1, 28)).padStart(2, '0');
    const hireDate = `${hireYear}-${hireMonth}-${hireDay}`;

    // Status distribution: 85% ACTIVE, 5% ON_LEAVE, 5% TERMINATED, 5% PROBATION
    const statusRoll = rand();
    let status;
    if (statusRoll < 0.85) status = 'hr-employment-status-active';
    else if (statusRoll < 0.90) status = 'hr-employment-status-on-leave';
    else if (statusRoll < 0.95) status = 'hr-employment-status-terminated';
    else status = 'hr-employment-status-probation';

    // Employee instance
    data.instances.push({
      id: empId, universal_id: 'hr-employee', tenant_id: T,
      properties: {
        'hr-emp-employee-id': `EMP-${idx}`,
        'hr-emp-first-name': firstName,
        'hr-emp-last-name': lastName,
        'hr-emp-email': email,
        'hr-emp-hire-date': hireDate,
        'hr-emp-status-prop': status
      },
      use_seed: true
    });

    // Employee-Department relator
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-dept`, relator_id: 'hr-emp-dept-rel', tenant_id: T,
      participants: { employee: empId, department: `hr-dept-${dept.code.toLowerCase()}` },
      use_seed: true
    });

    // Employee-Level relator
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-level`, relator_id: 'hr-emp-level-rel', tenant_id: T,
      participants: { employee: empId, level: `hr-level-${level.code.toLowerCase()}` },
      use_seed: true
    });

    // Employee-Location relator
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-loc`, relator_id: 'hr-emp-location-rel', tenant_id: T,
      participants: { employee: empId, location: `hr-loc-${loc.code.toLowerCase()}` },
      use_seed: true
    });

    // ── Contract ──────────────────────────────────────────────────────────
    const currency = LOC_CURRENCY[loc.country] || 'USD';
    const salary = Math.round(level.salary_base * loc.col * (0.9 + rand() * 0.2));
    const contractType = level.rank <= 1 ? 'hr-contract-type-intern' :
                         rand() < 0.85 ? 'hr-contract-type-full-time' :
                         rand() < 0.7 ? 'hr-contract-type-part-time' : 'hr-contract-type-contract';

    const contractId = `hr-contract-${idx}`;
    data.instances.push({
      id: contractId, universal_id: 'hr-contract', tenant_id: T,
      properties: {
        'hr-contract-start-date': hireDate,
        'hr-contract-type-prop': contractType,
        'hr-contract-annual-salary': { value: salary, unit: currency.toLowerCase() },
        'hr-contract-currency': currency
      },
      use_seed: true
    });
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-contract`, relator_id: 'hr-emp-contract-rel', tenant_id: T,
      participants: { employee: empId, contract: contractId },
      use_seed: true
    });

    // ── Salary Record ─────────────────────────────────────────────────────
    const bonus = Math.round(salary * (0.05 + rand() * 0.15));
    const salaryId = `hr-salary-${idx}`;
    data.instances.push({
      id: salaryId, universal_id: 'hr-salary-record', tenant_id: T,
      properties: {
        'hr-salary-effective-date': `2025-01-01`,
        'hr-salary-base': { value: salary, unit: currency.toLowerCase() },
        'hr-salary-bonus': { value: bonus, unit: currency.toLowerCase() },
        'hr-salary-currency': currency
      },
      use_seed: true
    });
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-salary`, relator_id: 'hr-emp-salary-rel', tenant_id: T,
      participants: { employee: empId, salary_record: salaryId },
      use_seed: true
    });

    // ── Skills (3 per employee) ───────────────────────────────────────────
    const deptSkillCodes = DEPT_SKILLS[dept.code] || ['COM','TMW','ANA'];
    const empSkills = pickN(deptSkillCodes, 3);
    for (let s = 0; s < empSkills.length; s++) {
      data.relator_instances.push({
        id: `hr-rel-emp${idx}-skill${s+1}`, relator_id: 'hr-emp-skill-rel', tenant_id: T,
        participants: { employee: empId, skill: `hr-skill-${empSkills[s].toLowerCase()}` },
        use_seed: true
      });
    }

    // ── Training (~60% participation) ─────────────────────────────────────
    if (rand() < 0.6) {
      const relevantTrainings = TRAININGS.filter(t => deptSkillCodes.includes(t.skill));
      if (relevantTrainings.length > 0) {
        const training = pick(relevantTrainings);
        const trainingInstId = `hr-training-${training.code.toLowerCase().replace(/trn-/,'')}`;
        data.relator_instances.push({
          id: `hr-rel-emp${idx}-training`, relator_id: 'hr-emp-training-rel', tenant_id: T,
          participants: { employee: empId, training: trainingInstId },
          use_seed: true
        });
      }
    }

    // ── Performance Events (1 HIRE + 0-2 additional) ──────────────────────
    // HIRE event
    const hireEventId = `hr-perf-${idx}-hire`;
    data.instances.push({
      id: hireEventId, universal_id: 'hr-perf-event', tenant_id: T,
      properties: {
        'hr-perf-event-date': hireDate,
        'hr-perf-event-type-prop': 'hr-event-type-hire',
        'hr-perf-notes': `${firstName} ${lastName} joined ${dept.name}`
      },
      use_seed: true
    });
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-perf-hire`, relator_id: 'hr-emp-perf-rel', tenant_id: T,
      participants: { employee: empId, perf_event: hireEventId },
      use_seed: true
    });

    // Additional events (0-2)
    const numExtra = randInt(0, 2);
    for (let e = 0; e < numExtra; e++) {
      const eventTypes = ['hr-event-type-promotion', 'hr-event-type-performance-review', 'hr-event-type-probation-start', 'hr-event-type-probation-end'];
      if (status === 'hr-employment-status-terminated') eventTypes.push('hr-event-type-termination');
      const eventType = pick(eventTypes);

      const ratings = ['hr-perf-rating-exceptional', 'hr-perf-rating-exceeds-expectations', 'hr-perf-rating-meets-expectations', 'hr-perf-rating-below-expectations', 'hr-perf-rating-needs-improvement'];
      const ratingDist = rand();
      let rating;
      if (ratingDist < 0.10) rating = ratings[0];
      else if (ratingDist < 0.30) rating = ratings[1];
      else if (ratingDist < 0.70) rating = ratings[2];
      else if (ratingDist < 0.90) rating = ratings[3];
      else rating = ratings[4];

      const evtYear = randInt(Math.max(hireYear, 2020), 2025);
      const evtMonth = String(randInt(1, 12)).padStart(2, '0');
      const evtDay = String(randInt(1, 28)).padStart(2, '0');

      const extraEventId = `hr-perf-${idx}-evt${e+1}`;
      const props = {
        'hr-perf-event-date': `${evtYear}-${evtMonth}-${evtDay}`,
        'hr-perf-event-type-prop': eventType
      };
      if (eventType === 'hr-event-type-performance-review') {
        props['hr-perf-rating-prop'] = rating;
      }
      data.instances.push({
        id: extraEventId, universal_id: 'hr-perf-event', tenant_id: T,
        properties: props, use_seed: true
      });
      data.relator_instances.push({
        id: `hr-rel-emp${idx}-perf-evt${e+1}`, relator_id: 'hr-emp-perf-rel', tenant_id: T,
        participants: { employee: empId, perf_event: extraEventId },
        use_seed: true
      });
    }

    // ── Vacation Record ───────────────────────────────────────────────────
    const baseDays = level.rank <= 2 ? 20 : level.rank <= 4 ? 25 : 30;
    const daysUsed = randInt(0, baseDays);
    const vacId = `hr-vacation-${idx}`;
    data.instances.push({
      id: vacId, universal_id: 'hr-vacation', tenant_id: T,
      properties: {
        'hr-vacation-year': '2025',
        'hr-vacation-days-allocated': { value: baseDays, unit: 'days' },
        'hr-vacation-days-used': { value: daysUsed, unit: 'days' }
      },
      use_seed: true
    });
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-vacation`, relator_id: 'hr-emp-vacation-rel', tenant_id: T,
      participants: { employee: empId, vacation: vacId },
      use_seed: true
    });

    // ── Sentiment Survey ──────────────────────────────────────────────────
    // Distribution: 30% promoters (9-10), 50% passives (7-8), 20% detractors (0-6)
    const sentRoll = rand();
    let sentScore;
    if (sentRoll < 0.20) sentScore = randInt(0, 6);
    else if (sentRoll < 0.70) sentScore = randInt(7, 8);
    else sentScore = randInt(9, 10);

    const sentCategory = sentScore >= 9 ? 'Promoter' : sentScore >= 7 ? 'Passive' : 'Detractor';
    const surveyMonth = String(randInt(1, 12)).padStart(2, '0');
    const sentId = `hr-sentiment-${idx}`;
    data.instances.push({
      id: sentId, universal_id: 'hr-sentiment', tenant_id: T,
      properties: {
        'hr-sentiment-survey-date': `2025-${surveyMonth}-15`,
        'hr-sentiment-score': { value: sentScore, unit: 'score' },
        'hr-sentiment-category': sentCategory
      },
      use_seed: true
    });
    data.relator_instances.push({
      id: `hr-rel-emp${idx}-sentiment`, relator_id: 'hr-emp-sentiment-rel', tenant_id: T,
      participants: { employee: empId, sentiment: sentId },
      use_seed: true
    });

    // ── Team Assignment ───────────────────────────────────────────────────
    const deptTeams = TEAMS.filter(t => t.dept === dept.code);
    if (deptTeams.length > 0) {
      const team = pick(deptTeams);
      data.relator_instances.push({
        id: `hr-rel-emp${idx}-team`, relator_id: 'hr-emp-team-rel', tenant_id: T,
        participants: { employee: empId, team: `hr-team-${team.code.toLowerCase()}` },
        use_seed: true
      });
    }
  }

  return data;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const appSchema = buildMetadataApp();
const appData = buildMetadataAppData();

const outDir = __dirname;
fs.writeFileSync(path.join(outDir, 'metadata_app.json'), JSON.stringify(appSchema, null, 4) + '\n');
fs.writeFileSync(path.join(outDir, 'metadata_app_data.json'), JSON.stringify(appData, null, 4) + '\n');

// Stats
const instCount = appData.instances.length;
const relCount = appData.relator_instances.length;
console.log(`Generated metadata_app.json (${JSON.stringify(appSchema).length} bytes)`);
console.log(`Generated metadata_app_data.json (${JSON.stringify(appData).length} bytes)`);
console.log(`  Instances: ${instCount}`);
console.log(`  Relator instances: ${relCount}`);
console.log(`  Total objects: ${instCount + relCount}`);
