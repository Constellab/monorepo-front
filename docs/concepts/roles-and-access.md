# Roles & Access (shared)

The role and access model across the platform. Applies to Data lab, Space and Community wherever
those surfaces expose spaces, folders or labs.

## Admin / Super admin
A few people with access to everything across the platform. Out of scope for the product surfaces
themselves.

## Space roles
Every space assigns a role to each of its members:

- **Space admin** — administrates the space; can do everything in it. **Each space must have at
  least one admin.** Sees more tabs in *Space management*. Has **read/edit access to all objects
  of the space** (folders, labs, teams, …) even those not explicitly shared with them.
- **User** — a normal space user; can create and manage folders, labs and teams.
- **Visitor** — read-only access to the space and its folders. **Does not require an active
  enterprise licence.**

## Space types & licences
- **Personal space** — every user gets one by default. It can have **at most 3 space users**
  (the owner can invite up to 3 others as full space users).
- **Enterprise space** — no invite limit, but **each user requires an Enterprise licence**.

## Folder roles
Assigned when **sharing a root folder** (in the folder **Share** dialog):

- **Owner** — full access on the root folder and its sub-folders; can invite other people.
  Anyone except a space **visitor** can be an owner. A folder can have **multiple owners** and
  must have **at least one owner** at all times.
- **Member** — full access on sub-folders, but **limited access to root-folder config** (only
  settings / share). Works inside the folder but doesn't administrate the root.
- **Visitor** — read-only access to the folder and sub-folders. **Can use chat.**

Constraints:
- A **space visitor can only be a folder visitor** — no other folder role.
- A user a folder was **not shared with cannot access it** (except an admin).
- Sharing and per-folder notification config exist **only on root folders**; sub-folders inherit
  access from their root.
- **Creating a root folder**: any space user (not a visitor) or a space admin can. Sub-folders are
  created by folder owners/members inside a folder they can edit.
- Any **member or visitor** of a folder can **see the other members** of that folder; only
  adding/changing access is restricted.

## Lab roles
Anyone **with access to a lab** (as **user** or **owner**) can **do anything inside the lab** —
there is no finer-grained permission on the lab's content. The roles differ only in lab-level
administration:

- **Owner** — everything a user can do, **plus** modify, configure, start/stop, and grant access
  to the lab. A lab can have **multiple owners** and must have **at least one owner**.
- **User** — can log into the data lab and do anything inside it.

## Teams
- Teams currently exist **only to simplify sharing folders**.
- Sharing a folder with a team gives **each member individually** access to the folder.
- **Membership is snapshotted at share time**: a member added to the team *later* does **not**
  automatically get access to folders already shared with that team.

## Community access
- **Public** objects — can be **viewed by everyone**.
- **Private** objects (shared privately to a space) — can be **viewed by any member of that space**
  (a space **visitor cannot** view them).
- **Managing** an object (edit/administrate) requires being its **author or a co-author**.

## Where roles are assigned
- **Space role** (admin / user / visitor) → **Space management → Users**.
- **Folder role** (owner / member / visitor) → the folder **Share** dialog (on the root folder).
