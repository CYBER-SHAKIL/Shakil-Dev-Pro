# Stylesheet migration note

The existing visual CSS remains embedded in `index.html` for this migration stage. The original document contains nested/malformed style-tag boundaries, so moving these rules blindly could change the current design. Keep the existing styling unchanged until a browser visual-regression check is available; then extract the rules into main.css, responsive.css, animations.css, chatbot.css and components.css in controlled passes.
