# Figma-inspired assets integration

This frontend now uses a consolidated design system based on provided assets:
- styles/common.css: extracted from assets/common.css and assets/to-do-main-landing-0-landing.css
- Classes used across components: app-navbar, app-brand, app-grid, container, card, input/select/textarea, btn variants, list, task-item, etc.

How it works:
- index.js imports styles/common.css globally.
- App.js uses header.app-navbar and .app-grid layout.
- Theme toggling relies on existing React state; it sets data-theme on <html>. The label updates between "🌙 Dark" and "☀️ Light".

Notes:
- assets/app.js (vanilla JS) is not injected at runtime in CRA. Its behavior (theme persistence/toggle) has been implemented already in React App via useEffect and localStorage.
- Avoid importing raw HTML files; structure has been translated into React JSX and classNames.

If you add new screens, reuse the system classes from styles/common.css.
