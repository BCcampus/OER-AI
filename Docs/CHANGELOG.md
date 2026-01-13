# Changelog

All notable changes to the OER-AI project after December 16, 2024.

## [1.2.2] - 2026-01-13

### Added

- **Progress Bar for Material Editor**: Added progress bar to Material Editor in instructor view during practice material generation
- **Generate Button State Management**: Implemented button disabling during practice material generation to prevent duplicate requests
- **Lambda Pre-Warming for Practice Materials**: Implemented Lambda pre-warming mechanism to reduce cold start latency
  - Keeps Lambda functions warm and ready for practice material generation
  - Significantly improves response times for initial requests
  - Enhances overall user experience during peak usage
- **Provisioned Concurrency**: Configured provisioned concurrency for practice material Lambda functions
  - Ensures pre-initialized execution environments are always available
  - Eliminates cold start delays for practice material generation
  - Provides consistent, predictable performance under varying load conditions
- **Security Enhancements**: Fixed multiple code scanning alerts
  - Log injection prevention on WebSocket receive (Alert #10)
  - Log injection fix for alerts 9/10
  - Sensitive logging fixes for code scan alerts 1-5
  - Fix for code scanning alert #7
  - Fix for code scanning alert #8 (incomplete multi-character sanitization)
  - Sanitized user input in CloudFormation custom resources to prevent log injection attacks

### Changed

- **WebSocket Migration for Practice Materials**: Migrated practice material generation from traditional REST API to WebSocket-based communication
  - Enables real-time progress updates during material generation
  - Improves user experience with live feedback
  - Better handling of long-running generation processes
  - Supports streaming responses for practice material creation
- **Practice Material Prompt Refactoring**: Refactored and optimized prompts for practice material generation
  - Improved prompt structure for better quality outputs
  - Enhanced clarity and specificity in generation instructions
  - Optimized token usage for more efficient API calls
  - Results in more relevant and accurate practice materials
- **Lambda Timeout Optimization**: Increased `practiceMaterial` Lambda function timeout for better performance
- **API Parameter Fixes**: Corrected API parameter casing issues in practice material generation
- **Syntax Error Corrections**: Fixed syntax errors in practice material Lambda function

### Technical Improvements

- Enhanced Material Editor to mirror functionality from student view's Practice Material Page
- Improved consistency across instructor and student interfaces

---

## [1.2.1] - 2026-01-08

### Added

- **GitHub CodeStar Connection**: Implemented CodeStar connection for GitHub integration in CDK

### Changed

- **CodePipeline Authentication**: Migrated from GitHub personal access token to CodeStar connection for more secure repository access
- **Secret Management**: Updated `github-access-token-temp` secret configuration

### Fixed

- **CodePipeline GitHub Access**: Resolved "Could not access the GitHub repository" error
- **Token Recognition**: Fixed issue where CodePipeline wasn't recognizing updated GitHub personal access tokens

---

## [1.2.0] - 2026-01-06 to 2026-01-07

### Added

- **Flexible Analytics Date Ranges**: Implemented support for flexible time range inputs
  - Support for formats like "45d", "6m", "1y"
  - Maximum lookback period capped at 365 days
- **Enhanced Time Range Parsing**: Backend now parses flexible `timeRange` values

### Changed

- **Analytics UI Revert**: Reverted analytics interface changes
  - Removed slider component
  - Restored original button-based time range selection
  - Ensured consistency between frontend and backend endpoints

### Fixed

- **Analytics Endpoint Consistency**: Addressed non-existent `/admin/analytics` endpoint by reverting frontend to pre-change state
- **Component References**: Cleaned up unused imports and component references

---

## [1.1.0] - 2025-12-19

### Added

- **Session Cleanup Mechanism**: Implemented cleanup for old database sessions
- **WebSocket Stability**: Enhanced JWT token handling for WebSocket connections

### Changed

- **JWT Token Expiration**: Addressed discrepancy between JWT token expiration (15 minutes) and user session persistence
  - Postgres sessions: Previously indefinite
  - Frontend sessions: 30-day window
- **Token Lifecycle Management**: Improved token refresh and session management

### Technical Improvements

- Enhanced session and token lifecycle management
- Improved database session cleanup processes

---

## Notes

- All changes maintain backward compatibility unless explicitly noted
- For detailed technical implementation, refer to individual documentation files in the `Docs/` directory

---

## Version History Summary

- **v1.2.2** (2026-01-13): Progress bars, security fixes, Lambda optimizations
- **v1.2.1** (2026-01-08): GitHub CodeStar integration, secret management
- **v1.2.0** (2026-01-06): Analytics enhancements and UI improvements
- **v1.1.0** (2025-12-19): Session management and token lifecycle improvements

---

_For more information about specific features or changes, please refer to the relevant documentation in the `Docs/` folder or contact the development team._
