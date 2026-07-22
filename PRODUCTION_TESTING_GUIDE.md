# AkasGatha Production Testing Guide

**Commit**: f27ab8c (pushed to GitHub)  
**Status**: Ready for production verification

---

## Quick Verification Steps

### 1. Check Vercel (2 minutes)
1. Go to https://vercel.com/dashboard
2. Find "akasgatha" project
3. Check latest deployment
4. Verify commit: **f27ab8c** ✅
5. Verify status: "Ready" ✅
6. Copy production URL

### 2. Test Hero Buttons on Mobile (5 minutes)
Open production URL in Chrome DevTools:

**390px width test**:
```javascript
// Open DevTools → Set width to 390px → Run in console:
const btn = document.querySelector('a[href="/ask"]');
const rect = btn.getBoundingClientRect();
const x = rect.left + rect.width / 2;
const y = rect.top + rect.height / 2;
console.log('Button center:', x, y);
console.log('Hit test:', document.elementFromPoint(x, y));
// Should return: <a> or <span> (NOT .black-hole-interaction)
```

Repeat for:
- 320px, 360px, 430px (phones)
- 768px, 820px (tablets)

### 3. Test Ask Page - No Refresh (2 minutes)
1. Go to /ask on production
2. Enter: "What is the Moon?"
3. Click "Ask Jigyasa"
4. **Watch URL bar** - should NOT reload ✅
5. Question should stay visible ✅
6. Answer should appear ✅

### 4. Physical Device Test (If Available)
**iPhone/Android**:
1. Open production URL
2. Tap "Start Jigyasa" → should navigate to /ask ✅
3. Tap "Explore Akas Granth" → should navigate to /granth ✅

---

## Expected Results

**Before Fix** (left: 18% on mobile):
- ❌ Buttons blocked by 82% width overlay
- ❌ Taps intercepted by .black-hole-interaction
- ❌ Navigation doesn't work

**After Fix** (left: 48% on mobile):
- ✅ Buttons accessible (left 52% of screen)
- ✅ Taps hit button element
- ✅ Navigation works
- ✅ Black hole still interactive on right side

---

## If Still Blocked

**Collect Evidence**:
```javascript
// Get exact measurements
const interaction = document.querySelector('.black-hole-interaction');
const btn = document.querySelector('a[href="/ask"]');
console.log('Interaction rect:', interaction.getBoundingClientRect());
console.log('Button rect:', btn.getBoundingClientRect());
// Take screenshot
```

**Report**:
- Viewport width where blocked
- elementFromPoint result
- Button and interaction bounding boxes
- Screenshot

**Fix** (if needed):
- Adjust `left: 48%` to `left: 52%` or `left: 55%`
- Test again
- Commit and redeploy

---

## Success Criteria

✅ **PASS** if:
- Vercel deployed f27ab8c
- elementFromPoint returns button (not .black-hole-interaction)
- Hero buttons navigate correctly
- Ask page submits without refresh
- Black hole still interactive
- No console errors

❌ **BLOCKED** if:
- Buttons still blocked at any viewport
- Page refreshes on submit
- Console errors appear

---

## Quick Test Checklist

- [ ] Vercel shows f27ab8c deployed
- [ ] Production URL loads
- [ ] Hero buttons work on mobile (320-430px)
- [ ] Hero buttons work on tablet (768-820px)
- [ ] elementFromPoint returns button element
- [ ] Ask page doesn't refresh
- [ ] Groq provider works
- [ ] Physical device test (if available)

**Estimated Time**: 10-15 minutes

---

**Next**: Share production URL and test results to confirm final PASS status
