# Bash commands

- npx nx test <project> --testNamePattern="<test name>" # Run a specific test

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow

- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance

## Quick Visual Check
IMMEDIATELY after making a code change, do a quick visual check of the relevant part of the app to make sure it looks right and works as expected.
1. **Identify what changed** - Review the modified components/pages.Reg
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Validate feature implementation** - Ensure the change fulfills the user's specific request
4. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
5. **Check for errors** - Run `mcp__playwright__browser_console_messages`
