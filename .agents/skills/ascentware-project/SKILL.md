---
name: ascentware-project
description: Guidelines and architectural rules for Ascentware projects.
---

# Ascentware Project Standards

## Repository

This repository is a Turborepo managed with pnpm.
Applications:

- apps/client
- apps/admin
- apps/api
  Shared packages live under packages/.

## Architecture rules

- Client and Admin are independent applications.
- Do not move application-specific code into shared packages.
- Shared UI primitives belong in the UI package.
- API communication goes through the API client.
- Authentication goes through the auth abstraction.
- Do not directly duplicate API clients.
- Do not introduce dependencies without checking existing packages.

## Client

Client is customer-facing. Optimize for:

- discovery
- conversion
- trust
- usability
- responsive/mobile experience

## Admin

Admin is an operational application. Optimize for:

- information density
- workflow efficiency
- filtering
- bulk operations
- keyboard navigation
- permissions
  Do not force client visual patterns into Admin.

## Backend

NestJS is the API source of truth. Do not invent API contracts. Inspect existing backend modules and DTOs before implementing frontend integration.

## Completion

A feature is not complete until:

- implementation works
- loading state exists
- empty state exists
- error state exists
- validation exists
- responsive behavior works
- accessibility is checked
- tests exist where appropriate
- performance has been reviewed
- UI has been visually reviewed
