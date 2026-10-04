# TemVora

TemVora is an Astro website for practical websites and advertising, document creation, and IT support. Its visual system uses self-hosted EB Garamond, a custom swirl-O and star wordmark, and slow original liquid motion.

- [Open the public review](https://temvora.helios56722.chatgpt.site)
- [Visit the Product Lab](https://temvora.helios56722.chatgpt.site/lab/)
- [View the business-card proof](brand/business-card/output/TemVora_Business_Card_QR_Proof.html)
- [Download the print-ready card PDF](brand/business-card/output/pdf/TemVora_Business_Card_Print_Ready.pdf)

## Run locally

Use Node.js 20 or newer, then run:

```bash
npm ci
npm run dev
```

Open <http://127.0.0.1:4328/>. Create a production build with:

```bash
npm run build
```

## What is included

- 24 static Astro routes
- Responsive navigation and original interactive sample sites
- Project, support, and consultation request forms
- Plain-text download, clipboard copy, email-app, and Gmail handoff options
- A Product Lab page for early tools such as FrameProof
- Branded business-card proofs and print assets

The request forms do not send automatically or store submissions. Visitors choose whether to copy, download, or open a message in their own email client. The public review is intentionally marked `noindex` while the business and service setup is still being finalized.

## Design notes

The homepage includes three original fictional concepts: **After Hours**, **FORM Architecture**, and **Terra**. Sample-site styling stays separate from the main TemVora interface. The main site and business card share the same wordmark, deep-midnight palette, violet and magenta line system, and Garamond typography.
