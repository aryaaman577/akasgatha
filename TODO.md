# TODO - AkashGatha copy + About visual + dev indicator

## Step 1 — Verify dev indicator removal
- [ ] Start dev server
- [ ] Confirm the bottom-left “N / 1 Issue / X” badge is gone across all routes
- [ ] If still present, ensure `next.config.ts` has `devIndicators: false` merged correctly

## Step 2 — Remove broken About hero visual (text-led)
- [x] Edit `src/app/about/page.tsx` to remove `CosmicOrrery` import and `visualSlot` render path
- [x] Update `src/app/about/about.module.css` to remove/neutralize the reserved visual column and ensure a clean text layout
- [ ] Confirm no large empty column remains


## Step 3 — Rewrite only English copy for About page
- [ ] Edit `src/config/language.tsx` and update only `translations.en` About keys
- [ ] Ensure claims follow accuracy rules and adhere to copy style/length constraints

## Step 4 — Typography/spacing pass on About page
- [ ] Apply required About hero typography rules via minimal spacing/typography adjustments (no redesign)
- [ ] Verify consistent vertical gaps (~12px, ~20px, ~28px)

## Step 5 — Testing
- [ ] Test routes at 320px, 390px, 768px, 1024px, 1440px
- [ ] Run `next build` and then `next start`
- [ ] Confirm no hydration/runtime/console/accessibility issues

