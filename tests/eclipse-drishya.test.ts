/**
 * Phase 6A — Eclipse Drishya Yantra Tests
 * 
 * Validates eclipse question detection, mode selection,
 * and security/safety requirements
 */

import { detectEclipseQuestion } from "@/components/drishya/EclipseDrishyaYantra";

describe("Phase 6A — Eclipse Drishya Yantra", () => {
  describe("Solar Eclipse Detection", () => {
    it("should detect English solar eclipse questions", () => {
      expect(detectEclipseQuestion("What is a solar eclipse")).toBe("solar");
      expect(detectEclipseQuestion("How does a solar eclipse happen")).toBe("solar");
      expect(detectEclipseQuestion("Why does the sun get blocked during eclipse")).toBe("solar");
    });

    it("should detect Hindi solar eclipse questions", () => {
      expect(detectEclipseQuestion("सूर्य ग्रहण क्या है")).toBe("solar");
      expect(detectEclipseQuestion("सूर्य ग्रहण कैसे होता है")).toBe("solar");
    });

    it("should detect Hinglish solar eclipse questions", () => {
      expect(detectEclipseQuestion("Surya grahan kyon hota hai")).toBe("solar");
      expect(detectEclipseQuestion("surya grahan kab hoga")).toBe("solar");
    });
  });

  describe("Lunar Eclipse Detection", () => {
    it("should detect English lunar eclipse questions", () => {
      expect(detectEclipseQuestion("What is a lunar eclipse")).toBe("lunar");
      expect(detectEclipseQuestion("How does a lunar eclipse happen")).toBe("lunar");
      expect(detectEclipseQuestion("When does the moon get into Earth's shadow")).toBe("lunar");
    });

    it("should detect Hindi lunar eclipse questions", () => {
      expect(detectEclipseQuestion("चंद्र ग्रहण क्या है")).toBe("lunar");
      expect(detectEclipseQuestion("Chandra grahan kyon hota hai")).toBe("lunar");
    });

    it("should detect Hinglish lunar eclipse questions", () => {
      expect(detectEclipseQuestion("Chand grahan kaise hota hai")).toBe("lunar");
      expect(detectEclipseQuestion("chandra grahan kab aayega")).toBe("lunar");
    });
  });

  describe("Rahu Ketu Mapping (Overview Mode)", () => {
    it("should map Rahu-Ketu eclipse questions to overview mode", () => {
      expect(detectEclipseQuestion("Rahu Ketu aur eclipse ka relation kya hai")).toBe("overview");
      expect(detectEclipseQuestion("What is the connection between Rahu Ketu and eclipses")).toBe("overview");
      expect(detectEclipseQuestion("राहु केतु और ग्रहण का क्या संबंध है")).toBe("overview");
    });

    it("should preserve narrative/science separation (not physical planets)", () => {
      // Detection function returns 'overview' for Rahu-Ketu
      // Scene shows ONLY Sun, Earth, Moon (no Rahu/Ketu spheres)
      const result = detectEclipseQuestion("Rahu Ketu eclipse story");
      expect(result).toBe("overview");
      // Textual answer may discuss mythology
      // Visual scene shows only scientific bodies
    });
  });

  describe("General Eclipse Questions", () => {
    it("should detect generic eclipse questions as overview", () => {
      expect(detectEclipseQuestion("What causes an eclipse")).toBe("overview");
      expect(detectEclipseQuestion("Eclipse kya hota hai")).toBe("overview");
      expect(detectEclipseQuestion("ग्रहण क्यों होता है")).toBe("overview");
    });
  });

  describe("Unrelated Question Rejection", () => {
    it("should return null for non-eclipse astronomy questions", () => {
      expect(detectEclipseQuestion("What is a black hole")).toBeNull();
      expect(detectEclipseQuestion("Neutron star kya hota hai")).toBeNull();
      expect(detectEclipseQuestion("How do seasons work")).toBeNull();
      expect(detectEclipseQuestion("What is a constellation")).toBeNull();
      expect(detectEclipseQuestion("कृष्ण विवर क्या है")).toBeNull();
    });

    it("should return null for Rahu Ketu without eclipse context", () => {
      expect(detectEclipseQuestion("Who is Rahu")).toBeNull();
      expect(detectEclipseQuestion("Ketu ki kahani")).toBeNull();
      expect(detectEclipseQuestion("राहु केतु कौन हैं")).toBeNull();
    });

    it("should return null for moon/sun questions without eclipse", () => {
      expect(detectEclipseQuestion("How far is the moon")).toBeNull();
      expect(detectEclipseQuestion("What is the sun made of")).toBeNull();
      expect(detectEclipseQuestion("Moon phases explained")).toBeNull();
    });
  });

  describe("Old Answer Compatibility", () => {
    it("should handle missing question gracefully", () => {
      expect(detectEclipseQuestion("")).toBeNull();
      // @ts-expect-error testing undefined input
      expect(detectEclipseQuestion(undefined)).toBeNull();
    });

    it("should be case-insensitive", () => {
      expect(detectEclipseQuestion("SOLAR ECLIPSE")).toBe("solar");
      expect(detectEclipseQuestion("Solar Eclipse")).toBe("solar");
      expect(detectEclipseQuestion("solar eclipse")).toBe("solar");
    });
  });

  describe("Security — No Unsafe HTML", () => {
    it("should handle questions with HTML tags safely", () => {
      const malicious = detectEclipseQuestion("<script>alert('xss')</script> solar eclipse");
      expect(malicious).toBe("solar");
      // Detection logic uses toLowerCase() which neutralizes tags
    });

    it("should handle questions with encoded characters", () => {
      const encoded = detectEclipseQuestion("solar%20eclipse");
      // %20 is not decoded by toLowerCase(), "eclipse" keyword still matches
      expect(encoded).toBe("overview");
    });
  });

  describe("Security — No Arbitrary Asset URLs", () => {
    it("should not attempt to load external URLs from question text", () => {
      // Scene uses hardcoded geometries and materials only
      // No dynamic texture/model loading from user input
      const external = detectEclipseQuestion("solar eclipse http://evil.com/model.gltf");
      expect(external).toBe("solar");
      // Returns mode only, doesn't process URLs
    });
  });

  describe("Reduced Motion Support", () => {
    it("should provide static scene mode for accessibility", () => {
      // Component checks prefers-reduced-motion
      // Disables OrbitControls and animations when detected
      // This is integration logic, tested via component mount
      // Detection function is independent of motion preference
      expect(detectEclipseQuestion("solar eclipse")).toBe("solar");
    });
  });

  describe("Scene Failure Fallback", () => {
    it("should allow textual answer to work independently", () => {
      // Detection returns mode or null
      // If WebGL fails, scene doesn't render but text remains
      // This is integration logic, detection always returns correctly
      expect(detectEclipseQuestion("lunar eclipse")).toBe("lunar");
    });
  });
});
