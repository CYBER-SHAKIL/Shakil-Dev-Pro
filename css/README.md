# Stylesheet organization

- `main.css` contains the original global, layout, responsive and animation rules.
- `components.css` contains the join/subscribe modal styles.
- `chatbot.css` contains the chatbot styling overrides, loaded last to preserve the original cascade.

The original HTML had nested style-tag boundaries. The CSS was extracted while retaining the original rule order; responsive and animation rules remain alongside their original rule groups to avoid changing specificity or cascade behavior.
