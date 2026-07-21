# Jigyasa Visual Model QA — Commit c714b73

## Test URL
http://localhost:3002/ask

## Test Matrix

### Desktop (1440px)
- [ ] No 360° rotation — model stays front-facing
- [ ] No thin side or 2D strip appearance
- [ ] Pointer movement: ~±4° horizontal, ~±2° vertical
- [ ] Pointer leave: smooth return to neutral
- [ ] Depth layers: naturally dimensional
- [ ] Particles: do not obscure model
- [ ] Glow: restrained, not overwhelming
- [ ] No visible rectangular Canvas/wrapper
- [ ] No clipping issues
- [ ] No horizontal overflow
- [ ] Model visible in right sidebar
- [ ] Breathing motion: gentle and subtle

### Tablet (1024px)
- [ ] Same visual quality as desktop
- [ ] Model remains visible and stable
- [ ] Touch interaction: restrained tilt
- [ ] No layout shift
- [ ] No overflow issues

### Tablet (768px)
- [ ] Model may be hidden (desktop-only display)
- [ ] If visible: same quality standards
- [ ] No layout breaking
- [ ] Form remains functional

### Mobile (390px)
- [ ] Model hidden (desktop-only via lg:flex)
- [ ] Form takes full width
- [ ] No visual artifacts from hidden model
- [ ] No performance issues

### Mobile (360px)
- [ ] Model hidden (desktop-only)
- [ ] Form fully functional
- [ ] No horizontal scroll
- [ ] All controls accessible

## Console Checks
- [ ] No JavaScript errors
- [ ] No WebGL errors
- [ ] No React warnings
- [ ] No performance warnings

## Functional Regression
- [ ] Provider selector: Auto/Groq visible
- [ ] Language selector: works
- [ ] Answer style selector: works
- [ ] Question input: accepts text
- [ ] Ask Jigyasa button: enabled
- [ ] Real Groq API: still connected
- [ ] RAG: still executing
- [ ] Citations: still validated

## Test Questions for Groq Regression
1. "What is a neutron star"
2. "Rahu Ketu aur grahan ka sambandh kya hai"

Expected:
- Real Groq response (not mocked)
- RAG retrieval count > 0
- Valid citations for question 2
- Answer appears on same page
- No timeout errors

## Visual Details to Verify

### Model Appearance
- Purple/violet outer energy rings visible
- Cyan constellation nodes visible
- Silver core clearly visible in center
- Energy filaments radiating outward
- Subtle cosmic dust particles
- Soft atmospheric glow (not harsh)
- Layered depth perception (not flat)

### Rotation Behavior
- Model should appear to "breathe" gently
- Should NOT spin continuously
- Mouse movement creates subtle parallax
- Should NOT flip to thin side view
- Front face always visible

### Interaction Feel
- Responsive to mouse without being jittery
- Smooth damping when pointer leaves
- Returns to neutral front-facing position
- No sudden snaps or jumps
- Feel: premium and polished

## Browser Testing
- Chrome/Edge (primary)
- Firefox (if available)
- Safari (if available)

## Pass Criteria
ALL checkboxes must pass for PASS verdict
ANY visual issue = BLOCKED + specific report

## Failure Protocol
If BLOCKED:
1. Document specific issue
2. Note viewport size where issue occurs
3. Describe expected vs actual behavior
4. Check if code change required or config issue
5. Only modify code if verified visual defect found
