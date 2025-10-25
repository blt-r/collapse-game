export const getPlatform = (): "android" | "ios" | "web" => {
  // Server-side rendering
  if (typeof window === "undefined") return "web";

  type CapacitorBridges = {
    androidBridge?: unknown;
    webkit?: {
      messageHandlers?: {
        bridge?: unknown;
      };
    };
  };

  const w: Window & typeof globalThis & CapacitorBridges = window;

  if (w?.androidBridge) {
    return "android";
  } else if (w?.webkit?.messageHandlers?.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
