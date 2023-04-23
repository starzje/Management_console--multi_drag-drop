import { wasToggleInSelectionGroupKeyUsed, wasMultiSelectKeyUsed } from "../../helpers";

describe("Helper functions", () => {
  const createCustomEvent = (options: Partial<MouseEventInit> = {}) => {
    const event = new MouseEvent("click", options);
    return {
      ...event,
      nativeEvent: event,
      defaultPrevented: false,
      ctrlKey: options.ctrlKey || false,
      metaKey: options.metaKey || false,
      shiftKey: options.shiftKey || false,
    } as unknown as React.MouseEvent<Element>;
  };

  describe("wasToggleInSelectionGroupKeyUsed", () => {
    it("should return true when CTRL key is pressed on Windows", () => {
      // Mock navigator.userAgent
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        writable: true,
      });

      const event = createCustomEvent({ ctrlKey: true });
      expect(wasToggleInSelectionGroupKeyUsed(event)).toBe(true);
    });

    it("should return true when CMD key is pressed on non-Windows", () => {
      // Mock navigator.userAgent
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        writable: true,
      });

      const event = createCustomEvent({ metaKey: true });
      expect(wasToggleInSelectionGroupKeyUsed(event)).toBe(true);
    });

    it("should return false when no modifier key is pressed", () => {
      const event = createCustomEvent();
      expect(wasToggleInSelectionGroupKeyUsed(event)).toBe(false);
    });
  });

  describe("wasMultiSelectKeyUsed", () => {
    it("should return true when SHIFT key is pressed", () => {
      const event = createCustomEvent({ shiftKey: true });
      expect(wasMultiSelectKeyUsed(event)).toBe(true);
    });

    it("should return false when no modifier key is pressed", () => {
      const event = createCustomEvent();
      expect(wasMultiSelectKeyUsed(event)).toBe(false);
    });
  });
});
