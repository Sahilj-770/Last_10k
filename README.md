# LAST ₹10K — Survive the Month
> **"30 days. ₹10,000. Make it count."**
> A modern, editorial personal finance survival simulator for Indian college students and young adults.

---

## 1. Product Overview

**LAST ₹10K** is not an accounting ledger or generic expense tracker. It is a **prospective financial decision simulator** engineered for Gen Z students surviving on a fixed ₹10,000 monthly allowance.

Its defining experience is not merely showing users where their money went: **it shows them what a financial decision will do to the rest of their month *before* they make it.**

### Key Capabilities
- **⚡ The Decision Simulator (Signature Feature):** Test prospective purchases (e.g. ₹1,500 headphones, ₹480 biryani, ₹2,200 trip). Instantly models the domino effect on Cash in Hand, Safe Daily Allowance, Month-End Forecast, and Risk Trajectory before committing. Provides 3 strategic alternatives (Buy Today, Delay to Day 26, Budget Alternative -50%).
- **🏛️ Financial Command Center:** Live reconciliation across 4 capital partitions: Paid Expenses (44%), Reserved Commitments (13%), Spendable Cash (44%), and Locked Savings (8%).
- **📅 30-Day Survival Calendar:** Chronological timeline mapping past spending, current position (Day 12), scheduled commitments (WiFi, exam fee, electricity), and high financial pressure danger days.
- **💳 Unified Ledger & Commitments:** Reconciled expense and upcoming commitment register. Marking a reserved commitment as paid settles it without duplicate deductions.
- **📡 Subscription Leak Detector:** Recurring payment radar with active simulation toggles to test the immediate ₹ effect of pausing subscriptions.
- **🔥 Black Swan Stress Tests:** One-click financial shocks (₹500 Minor Emergency, ₹1,500 Hardware Repair, ₹2,500 Emergency Trip) to test runway resilience.
- **🐷 Savings Reserves:** Goal vaults with required daily contribution pace calculation and feasibility warnings.

---

## 2. Mathematical Calculation Engine

All calculations derive deterministically from a single source of truth (`src/utils/financeEngine.ts`):

$$\text{Cash Balance} = \text{Starting Budget (₹10,000)} + \text{Incomes} - \sum \text{Paid Expenses}$$

$$\text{Spendable Cash} = \max\left(0, \text{Cash Balance} - \sum \text{Unpaid Commitments}\right)$$

$$\text{Remaining Days} = \max\left(1, \text{Total Days (30)} - \text{Current Day} + 1\right)$$

$$\text{Safe Daily Allowance} = \left\lfloor \frac{\text{Spendable Cash}}{\text{Remaining Days}} \right\rfloor$$

$$\text{Month-End Forecast} = \text{Cash Balance} - \text{Unpaid Commitments} - (\text{Avg Daily Pace} \times \text{Remaining Days})$$

### Risk Scoring Rules
- **STABLE (Green):** Daily allowance $\ge ₹150$/day, commitments covered, projected month-end cushion $\ge ₹1,000$.
- **CAUTION (Amber):** Daily allowance between $₹75-₹150$/day, requiring strict daily rationing.
- **AT RISK (Coral Red):** Daily allowance $< ₹75$/day (campus baseline) or cash insufficient to cover upcoming commitments.

---

## 3. Tech Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + Architectural Editorial Design System
- **Typography:** Space Grotesk (Headings), JetBrains Mono (Financial digits), Plus Jakarta Sans (Body)
- **Icons:** Lucide React
- **Persistence:** Browser LocalStorage (`last_10k_finance_v1`)
- **Zero API Keys:** Works 100% offline and in static browser environments.

---

## 4. Deployment Instructions

The project is built as a pure static Single Page Application (SPA) with zero server runtime dependencies.

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Test production build
npm run build
```

---

### Deploy to Vercel (Recommended)
1. Push this repository to GitHub / GitLab.
2. In the Vercel Dashboard, select **Add New Project** and import the repository.
3. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy!
*(Note: `vercel.json` is pre-configured with client-side SPA rewrites).*

---

### Deploy to Render
1. In the Render Dashboard, select **New +** &rarr; **Static Site**.
2. Connect your Git repository.
3. Set configuration:
   - **Name:** `last-10k`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Click **Create Static Site**.
*(Note: `public/_redirects` is pre-configured with `/* /index.html 200` rewrite rule).*

---

## 5. Verification Checklist

- [x] Initial ₹10,000 budget and Day 12 baseline reconcile mathematically.
- [x] Simulating a purchase previews impact without deducting money from the ledger.
- [x] Committing a purchase writes to the ledger and recalculates all metrics.
- [x] Cancelling a simulation leaves the financial state completely untouched.
- [x] Marking a commitment as paid moves it to settled without double-counting.
- [x] Daily allowance updates dynamically after every financial decision.
- [x] 30-Day survival calendar flags pressure days and computes daily closing balances.
- [x] Subscription toggles simulate cancellation and reflect in month-end forecast.
- [x] Stress tests model ₹500, ₹1,500, and ₹2,500 emergency shocks.
- [x] LocalStorage persists all user decisions across page reloads.
- [x] Reset to Demo Data button restores clean baseline seed data.
- [x] Production build succeeds in under 500ms (`tsc -b && vite build`).
