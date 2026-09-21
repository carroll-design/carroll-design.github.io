"use client";

// GSAP choreography for the whole site. Mounted once in the root layout and
// re-run per pathname (revertOnUpdate), it scans the current page's DOM and
// applies the shared motion grammar wherever its hooks appear, so every page
// and any future page animates in sync:
//
//   .stagger > *            header/article entrance cascade
//   .draw-underline         accent stroke draws in after the cascade
//   .sd-rise                block rises as it enters the viewport
//   .sd-cards > *           cards slide in from alternating sides
//   .rule-draw / .sd-num    section hairline + numeral, scrubbed both ways
//   [data-animate="rows"]   list rows (news, leadership, publications) cascade
//
// Home-only signatures key off element presence, not the route: the SplitText
// hero intro ([data-gsap="name"]), the portrait parallax (.sd-drift), and the
// research statement ink-fill ([data-gsap="lead"]).
//
// On mount it tags <html> with .gsap-active, which stands the CSS animation
// system down (globals.css). The layering is fail-open on every level:
//   - no JS: CSS entrance + scroll-driven animations (or static) as before;
//   - JS + reduced motion: matchMedia never fires, CSS reduce rules apply;
//   - JS + motion OK: GSAP owns every page's motion.

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

declare global {
  interface Window {
    /** Set by the layout's inline veil script at first paint (home, once per session). */
    __introVeilAt?: number;
  }
}

export function SiteAnimations() {
  const pathname = usePathname();
  // False for every run after the first. useGSAP re-runs this whole callback
  // per pathname with revertOnUpdate, and a ref is the only state that
  // survives that teardown.
  const firstLoad = useRef(true);

  useGSAP(
    () => {
      const initial = firstLoad.current;
      firstLoad.current = false;

      // The arrival choreography is authored for the moment someone lands on
      // the site. Replaying it in full on every client-side navigation makes
      // clicking through six project pages six separate waits for text to
      // fade in, because .stagger holds the whole article at autoAlpha 0 for
      // about a second. In-site navigation gets a short fade instead: the
      // page still resolves rather than snapping, but it stops feeling
      // ceremonial on the fourth click. Scrubbed motion (.rule-draw, .sd-num)
      // is untouched, since it follows scroll position rather than arrival.
      const ENTER = initial
        ? {
            ease: "power4.out",
            dur: 0.8,
            stagger: 0.09,
            y: 18,
            underlineDelay: 0.35,
            riseY: 44,
            riseDur: 1.1,
            cardX: 80,
            cardY: 36,
            cardScale: 0.97,
            cardDur: 1.2,
            cardDelay: 0.12,
            rowY: 28,
            rowDur: 0.9,
            rowStagger: 0.08,
          }
        : {
            ease: "power2.out",
            dur: 0.25,
            stagger: 0,
            y: 8,
            underlineDelay: 0.08,
            riseY: 12,
            riseDur: 0.3,
            cardX: 0,
            cardY: 10,
            cardScale: 1,
            cardDur: 0.3,
            cardDelay: 0,
            rowY: 10,
            rowDur: 0.3,
            rowStagger: 0.02,
          };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const root = document.documentElement;
        root.classList.add("gsap-active");

        const main = document.getElementById("main");
        if (!main) return () => root.classList.remove("gsap-active");

        const q = gsap.utils.selector(main);
        const splits: SplitText[] = [];
        let cancelled = false;
        let introStage: HTMLDivElement | null = null;

        const hero = q('[data-gsap="name"]').length > 0;

        // ---- Entrance cascade for header groups (.stagger). The home hero
        // column also carries .stagger but is owned by the hero timeline.
        q(".stagger").forEach((group) => {
          if (group.querySelector('[data-gsap="name"]')) return;
          gsap.from(group.children, {
            autoAlpha: 0,
            y: ENTER.y,
            duration: ENTER.dur,
            ease: ENTER.ease,
            stagger: ENTER.stagger,
            clearProps: "all",
          });
          const underline = group.querySelector(".draw-underline");
          if (underline) {
            gsap.from(underline, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: ENTER.dur,
              ease: "power3.inOut",
              delay: ENTER.underlineDelay,
            });
          }
        });

        // ---- Blocks rise as they enter (.sd-rise). Wrappers around a row
        // list stand down; the row cascade below owns that motion.
        q(".sd-rise").forEach((el) => {
          if (el.querySelector('[data-animate="rows"]')) return;
          gsap.from(el, {
            y: ENTER.riseY,
            autoAlpha: 0,
            duration: ENTER.riseDur,
            ease: ENTER.ease,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // ---- Cards slide in from alternating sides, evens a beat behind.
        q(".sd-cards").forEach((grid) => {
          Array.from(grid.children).forEach((card, i) => {
            gsap.from(card, {
              x: i % 2 ? ENTER.cardX : -ENTER.cardX,
              y: ENTER.cardY,
              autoAlpha: 0,
              scale: ENTER.cardScale,
              duration: ENTER.cardDur,
              delay: (i % 2) * ENTER.cardDelay,
              ease: ENTER.ease,
              clearProps: "all",
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            });
          });
        });

        // ---- Section hairlines draw, numerals slide in, scrubbed both ways.
        q(".rule-draw").forEach((rule) => {
          gsap.from(rule, {
            scaleX: 0,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: rule,
              start: "top 95%",
              end: "top 65%",
              scrub: 0.5,
            },
          });
        });
        q(".sd-num").forEach((num) => {
          gsap.from(num, {
            x: -28,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: num,
              start: "top 95%",
              end: "top 65%",
              scrub: 0.5,
            },
          });
        });

        // ---- List rows cascade on enter (news, leadership, publications).
        q('[data-animate="rows"]').forEach((list) => {
          gsap.from(list.children, {
            y: ENTER.rowY,
            autoAlpha: 0,
            duration: ENTER.rowDur,
            stagger: ENTER.rowStagger,
            ease: "power3.out",
            scrollTrigger: { trigger: list, start: "top 88%", once: true },
          });
        });

        // ---- Research statement: ink fills word by word while scrolling.
        // Word spans are inline-block, so the split is resize-safe and stays
        // alive for back-and-forth scrubbing.
        const lead = q('[data-gsap="lead"]');
        if (lead.length > 0) {
          const leadSplit = SplitText.create(lead[0].querySelectorAll("p"), {
            type: "words",
          });
          splits.push(leadSplit);
          gsap.from(leadSplit.words, {
            opacity: 0.15,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: lead[0],
              start: "top 80%",
              end: "top 30%",
              scrub: 0.4,
            },
          });
        }

        // ---- Home hero: portrait parallax + SplitText intro timeline.
        if (hero) {
          // First-visit intro (layout.tsx inline script + globals.css): the
          // pre-paint cover is holding the page hidden right now; buildIntro
          // (inside buildHero, after fonts are ready) swaps it for the staged
          // name-card reveal and the hero starts as the slats lift. On client
          // navs the timestamp is stale and everything runs immediately.
          const veilAt = window.__introVeilAt;
          const veilFresh =
            typeof veilAt === "number" && Date.now() - veilAt < 3000;

          // Builds the intro stage over the page and returns the timeline
          // moment (seconds from now) when the reveal starts, which the hero
          // and header entrances use as their hold. The stage: five paper
          // slats (the cover) plus the name center-stage; chars rise through
          // a mask and the accent stroke draws. Then, as the slats lift, the
          // name itself MORPHS into the hero h1 (a FLIP move: translate +
          // scale onto the hidden hero span, which uses the same serif, so
          // the final swap is invisible). One continuous identity from card
          // to page.
          const buildIntro = (): number => {
            const heroNameEl = q('[data-gsap="name"]')[0] as
              HTMLElement | undefined;
            const nameText = heroNameEl?.textContent?.trim();
            if (!heroNameEl || !nameText) return 0;

            introStage = document.createElement("div");
            introStage.className = "intro-stage";
            introStage.setAttribute("aria-hidden", "true");
            const SLAT_COUNT = 5;
            const slats: HTMLDivElement[] = [];
            for (let i = 0; i < SLAT_COUNT; i += 1) {
              const slat = document.createElement("div");
              slat.className = "intro-stage-slat";
              slat.style.left = `${(i * 100) / SLAT_COUNT}%`;
              // A hair wider than 1/n so adjacent slats can never show a seam.
              slat.style.width = `${100 / SLAT_COUNT + 0.5}%`;
              introStage.appendChild(slat);
              slats.push(slat);
            }
            const nameWrap = document.createElement("div");
            nameWrap.className = "intro-stage-name";
            const nameLine = document.createElement("div");
            nameLine.textContent = nameText;
            const rule = document.createElement("span");
            rule.className = "intro-stage-rule";
            nameWrap.append(nameLine, rule);
            introStage.appendChild(nameWrap);
            document.body.appendChild(introStage);
            // The GSAP stage now covers the page; the pre-paint CSS cover
            // (and its failsafe timer) can go. Scroll is locked while the
            // stage is up so the FLIP measurement cannot drift.
            root.classList.remove("intro-veil");
            root.style.overflow = "hidden";

            const nameSplit = SplitText.create(nameLine, {
              type: "words, chars",
              mask: "chars",
            });
            splits.push(nameSplit);

            // Pacing (tuned 2026-07: the site owner wanted the intro unhurried): the
            // letters take their time rising, the finished card holds for a
            // beat, and the slat lift + name flight are long and deliberate.
            const intro = gsap.timeline();
            intro
              .from(
                nameSplit.chars,
                {
                  yPercent: 120,
                  duration: 1.1,
                  stagger: 0.05,
                  ease: "power4.out",
                },
                0.1,
              )
              .from(
                rule,
                {
                  scaleX: 0,
                  transformOrigin: "left center",
                  duration: 0.85,
                  ease: "power3.inOut",
                },
                0.75,
              )
              // Back to one plain text node (visually identical at rest) so
              // the morph transforms a single clean element, not char masks.
              .add(() => nameSplit.revert(), 1.6)
              .to(
                rule,
                {
                  scaleX: 0,
                  transformOrigin: "right center",
                  duration: 0.55,
                  ease: "power3.in",
                },
                1.75,
              )
              .to(
                slats,
                {
                  yPercent: -100,
                  duration: 1.1,
                  stagger: 0.085,
                  ease: "power4.inOut",
                },
                1.9,
              )
              // FLIP: measured live at this moment (page laid out at scroll
              // 0 beneath the stage), the card name travels and scales onto
              // the hidden hero span, then the swap happens in one frame.
              .add(() => {
                const src = nameLine.getBoundingClientRect();
                const dst = heroNameEl.getBoundingClientRect();
                gsap.to(nameLine, {
                  x: dst.left - src.left,
                  y: dst.top - src.top,
                  scale: dst.width / src.width,
                  transformOrigin: "0 0",
                  duration: 1.25,
                  ease: "power3.inOut",
                  onComplete: () => {
                    gsap.set(heroNameEl, { autoAlpha: 1 });
                    introStage?.remove();
                    introStage = null;
                    root.style.overflow = "";
                  },
                });
              }, 1.9);
            // Hero starts as the slats lift and the name is in flight.
            return 1.9;
          };
          gsap.to(q(".sd-drift"), {
            y: 64,
            ease: "none",
            scrollTrigger: {
              start: 0,
              end: () => window.innerHeight * 0.9,
              scrub: 0.6,
            },
          });

          const eyebrow = q('[data-gsap="eyebrow"]');
          const name = q('[data-gsap="name"]');
          const underline = q(".draw-underline");
          const tagline = q('[data-gsap="tagline"]');
          const pill = q('[data-gsap="pill"]');
          const linkItems = q('[data-gsap="links"] > *');
          const print = q(".place-print");
          const caption = q('[data-gsap="caption"]');

          // Hide the pieces in the same frame the CSS entrance is
          // neutralized, so ownership passes without a flash.
          gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
          gsap.set([name, tagline], { autoAlpha: 0 });
          gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(pill, { autoAlpha: 0, y: 12, scale: 0.92 });
          gsap.set(linkItems, { autoAlpha: 0, y: 14 });
          // rotation/y ride on top of the print's CSS rotate. Its hover
          // straighten transition (transition-transform) would smooth every
          // GSAP frame, so it is suspended here; clearProps at the end of the
          // intro hands transform and transition back to the classes.
          gsap.set(print, {
            autoAlpha: 0,
            y: 32,
            rotation: -5,
            scale: 0.95,
            transition: "none",
          });
          gsap.set(caption, { autoAlpha: 0 });

          const buildHero = () => {
            // On a first visit the intro stage plays over the page; the hero
            // and header hold until its reveal moment (0 on later visits).
            const revealAt = veilFresh ? buildIntro() : 0;

            const header = document.querySelector("header");
            if (revealAt > 0 && header) {
              const chrome = [...header.querySelectorAll("a, button")].filter(
                (el) => !el.closest("dialog"),
              );
              gsap.from(chrome, {
                y: -12,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.05,
                delay: revealAt + 0.1,
                clearProps: "all",
              });
            }

            // In morph mode the intro card's name lands ON the hero span, so
            // the span itself stays hidden until the swap; on later visits
            // the chars rise through a mask as usual.
            const morphing = revealAt > 0;
            let nameSplit: SplitText | null = null;
            if (!morphing) {
              nameSplit = SplitText.create(name, {
                type: "words, chars",
                mask: "chars",
              });
              splits.push(nameSplit);
              gsap.set(nameSplit.chars, { yPercent: 120 });
              gsap.set(name, { autoAlpha: 1 });
            }
            const tagSplit = SplitText.create(tagline, {
              type: "lines",
              mask: "lines",
            });
            splits.push(tagSplit);

            gsap.set(tagSplit.lines, { yPercent: 120 });
            gsap.set(tagline, { autoAlpha: 1 });

            const tl = gsap.timeline({
              // Hold until the intro's slats are lifting (0 without an intro).
              delay: revealAt,
              defaults: { ease: "power4.out", duration: 1 },
              onComplete: () => {
                // Back to natural text so window resizes reflow correctly.
                nameSplit?.revert();
                tagSplit.revert();
              },
            });

            if (nameSplit) {
              tl.to(
                nameSplit.chars,
                { yPercent: 0, duration: 0.9, stagger: 0.035 },
                0.2,
              );
            }

            tl.to(print, {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1.1,
              clearProps: "all",
            })
              .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
              .to(
                underline,
                { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
                0.75,
              )
              .to(
                tagSplit.lines,
                { yPercent: 0, duration: 0.9, stagger: 0.09 },
                0.6,
              )
              .to(
                pill,
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.7,
                  ease: "back.out(1.8)",
                },
                0.95,
              )
              .to(
                linkItems,
                { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07 },
                1.05,
              )
              .to(
                caption,
                { autoAlpha: 1, duration: 0.8, ease: "power2.out" },
                1.2,
              );

            ScrollTrigger.refresh();
          };

          // The intro waits for the serif so line masks measure real glyphs,
          // capped at 1s so a stalled font never blocks it.
          const fontsReady: Promise<unknown> =
            typeof document.fonts?.ready?.then === "function"
              ? document.fonts.ready
              : Promise.resolve();
          Promise.race([
            fontsReady,
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ]).then(() => {
            if (!cancelled) ctx.add(buildHero);
          });
        }

        ScrollTrigger.refresh();

        return () => {
          cancelled = true;
          splits.forEach((s) => s.revert());
          introStage?.remove();
          root.style.overflow = "";
          root.classList.remove("intro-veil");
          root.classList.remove("gsap-active");
        };
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
