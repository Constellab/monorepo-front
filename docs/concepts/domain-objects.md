# Domain Objects (shared)

The single source of truth for the Constellab object model, shared across the three environments.
Each object is defined once here (definition, where it is used, links to other objects). The
Space-specific behaviour file ([`space.md`](space.md)) does **not** re-explain objects — it only
describes how the Space manipulates them.

## The three environments

Constellab has three environments. The same objects flow between them, each environment applying
its own purpose.

### Data lab
Where **data and pipelines are managed**. Users *create, run and edit* things here. It manages
**scenarios** — which produce **resources** and **applications** — and also manages **notes** and
**forms**. It is the origin of most domain objects.

A data lab is a **decentralised** service — it runs **on the cloud or on-premise**. Data labs are
**managed by the Space** (access, configuration, version, start/stop, backups…): the Space is the
control plane, the lab is the compute. Access to a lab is governed by **lab roles** (owner / user).

Data labs can **communicate with each other** (including with a Datahub, below).

**Datahub** — a special type of data lab (same configuration/management) that is **always running**,
so it is always available. Because of that it is used to **store data long-term**, to **host
applications**, and as an **S3 server to store space documents**. It does **not** run calculations
or workflow execution itself — those are run by (regular) **data labs**; the Datahub communicates
with them.

### Space
Project management, sharing and organisation, inside a company and across companies (inter/intra
enterprise). Users *organise, consult, share and govern* the objects produced in the Data lab.
Objects are collected into **folders** (a tree of root folders and sub-folders), shared with
people and teams, discussed via folder **chat**, and tracked via **notifications**. Most objects
are **read-only** here (consulted, not created) — the exception is the **Constellab document**,
which is authored directly in the Space. Access is governed by **space roles** and **folder
roles** (see `roles-and-access.md`).

### Community
A **public website** where users can **share things** with the wider community — the
**publish/discover** environment. It hosts its own objects (**bricks**, **stories**, **community
agents**, **partners**, **community tags**). Content shared out from the **Data lab** is limited to
**agents** — a lab agent shared to the Community becomes a **community agent** (shared with the
Community, **not** with a space). **Space objects are not published to the Community.** Being
public-facing, it is the outward counterpart of the private Data lab / Space.

### Object relationships (summary)

Each row is one directed edge `Source — relationship → Target`. This is the authoritative edge
list; the per-object **Links** fields below give the same facts in context.

| Source | Relationship | Target |
|---|---|---|
| Data lab | manages | scenarios, notes, note templates, forms, form templates |
| Scenario | runs in | data lab |
| Scenario | produces | resources, applications |
| Scenario | can be linked to | notes |
| Brick | defined in | Community |
| Brick | installed / used in | data lab |
| Brick | defines | tasks, protocols, resource types, applications |
| Scenario | is built on | a protocol |
| Protocol | holds | processes + links |
| Process | is either | a task or a protocol (sub scenario) |
| Task | takes / generates | resources (via named ports); has a configuration |
| Resource | has | one or more views |
| View | renders | a resource (e.g. table → table / scatter plot) |
| Note template | generates | notes (variables → text / view / image) |
| Form template | defines schema for | forms |
| Form | is an instance of | a form template |
| Note / note template | can embed | resource views, forms / form templates |
| Tag | shared to / retrieved from | Community (homogeneous tag database across labs) |
| Agent (special process) | defined in | data lab |
| Agent | shared with | the Community (→ community agent) |
| Scenario (in the data lab) | stored in | a space folder (folder assigned) |
| Resource | takes folder of | its scenario (if defined) |
| Lab objects (scenario, resource, application, note) | optionally shared to | the space (via their folder) |
| Constellab document | authored in | the Space |
| Space | configures / manages | its data labs (access, config, version, start/stop, backups) |
| Story, partner | published on | Community (public only) |
| Every space object (incl. data labs) | belongs to | exactly one space |

Notes:
- **Space objects are not published to the Community.** Only agents (from the lab) and
  Community-native content (bricks, stories, agents, partners) live on the public Community.
- A lab object is **stored in a folder** in the data lab (folder assigned); it becomes
  visible/consultable in the **Space** only once it is **shared** to the space (an optional step).

### Everything belongs to one space

**All objects of a space — including its data labs — are attached to exactly one space.** The
space is the ownership boundary: a lab, folder, team, and every object shared into it belong to a
single space. (Community-native objects are the exception, being platform-public.)

---

## Objects

> **Terminology:** the **protocol** concept is hidden from normal users. In the product, a protocol
> is a **scenario** and a sub-protocol is a **sub scenario**. Likewise a **process** is just a block
> in a scenario (either a task or a sub scenario).

### Folder
- **Definition** — the organisational container in the Space. Folders form a tree of **root
  folders** and **sub-folders**. A root folder is the unit of sharing and access; sub-folders
  inherit access from their root.
- **Where used** — **Space** (the backbone of organisation). Not a Data lab or Community concept.
- **Links** — holds all other hierarchy objects (documents, notes, Constellab documents,
  scenarios, resources, applications). Carries **chat** and **notification** settings (root only).
  Access is defined by **folder roles** (see `roles-and-access.md`).

### Document
- **Definition** — an uploaded file (PDF / office / etc.) stored in a folder.
- **Where used** — **Space** (uploaded and consulted there).
- **Links** — lives in a **folder**; can carry **tags**. Distinct from a *Constellab document*
  (below), which is native rich text rather than an uploaded file.
- **Actions** — open / preview, download, rename.

### Note (a.k.a. lab note)
- **Definition** — a rich-text note **created and modified in the Data lab**, then synced to the
  Space. **Cannot be modified in the Space** — consulted read-only, with version history. A note's
  content can embed **resource views** (as well as text, images and forms).
- **Where used** — authored in the **Data lab**; consulted in the **Space**.
- **Links** — can be **linked to scenarios** ("associated scenarios"); can embed **resource
  views** and **forms**; may be generated from a **note template**. Same underlying rich-text
  technology as a **Constellab document** (the Space-authored counterpart). Lives in a **folder**;
  can carry **tags**.

### Note template
- **Definition** — a **lab object**: a reusable **template used to generate notes**. It can hold
  **variables** that are **replaced with objects during note generation** — text, a **resource
  view**, or an image.
- **Where used** — **Data lab** (authoring/managing templates and generating notes from them).
- **Links** — generates **notes**; its variables resolve to text / **resource views** / images;
  can embed a **form template** block.

### Constellab document
- **Definition** — a native rich-text document **created and modified directly in the Space**,
  with version history. Uses the **same rich-text technology as a note**; in short, "a note
  managed by the Space".
- **Where used** — **Space** (the only object authored there).
- **Links** — the Space-side counterpart of a **note**. Lives in a **folder**; can carry **tags**.

### Form template
- **Definition** — a **lab object**: a **reusable, versioned definition of a form's schema** (its
  fields), similar to a Google Forms template. Has draft / published / archived version states.
- **Where used** — **Data lab** (authoring/managing templates); embeddable in **note templates**
  via a form-template block.
- **Links** — a **form** is an instance of a form template; embeddable in **note templates**.

### Form
- **Definition** — a **lab object**: an **instance of a form template**, filled (or being filled)
  with values, bound to a specific published template version. Lifecycle: draft → submitted
  (locked).
- **Where used** — **Data lab** (filling/managing forms); embeddable in **notes** via a form block.
- **Links** — an instance of a **form template**; embeddable in **notes** (a note may own the form,
  in which case deleting the note cascades to the form).

### Scenario
- **Definition** — a **pipeline execution** that ran in a lab. Carries a scenario card (status,
  the lab it ran on) and a technical report.
- **Where used** — created and run in the **Data lab**; consulted read-only in the **Space**.
- **Storing & sharing** — in the **Data lab** a scenario can be **stored in a space folder** (a
  folder is assigned to it). From that folder it can then be **shared to the space** (optional). It
  is only visible in the Space once shared.
- **Links** — **runs in a lab**; **produces resources** (and applications). Can be **linked to
  notes** ("associated notes"). Can carry **tags**.

### Resource
- **Definition** — a **data object produced by a scenario**. Has one or more **views** for
  visualising its content.
- **Where used** — produced in the **Data lab**; consulted / shared from the **Space**.
- **Storing & sharing** — a resource takes **its scenario's folder** if one is defined, and can be
  **shared with the space**.
- **Links** — **produced by a scenario**; has one or more **views**; an **application** is
  technically a resource. Can carry **tags**.

### View (resource view)
- **Definition** — a way of **viewing a resource**. A resource stores raw data (e.g. a table
  stored as CSV) that can be rendered through different views — the same table can be shown as a
  **table**, a **scatter plot**, etc.
- **Where used** — **Data lab** and **Space** (viewing resources); a view can be **embedded in a
  note / note template / Constellab document**.
- **Links** — belongs to a **resource**; embeddable in **notes**, **note templates** and
  **Constellab documents**.

### Application
- **Definition** — an **interactive app** that can be launched. Technically an application **is a
  resource**, but it is presented to users as a **distinct concept**.
- **Where used** — **produced and hosted by the Data lab**; launched / shared from the **Space**.
- **Links** — a specialised **resource**; can carry **tags**.

### Tag
- **Definition** — a **key/value** label attached to hierarchy objects to classify and search them.
- **Where used** — across **Data lab**, **Space** and **Community** (Community has its own tags).
- **Sharing** — tags can be **shared to and retrieved from the Community**, so that labs build a
  **homogeneous tag database** (consistent keys/values across labs).
- **Links** — can be attached to any hierarchy object (folder, document, note, scenario,
  resource, application).

### Brick
- **Definition** — a **Python library for Constellab** that **defines tasks, resources, protocols
  and applications**. Bricks are **installed and managed in a data lab** and **configure what that
  lab can do**; they are published and discovered on the Community.
- **Where used** — published/discovered on **Community**; installed into a **data lab**.
- **Links** — defines the **tasks**, **protocols**, **resource** types and **applications** a lab
  can use. A lab's capabilities are the sum of its installed bricks. Contrast with **agents** —
  custom code that lives *outside* bricks and skips the project/git/version ceremony.

### Task
- **Definition** — the unit of **code/logic** that performs a computation. A task has **named
  input and output ports**, **takes resources** (inputs) and **generates resources** (outputs),
  and has a **configuration**.
- **Where used** — **Data lab** (executed inside scenarios); defined in a **brick**.
- **Links** — a **process** can be a task; tasks are provided by **bricks**; consumes/produces
  **resources**.

### Process
- **Definition** — an **abstraction for a running block inside a scenario**. A process is
  **either a task or a protocol**. Processes are the blocks you place and connect in a scenario.
- **Where used** — **Data lab** (inside scenarios).
- **Links** — is a **task** or a **protocol**; connected to other processes (via **links**) inside
  a **protocol** / scenario.

### Protocol (sub scenario)
- **Definition** — technically, the container that **holds processes and the links between them**.
  A **scenario has a protocol** (which holds its processes — possibly sub-protocols — and links). A
  nested/sub-protocol is called a **sub scenario**.
- **User-facing note** — the "protocol" concept is **hidden from normal users**: in the product we
  talk about **scenarios** and **sub scenarios**, not protocols.
- **Where used** — **Data lab** (the structure behind every scenario); can be shipped by a
  **brick** as a reusable workflow.
- **Links** — holds **processes** (tasks or sub-protocols) and their **links**; a **scenario** is
  built on a protocol.

### Story
- **Definition** — an **article**, like a Medium story — published editorial content. Stories are
  **public only**.
- **Where used** — **Community** (public).

### Agent (Community agent)
- **Definition** — a special **process defined in the data lab** that holds **custom Python or R
  code** to run bespoke manipulations (supports **virtual environments**). Agents live **outside
  bricks**: they are lightweight **code snippets** with none of the brick ceremony (no real
  project, git repository, or declared versions). They are **easy to share publicly** on the
  Community.
- **Where used** — **defined in the Data lab**; from the lab you can **use** an agent or **share**
  it to the **Community**. Once shared to the Community it is called a **community agent**.
- **Links** — a special kind of **process**, but **not** packaged in a **brick**.

### Partner
- **Definition** — partner entities / pages on the Community.
- **Where used** — **Community** (public).
