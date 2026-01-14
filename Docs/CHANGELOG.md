# Changelog

All notable changes to the OER-AI project after December 16, 2024.

---


### Practice Material Optimization

**WebSocket Migration**

- Migrated practice material generation from REST API to WebSocket implementation to resolve cold start timeout issues (previously hard-limited to 29 seconds)
- Enables real-time progress updates during material generation, allowing users to see which step of the generation process is currently active
- Lambda function can now stay active for extended periods without API timeout bottlenecks

**Performance Improvements**

- Implemented Lambda pre-warming that activates as soon as users enter the website, reducing cold start latency before reaching the practice material page
- Optimized LLM prompts to support generation of up to 20 questions with 6 options each

**Security Enhancements**

- Added validation for textbook IDs during practice material generation
- Implemented guardrails to filter out content unrelated to the textbook and prevent prompt injection attacks

### CI/CD Pipeline

- Migrated from GitHub Personal Access Tokens (PAT) to GitHub OAuth for direct connection
- Eliminates potential issues from PAT expiration

### Analytics

- Extended analytics date range in admin view to support up to 365 days in the past
- Admins can now select any value between 1-365 days for analytics reporting

---

## Notes

- All changes maintain backward compatibility unless explicitly noted
- For detailed technical implementation, refer to individual documentation files in the `Docs/` directory

---

_For more information about specific features or changes, please refer to the relevant documentation in the `Docs/` folder or contact the development team._
