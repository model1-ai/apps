# Model1 Apps

Metadata-driven applications for the Model1 platform. Each app is defined entirely through JSON metadata files that describe domain models, computations, events, and sample data.

## Directory Structure

```
apps/
├── templates/                          # Reference templates
│   ├── metadata_app_template.json      # Schema template (all entity types)
│   └── metadata_app_data_template.json # Instance data template
├── app_invoice/                        # Simple reactive computation example
├── app_hr_intelligence/                # HR processes with artifacts
├── app_costa_banana_intelligence/      # Domain-rich app with processes and artifacts
├── app_purchase_approval/              # Purchase approval workflow
├── app_document_signoff/               # Document approval process
├── app_ontology_showcase/              # Inheritance, composition, role typing
├── app_hr_ontology_showcase/           # HR ontology patterns
├── app_accounting_intelligence/        # Accounting intelligence
├── app_content_moderation/             # Content moderation workflow
└── app_task_intelligence/              # Task management with intelligence
```

## Creating a New App

### 1. Create the App Directory

```bash
mkdir apps/app_your_example
```

### 2. Create `metadata_app.json` (Schema)

This file defines the domain model: organizations, tenants, users, apps, universals (entity types), property definitions, computations, events, and more.

Copy the template as a starting point:

```bash
cp apps/templates/metadata_app_template.json apps/app_your_example/metadata_app.json
```

### 3. Create `metadata_app_data.json` (Instance Data)

This file contains entity instances and relator instances (relationships between entities). Only needed if your app includes sample/seed data.

```bash
cp apps/templates/metadata_app_data_template.json apps/app_your_example/metadata_app_data.json
```

### 4. File Separation Rule

| File | Contains | Never Contains |
|------|----------|----------------|
| `metadata_app.json` | Schema definitions: universals, properties, computations, events, apps, users | Instances, relator instances |
| `metadata_app_data.json` | Runtime data: entity instances, relator instances | Universals, property definitions, computations |

---

## Metadata File Structure

### Required Top-Level Keys (`metadata_app.json`)

| Key | Purpose | Required |
|-----|---------|----------|
| `organizations` | Organization hierarchy | Yes |
| `tenants` | Tenant belonging to organization | Yes |
| `apps` | Application with modules | Yes |
| `universals` | Entity types (Kind, Relator, FunctionalRole) | Yes |
| `property_definitions` | Properties attached to universals | Yes |
| `users` | User accounts with credentials | Optional |
| `foundation_role_assignments` | Role assignments scoped to app/tenant/org | Optional |
| `measurement_frames` | Custom measurement units (use standard frames when possible) | Optional |
| `event_definitions` | Event types with payload schemas | Optional |
| `computations` | Reactive computation formulas | Optional |
| `correlation_rules` | Multi-event correlation patterns | Optional |
| `timers` | Scheduled timer definitions | Optional |
| `data_schemas` | Complex data extraction patterns | Optional |
| `artifact_definitions` | Intelligence aggregations (dimensions, measures, thresholds) | Optional |
| `score_definitions` | Scoring/ranking definitions | Optional |
| `topic_policies` | Event distribution policies | Optional |

### Required Top-Level Keys (`metadata_app_data.json`)

| Key | Purpose |
|-----|---------|
| `instances` | Entity instances with property values |
| `relator_instances` | Relationship instances linking entities |

---

## Organization & Tenant

For example/test apps, use the standard testing org and tenant:

```json
"organizations": [
  { "id": "model1-testing-org", "label": { "en": "Model1 Testing Org" }, "use_seed": true }
],
"tenants": [
  {
    "id": "model1-testing-tenant",
    "organization_id": "model1-testing-org",
    "label": { "en": "Model1 Testing Tenant" },
    "use_seed": true
  }
]
```

For domain-specific apps (e.g., Costa Bananas), define your own org/tenant but always set `"use_seed": true`.

---

## ID Conventions

All entity IDs are kebab-case strings. With `"use_seed": true`, IDs are deterministically converted to UUIDs using UUID v5.

| Entity Type | Suffix | Example |
|-------------|--------|---------|
| Universals | (none) | `invoice`, `order-item` |
| Properties | `-prop` | `invoice-number-prop`, `item-amount-prop` |
| Relators | `-rel` | `invoice-has-item-rel`, `order-customer-rel` |
| Computations | `-calc` | `line-total-calc`, `invoice-total-calc` |
| Events | `-event` | `order-created-event`, `threshold-exceeded-event` |
| Artifact dimensions | `-dim` | `category-dim`, `region-dim` |
| Artifact measures | (descriptive) | `total-sales-measure` |
| Artifact thresholds | (descriptive) | `high-sales-threshold` |

---

## Labels

All `label` and `description` fields use multilingual format:

```json
"label": { "en": "Invoice" }
"description": { "en": "Represents a customer invoice" }
```

---

## Universals (Entity Types)

### Basic Universal

```json
{
  "id": "invoice",
  "temporal_nature": "Endurant",
  "meta_category": "Kind",
  "label": { "en": "Invoice" },
  "label_schema": { "separator": " - ", "max_length": 40, "fallback_language": "en" },
  "use_seed": true
}
```

- `temporal_nature`: `Endurant` (persistent entity) or `Perdurant` (process/event)
- `meta_category`: `Kind` (entity type), `Relator` (relationship type), `FunctionalRole` (role type)
- `label_schema`: Required for universals that will have instances (controls how instance labels are generated)

### Specialization (Inheritance)

Child universals inherit all properties from parent. Both `generalizes` and `taxonomy` are required:

```json
{
  "id": "electric-car",
  "temporal_nature": "Endurant",
  "meta_category": "Kind",
  "label": { "en": "Electric Car" },
  "generalizes": "car",
  "taxonomy": [
    { "relator_universal_id": "generalization-relator", "target_universal_id": "car" }
  ],
  "label_schema": { "separator": " - ", "max_length": 40, "fallback_language": "en" },
  "use_seed": true
}
```

### Composition (Auto-Instantiation)

Lifecycle-dependent whole-part relationship. When a composite instance is created, components are automatically created:

```json
{
  "id": "station-has-sensor-rel",
  "temporal_nature": "Perdurant",
  "meta_category": "Relator",
  "label": { "en": "Station Has Sensor" },
  "roles": [
    { "name": "composite", "universal_id": "weather-station" },
    { "name": "component", "universal_id": "temperature-sensor" }
  ],
  "taxonomy": [
    { "relator_universal_id": "generalization-relator", "target_universal_id": "composition-relator" }
  ],
  "use_seed": true
}
```

Role names **must** be `composite` and `component`.

---

## Property Definitions

```json
{
  "id": "invoice-number-prop",
  "universal_id": "invoice",
  "label": { "en": "Invoice Number" },
  "property_schema": {
    "predicates": ["identifier", "number"],
    "relator": { "relator_type": "Attribution" },
    "constraints": {
      "property_value_type": { "type": "Categorical" },
      "cardinality": { "min": 1, "max": 1 }
    }
  },
  "label_options": { "participates": true, "sequence": 1, "prefix": "#" },
  "use_seed": true
}
```

### Property Value Types

| Type | Schema | Instance Data Format | Example |
|------|--------|----------------------|---------|
| Categorical | `{ "type": "Categorical" }` | Simple string | `"ACTIVE"` |
| Textual | `{ "type": "Textual" }` | Multilingual object | `{ "en": "Description" }` |
| Measurement | `{ "type": "Measurement", "measurement_frame_id": "std-currency" }` | Value + unit | `{ "value": 100.50, "unit": "usd" }` |
| Boolean | `{ "type": "Boolean" }` | Literal | `true` |

**CRITICAL**: Categorical values are **simple strings**, never `{ "en": "value" }`. This is the most common mistake.

### Standard Measurement Frames

Use standard frames by seed ID. Only create custom frames if none of these fit:

| Seed ID | Use For |
|---------|---------|
| `std-integer` | Whole numbers, counts |
| `std-float` | Decimal numbers |
| `std-ratio` | Percentages (0-100) |
| `std-currency` | Monetary values (usd, eur) |
| `std-quantity` | Countable items |
| `std-timestamp` | Dates and times |
| `std-time-duration` | Durations |
| `std-weight` | Mass (kg) |
| `std-temperature` | Temperature (celsius) |
| `std-length` | Distance (meter) |
| `std-area` | Area (sqm) |
| `std-volume` | Volume (liter) |
| `std-velocity` | Speed (m/s) |
| `std-score` | Points, ratings |
| `std-salary` | Compensation (usd/year) |
| `std-data-size` | File sizes (bytes) |

Common mistakes: `std-speed` (use `std-velocity`), `Currency` (use `std-currency`), `std-decimal` (use `std-float`).

### Instance Labels

For universals with instances, configure which properties appear in the label:

1. Add `label_schema` to the universal
2. Add `label_options` to participating properties:
   ```json
   "label_options": { "participates": true, "sequence": 1, "prefix": "#" }
   ```
3. Properties are joined using the universal's `separator`, ordered by `sequence`

---

## Relator Taxonomy

Every relator universal **must** have a `taxonomy` entry. Available foundation relator types:

| Target | Use For |
|--------|---------|
| `composition-relator` | Whole-part, lifecycle-dependent, auto-instantiation |
| `aggregation-relator` | Whole-part, independent lifecycle |
| `association-relator` | General relationship |
| `generalization-relator` | Is-a / inheritance |
| `parthood-relator` | Structural containment |
| `participation-relator` | Entity participates in event/process |
| `causation-relator` | Cause-effect |
| `attribution-relator` | Entity has quality/attribute |
| `dependency-relator` | Requires/depends-on |
| `role-assignment-relator` | Assigns role to entity |
| `derivation-relator` | Derived-from |
| `collaboration-relator` | Cooperative relationship |

Taxonomy format:
```json
"taxonomy": [{ "relator_universal_id": "generalization-relator", "target_universal_id": "association-relator" }]
```

---

## Users & Role Assignments

```json
"users": [{
  "id": "admin-user",
  "tenant_id": "model1-testing-tenant",
  "email": "admin@test.model1.ai",
  "display_name": "Admin User",
  "password": "TestPass123!_",
  "is_active": true,
  "roles": ["AppAdmin", "AppDeveloper"],
  "use_seed": true
}],
"foundation_role_assignments": [{
  "id": "fra-admin-app-admin",
  "user_id": "admin-user",
  "role": "AppAdmin",
  "scope": { "type": "App", "tenant_id": "model1-testing-tenant", "app_id": "your-app-id" },
  "assigned_by": "admin-user",
  "use_seed": true
}]
```

Create one `foundation_role_assignments` entry per role per user. Available roles: `AppAdmin`, `AppDeveloper`, `AppUser`, `TenantAdmin`, `OrgAdmin`.

Scope types: `App` (needs `tenant_id` + `app_id`), `Tenant` (needs `tenant_id`), `Organization` (needs `org_id`).

---

## Instance Data (`metadata_app_data.json`)

### Entity Instances

```json
{
  "id": "invoice-001",
  "universal_id": "invoice",
  "tenant_id": "model1-testing-tenant",
  "use_seed": true,
  "properties": {
    "invoice-number-prop": "INV-2024-001",
    "invoice-customer-prop": { "en": "ACME Corp" },
    "invoice-amount-prop": { "value": 1500.00, "unit": "usd" },
    "invoice-active-prop": true
  }
}
```

### Relator Instances

```json
{
  "id": "invoice-item-link-1",
  "relator_id": "invoice-has-item-rel",
  "tenant_id": "model1-testing-tenant",
  "use_seed": true,
  "participants": {
    "source": "invoice-001",
    "target": "item-001"
  }
}
```

Use `relator_id` (not `relator_universal_id`) and `participants` (not `connections`). Role names must match the relator universal's `roles` array.

### `skip_composition` Flag

When your data file manually defines component instances for a composite universal, set `"skip_composition": true` on the composite instance to prevent duplicate auto-creation:

```json
{
  "id": "my-station",
  "universal_id": "weather-station",
  "tenant_id": "model1-testing-tenant",
  "skip_composition": true,
  "use_seed": true,
  "properties": { ... }
}
```

---

## Reactive Computations

```json
{
  "id": "line-total-calc",
  "label": { "en": "Line Total" },
  "app_id": "your-app-id",
  "computation_type": "Reactive",
  "universal_id": "invoice-item",
  "formula": "let qty = quantity.value; let price = unit_price.value; qty * price",
  "inputs": [
    { "variable_name": "quantity", "property_id": "item-quantity-prop" },
    { "variable_name": "unit_price", "property_id": "item-unit-price-prop" }
  ],
  "output": { "property_id": "item-total-prop" },
  "trigger": { "type": "PropertyChange", "property_id": "item-quantity-prop" },
  "use_seed": true
}
```

Computations execute automatically when trigger conditions are met. Property changes cascade to dependent computations.

---

## Artifact Definitions (Intelligence)

Artifacts aggregate source instances by dimensions and measures:

```json
{
  "id": "sales-by-category",
  "label": { "en": "Sales by Category" },
  "description": { "en": "Aggregates sales by product category" },
  "source": { "universal_id": "invoice-item" },
  "artifact_universal_id": "sales-summary",
  "app_id": "your-app-id",
  "dimensions": [{
    "id": "category-dim", "code": "category",
    "source": { "type": "Property", "property_id": "item-category-prop" },
    "artifact_property_id": "summary-category-prop",
    "use_seed": true
  }],
  "measures": [{
    "id": "total-sales-measure", "code": "total_sales",
    "property_id": "item-total-prop", "function": "Sum",
    "artifact_property_id": "summary-total-prop",
    "use_seed": true
  }],
  "thresholds": [{
    "id": "high-sales-threshold", "code": "high_sales",
    "measure_id": "total-sales-measure",
    "condition": { "operator": "GreaterThan", "value": 50000.0 },
    "event_type_id": "high-sales-event",
    "state_property_id": "summary-threshold-state-prop",
    "reset_on": "OnDimensionChange",
    "use_seed": true
  }],
  "materialization": { "strategy": "Eager" },
  "use_seed": true
}
```

Aggregation functions: `Sum`, `Count`, `Avg`, `Min`, `Max`. Every threshold **must** reference an `event_type_id`.

---

## Validation & Loading

All apps **must** pass both validation (offline) and loading (runtime) before being committed.

### Prerequisites

Build the admin CLI:

```bash
cd model1-admin-cli && cargo build --release
```

### Step 1: Validate (Offline)

Validates JSON syntax, required fields, ID uniqueness, cross-references, and measurement frame existence. No running broker needed.

```bash
cd model1-admin-cli
./target/release/model1-cli validate --path ../apps/app_your_example \
  --foundation ../broker/bootstrap/1_foundation/metadata_app.json
```

### Step 2: Load (Runtime)

Loads metadata into a running broker. Validates runtime consistency: reactive computation execution, event emission, relator resolution, process compilation.

```bash
cd model1-admin-cli
./target/release/model1-cli --cert-path ../broker/certs/cert.pem \
  load --dir ../apps/app_your_example --progress
```

Requires the broker running on `localhost:8443`. Generate TLS certificates first if needed:

```bash
cd broker && ./generate_certs.sh
```

### Why Both Steps Are Required

| Step | Validates |
|------|-----------|
| `validate` | JSON syntax, required fields, schema structure, ID uniqueness, measurement frame references |
| `load` | Runtime consistency, reactive computations execute correctly, events fire, relationships resolve, processes compile |

### Common Validation Errors

| Error | Fix |
|-------|-----|
| `references measurement_frame_id 'std-speed' not found` | Use `std-velocity` (check Standard Measurement Frames table) |
| `Unsupported scalar value type: Object` | Used `{"en": "value"}` for a Categorical property; use plain string |
| `missing field 'taxonomy'` | Relator universal needs `taxonomy` array |
| `missing field 'label_schema'` | Universal with instances needs `label_schema` |
| `missing required field 'event_type_id'` | Artifact threshold must reference an event definition |
| `Property does not belong to universal or its hierarchy` | Property's `universal_id` doesn't match instance's universal or ancestors |
| `missing field 'id'` in role assignments | Every `foundation_role_assignments` entry needs `id`, `use_seed`, `assigned_by`, and nested `scope` |

### Common Loading Errors

| Error | Fix |
|-------|-----|
| `Connection refused` | Start the broker on `localhost:8443` |
| `certificate verify failed` | Regenerate certs: `cd broker && ./generate_certs.sh` |
| Broker hangs/times out | Add `"skip_composition": true` to composite instances whose components are in the data file |

---

## Using Claude Code for App Development

The `model1-admin-cli` and Claude Code's `/metadata-app` skill provide an integrated workflow for creating and validating apps.

### Creating Apps with Claude Code

Ask Claude Code to create an app by describing your domain:

```
/metadata-app create an inventory management system with products,
warehouses, and stock levels. Include computations for total stock
value and low-stock alerts.
```

Claude Code will:
1. Read the template files for structure reference
2. Read reference examples for working patterns
3. Ask clarifying questions if needed (inheritance, composition, users, etc.)
4. Generate `metadata_app.json` and optionally `metadata_app_data.json`
5. Auto-validate the generated files

### Validating Apps with Claude Code

```
/metadata-app validate apps/app_your_example
```

This runs the CLI `validate` command with the foundation reference and interprets the results, explaining any errors with the specific rule that was violated and how to fix it.

### Loading Apps with Claude Code

```
/metadata-app load apps/app_your_example
```

This runs the CLI `load` command against a running broker and interprets the output, flagging any runtime issues.

---

## Reference Examples

| App | Key Patterns Demonstrated |
|-----|---------------------------|
| `app_invoice` | Basic reactive computations (quantity * price), cascading triggers |
| `app_ontology_showcase` | Inheritance hierarchies, composition, role-typed relators |
| `app_hr_intelligence` | Processes, artifacts, score definitions, role assignments |
| `app_costa_banana_intelligence` | Domain-rich model, multiple processes, 3 artifacts |
| `app_purchase_approval` | Purchase approval workflow with process stages |
| `app_document_signoff` | Document approval with sign-off process |
| `app_task_intelligence` | Task management with intelligence artifacts |
| `app_accounting_intelligence` | Accounting domain with financial computations |
| `app_content_moderation` | Content review workflow |
| `app_hr_ontology_showcase` | HR-specific ontology patterns |
