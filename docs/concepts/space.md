# Space (`ca-space-front`)

The **Space** is for project management, sharing and organisation, inside a company and across
companies (inter/intra enterprise). Its lens on the shared model: **organise, consult, share,
govern** objects that were produced in the Data lab.

Object definitions live in the shared files — this file only covers Space-specific behaviour:
- [Domain objects](domain-objects.md) — folder, note, Constellab document, scenario, resource, …
- [Roles & access](roles-and-access.md) — space / folder / lab roles, teams, licences.

## Folders & hierarchy
- **Root vs sub-folder actions differ**: only root folders expose **Share** (grant users access,
  owner-only) and **Configure notifications**. Sub-folders offer create-sub-folder, move, update,
  settings, trash.
- In the Space, hierarchy objects are mostly **consulted** and **shared**, not created — except
  **Constellab documents**, which are authored here.

## Sharing
Two mechanisms:
- **Sharing a folder with users** — assign folder roles (owner / member / visitor) via the Share
  dialog on a root folder.
- **Tokens / public links** — create a shareable public link to a hierarchy object.

## Chat
- Chat can be **enabled on a folder**, at the **root level** only.
- Once enabled, **anyone with access to the folder** (including folder visitors) can use it.
- It is a **Slack-like human channel** for the folder's people to communicate — **not** an AI
  assistant.

## Notifications
- Most notifications come from **folders** — a new chat message, a folder activity, etc.
- Each user sets their **own notification preferences per folder** (root-folder "Configure
  notifications").
- The notifications panel (bell) surfaces these across the Space.

## Space management
- The "Current space" administration area: users, labs, folders, teams, and a space dashboard.
- **Space roles are assigned here** (Space management → Users). Space admins see more tabs.

## Labs (Space side)
- The Space manages labs: create, configure, start/stop, backups, usage.
- Labs carry infrastructure concepts — **green option, storage price, volume, KPIs, backups** —
  describing a lab's resource consumption and running state.
