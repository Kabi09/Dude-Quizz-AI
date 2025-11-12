# Quiz Frontend - Modern UI (No CSS framework)

## Setup
1. `npm install`
2. `npm run dev`

The app expects an API at `http://localhost:4000/api` by default. Set `VITE_API_URL` env var if needed.

This frontend is a self-contained modern responsive UI built using plain CSS (no Tailwind / Bootstrap).


## KaTeX (optional)
This project can render LaTeX math (including chemical formulas) using KaTeX.
Install KaTeX in the frontend:

```
cd frontend
npm install katex
```

Use the `FormulaKaTeX` component:

``jsx
import FormulaKaTeX from './shared/FormulaKaTeX';

<FormulaKaTeX tex="C_{4}H_{10}" />
```
