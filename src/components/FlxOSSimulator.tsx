"use client";

import { useEffect, useState, useRef, MouseEvent, useReducer } from "react";
import styles from "./FlxOSSimulator.module.css";

// App definitions
interface AppInfo {
  id: string;
  name: string;
  icon: string;
}

interface WindowData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

const APPS: AppInfo[] = [
  { id: "settings", name: "Settings", icon: "⚙️" },
  { id: "files", name: "Files", icon: "📁" },
  { id: "telemetry", name: "System Info", icon: "💧" },
  { id: "tools", name: "Tools", icon: "🛠️" },
  { id: "editor", name: "Text Editor", icon: "📝" },
];

const INITIAL_LOGS = [
  "Initializing FlxOS v0.1.0-alpha...",
  "CPU: ESP32-S3 (XTensa LX7 dual core, 240MHz)",
  "Memory: 512KB SRAM, 8.0MB PSRAM initialized",
  "Flash: 16MB SPI Flash (QIO 120MHz) detected",
  "HAL: Display driver LovyanGFX registered (320x240)",
  "HAL: Touch driver FT6236 registered",
  "Filesystem: Mounting /flash (FAT12) ... Success (2.4MB free)",
  "Filesystem: Mounting /sdcard (FAT32) ... Success (14.8GB free)",
  "Preferences: Loaded system_theme='hyprland-dark'",
  "Network: Initializing WiFi stack (ESP-NOW + WPA3)...",
  "EventBus: Initialized daemon event loop",
  "Services: Starting watchdog system...",
  "Services: Starting Wi-Fi manager daemon...",
  "Services: Starting EventBus manager...",
  "LVGL: GUI core engine initialized (v9.1.0)",
  "WindowManager: Loading dwindle workspace...",
  "FlxOS Boot completed. Transitioning to shell..."
];

interface WindowState {
  openApps: string[];
  minimizedApps: string[];
  focusedApp: string | null;
  focusHistory: string[];
}

type WindowAction =
  | { type: "OPEN_APP"; appId: string }
  | { type: "CLOSE_APP"; appId: string }
  | { type: "MINIMIZE_APP"; appId: string }
  | { type: "FOCUS_APP"; appId: string }
  | { type: "RESET" };

const initialWindowState: WindowState = {
  openApps: [],
  minimizedApps: [],
  focusedApp: null,
  focusHistory: [],
};

function windowReducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case "OPEN_APP": {
      const { appId } = action;
      const nextOpen = state.openApps.includes(appId)
        ? state.openApps
        : [...state.openApps, appId];
      const nextMinimized = state.minimizedApps.filter((id) => id !== appId);
      const nextHistory = state.focusHistory.filter((id) => id !== appId);
      nextHistory.push(appId);
      return {
        openApps: nextOpen,
        minimizedApps: nextMinimized,
        focusedApp: appId,
        focusHistory: nextHistory,
      };
    }
    case "CLOSE_APP": {
      const { appId } = action;
      const nextOpen = state.openApps.filter((id) => id !== appId);
      const nextMinimized = state.minimizedApps.filter((id) => id !== appId);
      const nextHistory = state.focusHistory.filter((id) => id !== appId);
      
      let nextFocused = state.focusedApp;
      if (state.focusedApp === appId) {
        const remaining = nextHistory.filter((id) => nextOpen.includes(id) && !nextMinimized.includes(id));
        nextFocused = remaining.length > 0 ? remaining[remaining.length - 1] : null;
      }
      return {
        openApps: nextOpen,
        minimizedApps: nextMinimized,
        focusedApp: nextFocused,
        focusHistory: nextHistory,
      };
    }
    case "MINIMIZE_APP": {
      const { appId } = action;
      const nextMinimized = state.minimizedApps.includes(appId)
        ? state.minimizedApps
        : [...state.minimizedApps, appId];
      const nextHistory = state.focusHistory.filter((id) => id !== appId);
      
      const remaining = nextHistory.filter((id) => state.openApps.includes(id) && !nextMinimized.includes(id));
      const nextFocused = remaining.length > 0 ? remaining[remaining.length - 1] : null;

      return {
        openApps: state.openApps,
        minimizedApps: nextMinimized,
        focusedApp: nextFocused,
        focusHistory: nextHistory,
      };
    }
    case "FOCUS_APP": {
      const { appId } = action;
      if (!state.openApps.includes(appId) || state.minimizedApps.includes(appId)) {
        return state;
      }
      const nextHistory = state.focusHistory.filter((id) => id !== appId);
      nextHistory.push(appId);
      return {
        ...state,
        focusedApp: appId,
        focusHistory: nextHistory,
      };
    }
    case "RESET":
      return initialWindowState;
    default:
      return state;
  }
}

export default function FlxOSSimulator() {
  const [windowState, dispatch] = useReducer(windowReducer, initialWindowState);
  const { openApps, minimizedApps, focusedApp } = windowState;

  // General simulator states
  const [booting, setBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  
  // Status Bar & Settings states
  const [systemTime, setSystemTime] = useState("");
  const [wifiConnected, setWifiConnected] = useState(true);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiError, setWifiError] = useState("");
  const [brightness, setBrightness] = useState(85);
  
  // Screen Rotated State
  const [isRotated, setIsRotated] = useState(false);
  
  // Camera screenshot flash animation state
  const [screenshotFlash, setScreenshotFlash] = useState(false);
  
  // Theme state: "material-light" (Material) or "hyprland-dark" (Hyprland)
  const [systemTheme, setSystemTheme] = useState<"material-light" | "hyprland-dark">("hyprland-dark");
  const [layoutMode, setLayoutMode] = useState<"tiling" | "floating">("tiling");
  
  // Overlays (Top = Notifications, Bottom Right Up Chevron = Control Center)
  const [showLauncher, setShowLauncher] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  
  const [notifCount, setNotifCount] = useState(1);
  const [notifications, setNotifications] = useState<Array<{ id: number; title: string; desc: string; time: string }>>([
    { 
      id: 1, 
      title: "Screenshot Saved", 
      desc: "/sdcard/screenshots/scr_20260312_162756.png", 
      time: "05:41" 
    }
  ]);

  // Floating windows coordinates
  const [windowCoords, setWindowCoords] = useState<Record<string, WindowData>>({});
  
  // Virtual Filesystem
  const [fileSystem, setFileSystem] = useState<Record<string, string>>({
    "/flash/welcome.txt": "Welcome to FlxOS!\n\nThis is a modular, profile-driven operating system designed for ESP32 and desktop platforms. Double-click files to open them or use the Tools app to test peripherals.",
    "/flash/system.cfg": "{\n  \"version\": \"0.1.0\",\n  \"profile\": \"esp32s3-ili9341-xpt\",\n  \"theme\": \"hyprland-dark\",\n  \"wifi_enabled\": true,\n  \"brightness\": 85\n}",
    "/flash/readme.md": "### Features:\n- EventBus\n- Window Manager (Dwindle)\n- App Framework\n- Services orchestration",
    "/sdcard/todo.txt": "- Implement hardware watchdog\n- Add ESP-NOW mesh router\n- Optimise LovyanGFX DMA queue\n- Prepare for release",
  });
  const [filesPath, setFilesPath] = useState("A:/");
  
  // App specific states
  const [selectedFileRow, setSelectedFileRow] = useState<string | null>(null);
  const [showFileMenu, setShowFileMenu] = useState<string | null>(null);
  const [fileMenuPos, setFileMenuPos] = useState({ x: 0, y: 0 });
  
  // Editor App
  const [editorFilePath, setEditorFilePath] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  
  // System Info App
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<"system" | "memory" | "network" | "tasks">("system");
  const [cpuUsage, setCpuUsage] = useState({ core0: 14, core1: 17 });
  const [ramUsage, setRamUsage] = useState(196);
  const [uptime, setUptime] = useState(0);

  // Tools App Sub-Apps
  const [activeTool, setActiveTool] = useState<"list" | "calc" | "stopwatch" | "flashlight" | "displaytest">("list");
  
  // Calculator App
  const [calcInput, setCalcInput] = useState("0");
  
  // Stopwatch App
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  
  // Refs
  const dragStartPos = useRef({ x: 0, y: 0 });
  const activeDragWindow = useRef<string | null>(null);
  const stopwatchInterval = useRef<any>(null);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      setSystemTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence simulation
  useEffect(() => {
    if (!booting) return;
    let logIdx = 0;
    setBootLogs([INITIAL_LOGS[0]]);
    
    const interval = setInterval(() => {
      logIdx++;
      if (logIdx < INITIAL_LOGS.length) {
        setBootLogs((prev) => [...prev, INITIAL_LOGS[logIdx]]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooting(false);
          dispatch({ type: "RESET" });
        }, 500);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [booting]);

  // Simulated Telemetry updates (CPU, RAM, Uptime)
  useEffect(() => {
    if (booting) return;
    const interval = setInterval(() => {
      setCpuUsage({
        core0: Math.floor(Math.random() * 30) + 5,
        core1: Math.floor(Math.random() * 25) + 5,
      });
      setRamUsage((prev) => {
        const offset = Math.floor(Math.random() * 7) - 3;
        const next = prev + offset;
        return next > 250 ? 250 : next < 160 ? 160 : next;
      });
      setUptime((prev) => prev + 2);
    }, 2000);

    return () => clearInterval(interval);
  }, [booting]);

  // Stopwatch timer
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    } else {
      if (stopwatchInterval.current) clearInterval(stopwatchInterval.current);
    }
    return () => {
      if (stopwatchInterval.current) clearInterval(stopwatchInterval.current);
    };
  }, [stopwatchRunning]);

  const formatStopwatch = (timeMs: number) => {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    const ms = Math.floor((timeMs % 1000) / 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  const openApp = (appId: string) => {
    setShowLauncher(false);
    dispatch({ type: "OPEN_APP", appId });

    if (!windowCoords[appId]) {
      const idx = openApps.length;
      setWindowCoords((prev) => ({
        ...prev,
        [appId]: {
          id: appId,
          x: 15 + idx * 15,
          y: 30 + idx * 12,
          width: 250,
          height: 180,
          isMaximized: false,
        },
      }));
    }
  };

  const minimizeApp = (appId: string) => {
    dispatch({ type: "MINIMIZE_APP", appId });
  };

  const closeApp = (appId: string) => {
    dispatch({ type: "CLOSE_APP", appId });
    if (appId === "editor") {
      setKeyboardOpen(false);
    }
  };

  // Dwindle rect layouts
  const getDwindleRects = (count: number) => {
    const rects: Array<{ left: number; top: number; width: number; height: number }> = [];
    let left = 0;
    let top = 0;
    let width = 100;
    let height = 100;

    for (let i = 0; i < count; i++) {
      if (i === count - 1) {
        rects.push({ left, top, width, height });
      } else {
        const splitHorizontal = i % 2 === 0;
        if (splitHorizontal) {
          const halfWidth = width / 2;
          rects.push({ left, top, width: halfWidth, height });
          left += halfWidth;
          width = halfWidth;
        } else {
          const halfHeight = height / 2;
          rects.push({ left, top, width, height: halfHeight });
          top += halfHeight;
          height = halfHeight;
        }
      }
    }
    return rects;
  };

  const visibleApps = openApps.filter((id) => !minimizedApps.includes(id));
  const dwindleRects = getDwindleRects(visibleApps.length);

  // Dragging event handlers
  const handleDragStart = (e: MouseEvent<HTMLDivElement>, appId: string) => {
    if (layoutMode === "tiling") return;
    dispatch({ type: "FOCUS_APP", appId });
    activeDragWindow.current = appId;
    dragStartPos.current = {
      x: e.clientX - (windowCoords[appId]?.x || 0),
      y: e.clientY - (windowCoords[appId]?.y || 0),
    };

    const handleDragMove = (moveEvent: any) => {
      if (!activeDragWindow.current) return;
      const targetId = activeDragWindow.current;
      const newX = moveEvent.clientX - dragStartPos.current.x;
      const newY = moveEvent.clientY - dragStartPos.current.y;
      
      const clampedX = Math.max(-50, Math.min(300, newX));
      const clampedY = Math.max(24, Math.min(220, newY));

      setWindowCoords((prev) => ({
        ...prev,
        [targetId]: {
          ...prev[targetId],
          x: clampedX,
          y: clampedY,
        },
      }));
    };

    const handleDragEnd = () => {
      activeDragWindow.current = null;
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };

    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
  };

  const toggleMaximize = (appId: string) => {
    setWindowCoords((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isMaximized: !prev[appId]?.isMaximized,
      },
    }));
  };

  const handleConnectWifi = () => {
    setWifiError("");
    if (!wifiPassword) {
      setWifiError("Password required");
      return;
    }
    
    setTimeout(() => {
      setWifiConnected(true);
      setShowWifiModal(false);
      setWifiPassword("");
      setNotifCount((prev) => prev + 1);
      
      const d = new Date();
      const hrs = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      const currentTime = `${hrs}:${mins}`;

      setNotifications((prev) => [
        { 
          id: Date.now(), 
          title: "WiFi Connected", 
          desc: "Successfully connected to FlxOS_Labs_IoT.", 
          time: currentTime 
        },
        ...prev
      ]);
    }, 800);
  };

  const handleCalcClick = (val: string) => {
    if (val === "C") {
      setCalcInput("0");
    } else if (val === "=") {
      try {
        const sanitized = calcInput.replace(/×/g, "*").replace(/÷/g, "/");
        const res = new Function(`return ${sanitized}`)();
        setCalcInput(String(res));
      } catch (err) {
        setCalcInput("Error");
      }
    } else {
      if (calcInput === "0" || calcInput === "Error") {
        setCalcInput(val);
      } else {
        setCalcInput((prev) => prev + val);
      }
    }
  };

  const handleKeyClick = (key: string) => {
    if (key === "Back") {
      setEditorContent((prev) => prev.slice(0, -1));
    } else if (key === "Space") {
      setEditorContent((prev) => prev + " ");
    } else if (key === "Enter") {
      setEditorContent((prev) => prev + "\n");
    } else {
      setEditorContent((prev) => prev + key);
    }
  };

  const saveEditorFile = () => {
    if (editorFilePath) {
      setFileSystem((prev) => ({
        ...prev,
        [editorFilePath]: editorContent,
      }));
      setNotifCount((prev) => prev + 1);
      setNotifications((prev) => [
        { 
          id: Date.now(), 
          title: "File Saved", 
          desc: `Saved file: ${editorFilePath.split("/").pop()}`, 
          time: systemTime 
        },
        ...prev
      ]);
    }
  };

  const openFileInEditor = (path: string) => {
    setEditorFilePath(path);
    setEditorContent(fileSystem[path] || "");
    openApp("editor");
  };

  const getFilesList = () => {
    const list: Array<{ name: string; isDir: boolean; path: string }> = [];
    if (filesPath === "A:/") {
      list.push({ name: "system", isDir: true, path: "A:/system" });
      list.push({ name: "data", isDir: true, path: "A:/data" });
      list.push({ name: "sdcard", isDir: true, path: "A:/sdcard" });
    } else if (filesPath === "A:/system") {
      list.push({ name: "welcome.txt", isDir: false, path: "/flash/welcome.txt" });
      list.push({ name: "system.cfg", isDir: false, path: "/flash/system.cfg" });
    } else if (filesPath === "A:/data") {
      list.push({ name: "readme.md", isDir: false, path: "/flash/readme.md" });
    } else if (filesPath === "A:/sdcard") {
      list.push({ name: "todo.txt", isDir: false, path: "/sdcard/todo.txt" });
    }
    return list;
  };

  const handleFileMenuClick = (e: MouseEvent, path: string) => {
    e.stopPropagation();
    setSelectedFileRow(path);
    setShowFileMenu(path);
    const rect = (e.currentTarget as HTMLElement).closest(`.${styles.filesApp}`)?.getBoundingClientRect();
    if (rect) {
      setFileMenuPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else {
      setFileMenuPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Simulated Screenshot Action
  const triggerScreenshot = () => {
    setScreenshotFlash(true);
    setTimeout(() => setScreenshotFlash(false), 300);

    const timeString = systemTime;
    const num = Math.floor(Math.random() * 899999) + 100000;
    const pathName = `/sdcard/screenshots/scr_20260713_${num}.png`;

    setNotifCount((prev) => prev + 1);
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "Screenshot Saved",
        desc: pathName,
        time: timeString,
      },
      ...prev
    ]);
  };

  return (
    <div className={styles.container}>
      {/* Outer physical console mockup */}
      <div className={styles.deviceFrame}>
        <div className={`${styles.led} ${booting ? styles.ledBooting : ""}`} />
        
        {/* Device screen viewport */}
        <div 
          className={`${styles.screen} ${
            systemTheme === "hyprland-dark" ? styles.hyprTheme : ""
          } ${isRotated ? styles.rotated : ""}`}
          style={{ 
            aspectRatio: "4/3",
            filter: `brightness(${50 + brightness * 0.5}%)`
          }}
        >
          {/* Camera Flash Screen Overlay */}
          {screenshotFlash && <div className={styles.flashOverlay} />}

          {booting ? (
            /* BOOT SCREEN */
            <div className={styles.bootScreen}>
              {bootLogs.map((log, idx) => (
                <div key={idx} className={styles.termLine}>{log}</div>
              ))}
              <div className={styles.termLine}>
                <span className={styles.cursor} />
              </div>
            </div>
          ) : (
            /* DESKTOP INTERFACE */
            <div 
              className={styles.desktop}
              style={{
                // Snowy Forest Campfire wallpaper matching FlxOS screenshots
                backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 480 320' xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' preserveAspectRatio='none'><linearGradient id='skyGrad' x1='0' y1='0' x2='0' y2='1'><stop offset='0%25' stop-color='%23141724' /><stop offset='60%25' stop-color='%23283254' /><stop offset='100%25' stop-color='%2346588a' /></linearGradient><rect width='480' height='320' fill='url(%23skyGrad)' /><circle cx='40' cy='30' r='1.5' fill='%23fff' opacity='0.8' /><circle cx='120' cy='50' r='1.5' fill='%23fff' opacity='0.6' /><circle cx='200' cy='25' r='1.5' fill='%23fff' opacity='0.9' /><circle cx='340' cy='60' r='1.5' fill='%23fff' opacity='0.5' /><circle cx='420' cy='35' r='1.5' fill='%23fff' opacity='0.8' /><circle cx='440' cy='40' r='12' fill='%23fefcbf' opacity='0.85' /><polygon points='0,220 70,130 150,220' fill='%2320253b' /><polygon points='90,220 180,120 270,220' fill='%232b314f' /><polygon points='210,220 310,110 410,220' fill='%231d2136' /><polygon points='340,220 420,140 480,220' fill='%232f375c' /><rect y='210' width='480' height='110' fill='%23e2ebf8' /><rect x='25' y='170' width='8' height='40' fill='%233a2512' /><polygon points='10,180 29,110 48,180' fill='%23142c16' /><polygon points='15,145 29,90 43,145' fill='%231b3d1f' /><rect x='115' y='160' width='10' height='50' fill='%233a2512' /><polygon points='95,170 120,95 145,170' fill='%23102512' /><polygon points='102,135 120,75 138,135' fill='%23163319' /><rect x='200' y='225' width='20' height='5' rx='1' fill='%235c4033' /><rect x='204' y='222' width='12' height='5' rx='1' fill='%238b5a2b' /><polygon points='201,222 206,202 211,222' fill='%23ff7f00' /><polygon points='206,222 210,195 214,222' fill='%23ff3300' /><polygon points='204,222 208,206 212,222' fill='%23ffcc00' /><rect x='235' y='224' width='24' height='8' rx='2' fill='%23ffffff' /><rect x='253' y='220' width='8' height='6' rx='1' fill='%23ffffff' /><circle cx='258' cy='222' r='0.6' fill='%23000' /></svg>")`
              }}
            >
              {/* TOP STATUS BAR - CLICK TOGGLES NOTIFICATIONS ONLY */}
              <div 
                className={styles.statusBar}
                onClick={() => {
                  setShowNotifPanel(!showNotifPanel);
                  setShowQuickAccess(false);
                }}
              >
                <div className={styles.statusBarItem}>
                  <span>📶</span>
                  <span>((o))</span>
                  <span>⚙️</span>
                  <span>🔔{notifCount}</span>
                </div>
                
                <div className="font-sans font-extrabold pr-2 text-[10px]">
                  {systemTime}
                </div>
              </div>

              {/* NOTIFICATION PANEL - SLIDES DOWN FROM THE TOP */}
              {showNotifPanel && (
                <div className={styles.notificationPanel}>
                  <div className={styles.panelHeader}>
                    <h4 className={styles.panelTitle}>Notifications</h4>
                    <button 
                      className={styles.clearBtn}
                      onClick={() => {
                        setNotifications([]);
                        setNotifCount(0);
                      }}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className={styles.panelList}>
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-gray-400 italic text-center py-4">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={styles.panelItem}>
                          <div className={styles.panelItemContent}>
                            <span className={styles.panelItemIcon}>🖼️</span>
                            <div className={styles.panelItemText}>
                              <div className="flex items-center gap-1">
                                <span className={styles.panelItemTitle}>{n.title}</span>
                                <span className={styles.panelItemTime}>{n.time}</span>
                              </div>
                              <span className={styles.panelItemDesc}>{n.desc}</span>
                            </div>
                          </div>
                          <button 
                            className={styles.panelItemClose}
                            onClick={() => {
                              setNotifications(prev => prev.filter(item => item.id !== n.id));
                              setNotifCount(prev => Math.max(0, prev - 1));
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div 
                    className={styles.panelCloseTab}
                    onClick={() => setShowNotifPanel(false)}
                  >
                    <span>▲</span>
                  </div>
                </div>
              )}

              {/* CONTROL CENTER / QUICK ACCESS PANEL - BOTTOM-UP TOGGLE */}
              {showQuickAccess && (
                <div className={styles.quickAccessPanel}>
                  <div className={styles.qaHeader}>
                    <span className={styles.qaTitle}>Quick Access</span>
                    <button 
                      className={styles.qaSettingsBtn}
                      onClick={() => {
                        openApp("settings");
                        setShowQuickAccess(false);
                      }}
                    >
                      ⚙️
                    </button>
                  </div>

                  <div className={styles.qaButtonsRow}>
                    {/* Theme Toggler circle */}
                    <div 
                      className={styles.qaButtonCol}
                      onClick={() => {
                        setSystemTheme(systemTheme === "material-light" ? "hyprland-dark" : "material-light");
                      }}
                    >
                      <div className={`${styles.qaCircleBtn} ${styles.circleMaterial}`}>
                        ✏️
                      </div>
                      <span className={styles.qaButtonLabel}>
                        {systemTheme === "material-light" ? "Material" : "Hyprland"}
                      </span>
                    </div>

                    {/* Rotation Toggler circle */}
                    <div 
                      className={styles.qaButtonCol}
                      onClick={() => setIsRotated(!isRotated)}
                    >
                      <div className={`${styles.qaCircleBtn} ${styles.circleRotation}`}>
                        🔄
                      </div>
                      <span className={styles.qaButtonLabel}>
                        {isRotated ? "90°" : "0°"}
                      </span>
                    </div>

                    {/* Screenshot Toggler circle */}
                    <div 
                      className={styles.qaButtonCol}
                      onClick={triggerScreenshot}
                    >
                      <div className={`${styles.qaCircleBtn} ${styles.circleScreenshot}`}>
                        ✂️
                      </div>
                      <span className={styles.qaButtonLabel}>
                        creenshot
                      </span>
                    </div>
                  </div>

                  {/* Brightness Slider */}
                  <div className={styles.qsSliderRow}>
                    <span className="text-[10px]">👁️</span>
                    <input 
                      type="range" 
                      min="15" 
                      max="100" 
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className={styles.qsSlider}
                    />
                    <span className="font-mono text-[9px] w-6 text-right">{brightness}%</span>
                  </div>
                </div>
              )}

              {/* WINDOW MANAGER WORKSPACE */}
              <div 
                className={styles.workspace}
                onClick={() => {
                  setShowLauncher(false);
                  setShowNotifPanel(false);
                  setShowQuickAccess(false);
                  setShowFileMenu(null);
                }}
              >
                {visibleApps.map((appId, idx) => {
                  const app = APPS.find((a) => a.id === appId);
                  if (!app) return null;
                  
                  const isActive = focusedApp === appId;
                  const coords = windowCoords[appId] || { x: 30, y: 40, width: 250, height: 180, isMaximized: false };
                  
                  // Position styling based on Tiling or Floating Layout
                  let winStyle: any = {};
                  if (layoutMode === "tiling") {
                    const rect = dwindleRects[idx];
                    if (rect) {
                      winStyle = {
                        left: `${rect.left}%`,
                        top: `${rect.top}%`,
                        width: `${rect.width}%`,
                        height: `${rect.height}%`,
                      };
                    }
                  } else {
                    winStyle = coords.isMaximized
                      ? { left: "0", top: "0", width: "100%", height: "100%" }
                      : {
                          left: `${coords.x}px`,
                          top: `${coords.y}px`,
                          width: `${coords.width}px`,
                          height: `${coords.height}px`,
                        };
                  }

                  return (
                    <div
                      key={appId}
                      className={`${styles.window} ${isActive ? styles.windowActive : ""}`}
                      style={winStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "FOCUS_APP", appId });
                      }}
                    >
                      {/* Window Header */}
                      <div 
                        className={styles.windowHeader}
                        onMouseDown={(e) => handleDragStart(e, appId)}
                      >
                        <div className={styles.windowTitle}>
                          <span>{app.name}</span>
                        </div>
                        <div className={styles.windowControls} onMouseDown={(e) => e.stopPropagation()}>
                          <button 
                            className={styles.windowBtn}
                            onClick={(e) => { e.stopPropagation(); minimizeApp(appId); }}
                          >
                            v
                          </button>
                          {layoutMode === "floating" && (
                            <button 
                              className={styles.windowBtn}
                              onClick={(e) => { e.stopPropagation(); toggleMaximize(appId); }}
                            >
                              +
                            </button>
                          )}
                          <button 
                            className={styles.windowBtn}
                            onClick={(e) => { e.stopPropagation(); closeApp(appId); }}
                          >
                            x
                          </button>
                        </div>
                      </div>

                      {/* Window Body */}
                      <div className={styles.windowBody}>
                        <div className={styles.appContent}>
                          
                          {appId === "telemetry" && (
                            /* SYSTEM INFO TABBED VIEW */
                            <div className={styles.telemetryApp}>
                              <div className={styles.appTabs}>
                                <div 
                                  className={`${styles.tabItem} ${activeTelemetryTab === "system" ? styles.tabActive : ""}`}
                                  onClick={() => setActiveTelemetryTab("system")}
                                >
                                  System
                                </div>
                                <div 
                                  className={`${styles.tabItem} ${activeTelemetryTab === "memory" ? styles.tabActive : ""}`}
                                  onClick={() => setActiveTelemetryTab("memory")}
                                >
                                  Memory
                                </div>
                                <div 
                                  className={`${styles.tabItem} ${activeTelemetryTab === "network" ? styles.tabActive : ""}`}
                                  onClick={() => setActiveTelemetryTab("network")}
                                >
                                  Network
                                </div>
                                <div 
                                  className={`${styles.tabItem} ${activeTelemetryTab === "tasks" ? styles.tabActive : ""}`}
                                  onClick={() => setActiveTelemetryTab("tasks")}
                                >
                                  Tasks
                                </div>
                              </div>

                              <div className={styles.tabContent}>
                                {activeTelemetryTab === "system" && (
                                  <div>
                                    <div className={styles.groupHeader}>Software & Firmware</div>
                                    <div className={styles.infoRow}>
                                      <span className={styles.infoIcon}>⚙️</span>
                                      <span>FlxOS 0.1.0-alpha</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span className={styles.infoIcon}>💾</span>
                                      <span>Built: Mar 12 2026 16:16:47</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span className={styles.infoIcon}>📄</span>
                                      <span>ESP-IDF v5.5.3-dirty</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span className={styles.infoIcon}>🔌</span>
                                      <span>Boot Reason: Power On</span>
                                    </div>
                                  </div>
                                )}

                                {activeTelemetryTab === "memory" && (
                                  <div>
                                    <div className={styles.groupHeader}>SRAM Heaps</div>
                                    <div className={styles.progressLabel}>
                                      <span>Internal SRAM</span>
                                      <span>{ramUsage}KB / 512KB</span>
                                    </div>
                                    <div className={styles.progressBarBg}>
                                      <div className={styles.progressBar} style={{ width: `${(ramUsage/512)*100}%` }} />
                                    </div>

                                    <div className={styles.groupHeader}>PSRAM (External) Heaps</div>
                                    <div className={styles.progressLabel}>
                                      <span>SPI PSRAM Map</span>
                                      <span>1.2MB / 8.0MB</span>
                                    </div>
                                    <div className={styles.progressBarBg}>
                                      <div className={styles.progressBar} style={{ width: "15%" }} />
                                    </div>
                                  </div>
                                )}

                                {activeTelemetryTab === "network" && (
                                  <div>
                                    <div className={styles.groupHeader}>WiFi Stack</div>
                                    <div className={styles.infoRow}>
                                      <span>Module Status:</span>
                                      <span className="font-bold text-emerald-600 ml-auto">ENABLED</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span>Connected SSID:</span>
                                      <span className="font-mono text-gray-500 ml-auto">FlxOS_Labs_IoT</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span>Signal RSSI:</span>
                                      <span className="font-mono ml-auto">-64 dBm</span>
                                    </div>
                                  </div>
                                )}

                                {activeTelemetryTab === "tasks" && (
                                  <div>
                                    <div className={styles.groupHeader}>Running Daemon Tasks</div>
                                    <div className={styles.infoRow}>
                                      <span>Idle Task</span>
                                      <span className="text-gray-400 font-mono ml-auto">Core 1 (0.8%)</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span>EventBus thread</span>
                                      <span className="text-gray-400 font-mono ml-auto">Core 0 (1.4%)</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span>LovyanGFX thread</span>
                                      <span className="text-gray-400 font-mono ml-auto">Core 0 (12.2%)</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                      <span>UI Task (LVGL)</span>
                                      <span className="text-gray-400 font-mono ml-auto">Core 0 (3.5%)</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {appId === "files" && (
                            /* FILES APP */
                            <div className={styles.filesApp}>
                              <div className={styles.filesToolbar}>
                                <button 
                                  className={styles.filesToolbarBtn}
                                  onClick={() => {
                                    if (filesPath !== "A:/") {
                                      setFilesPath("A:/");
                                      setSelectedFileRow(null);
                                    }
                                  }}
                                >
                                  &lt;
                                </button>
                                <button 
                                  className={styles.filesToolbarBtn}
                                  onClick={() => { setFilesPath("A:/"); setSelectedFileRow(null); }}
                                >
                                  🏠
                                </button>
                                <button 
                                  className={styles.filesToolbarBtn}
                                  onClick={() => {
                                    const filename = prompt("Create new file in " + filesPath);
                                    if (filename) {
                                      const path = filesPath === "A:/" ? `/flash/${filename}` : `${filesPath.replace("A:/", "/flash/")}/${filename}`;
                                      setFileSystem(prev => ({ ...prev, [path]: "" }));
                                    }
                                  }}
                                >
                                  +
                                </button>
                                <span className={styles.filesPath}>{filesPath}</span>
                              </div>

                              <div className={styles.filesContent}>
                                <div className={styles.filesList}>
                                  {getFilesList().map((item) => {
                                    const isSelected = selectedFileRow === item.path;
                                    return (
                                      <div
                                        key={item.path}
                                        className={`${styles.fileRow} ${isSelected ? styles.fileRowSelected : ""}`}
                                        onClick={() => setSelectedFileRow(item.path)}
                                        onDoubleClick={() => {
                                          if (item.isDir) {
                                            setFilesPath(item.path);
                                            setSelectedFileRow(null);
                                          } else {
                                            openFileInEditor(item.path);
                                          }
                                        }}
                                      >
                                        <div className={styles.fileMeta}>
                                          <span>{item.isDir ? "📁" : "📄"}</span>
                                          <span>{item.name}</span>
                                        </div>
                                        <button 
                                          className={styles.fileMenuBtn}
                                          onClick={(e) => handleFileMenuClick(e, item.path)}
                                        >
                                          ☰
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Context menu overlay */}
                              {showFileMenu && (
                                <div 
                                  className={styles.contextMenu}
                                  style={{ left: `${fileMenuPos.x}px`, top: `${fileMenuPos.y}px` }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div 
                                    className={styles.contextMenuItem}
                                    onClick={() => {
                                      if (selectedFileRow && !selectedFileRow.endsWith("/")) {
                                        openFileInEditor(selectedFileRow);
                                      }
                                      setShowFileMenu(null);
                                    }}
                                  >
                                    Open
                                  </div>
                                  <div 
                                    className={styles.contextMenuItem}
                                    onClick={() => {
                                      if (selectedFileRow) {
                                        setFileSystem(prev => {
                                          const copy = { ...prev };
                                          delete copy[selectedFileRow];
                                          return copy;
                                        });
                                      }
                                      setShowFileMenu(null);
                                      setSelectedFileRow(null);
                                    }}
                                  >
                                    Delete
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {appId === "tools" && (
                            /* TOOLS APP */
                            <div className="w-full h-full">
                              {activeTool === "list" && (
                                <div className={styles.toolsApp}>
                                  <div className={styles.groupHeader}>Utilities</div>
                                  <div className={styles.toolsList}>
                                    <div className={styles.toolsRow} onClick={() => setActiveTool("calc")}>
                                      <span>⚡</span> <span>Calculator</span>
                                    </div>
                                    <div className={styles.toolsRow} onClick={() => setActiveTool("stopwatch")}>
                                      <span>⏱️</span> <span>Stopwatch</span>
                                    </div>
                                  </div>

                                  <div className={styles.groupHeader} style={{ marginTop: "10px" }}>Display Tools</div>
                                  <div className={styles.toolsList}>
                                    <div className={styles.toolsRow} onClick={() => setActiveTool("flashlight")}>
                                      <span>👁️</span> <span>Flashlight</span>
                                    </div>
                                    <div className={styles.toolsRow} onClick={() => setActiveTool("displaytest")}>
                                      <span>🖼️</span> <span>Display Test</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeTool === "calc" && (
                                <div className={styles.calcApp}>
                                  <div className="flex bg-[#f4f4f6] px-2 py-1 border-b border-gray-200">
                                    <button className="text-[9px] font-bold text-gray-500" onClick={() => setActiveTool("list")}>
                                      &lt; Back to Tools
                                    </button>
                                  </div>
                                  <div className={styles.calcScreen}>{calcInput}</div>
                                  <div className={styles.calcGrid}>
                                    {["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="].map((val) => {
                                      let btnClass = styles.calcBtn;
                                      if (["÷", "×", "-", "+"].includes(val)) btnClass = `${styles.calcBtn} ${styles.calcBtnOp}`;
                                      if (val === "=") btnClass = `${styles.calcBtn} ${styles.calcBtnEqual}`;
                                      
                                      return (
                                        <button
                                          key={val}
                                          className={btnClass}
                                          style={val === "0" ? { gridColumn: "span 2" } : {}}
                                          onClick={() => handleCalcClick(val)}
                                        >
                                          {val}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {activeTool === "stopwatch" && (
                                <div className="p-4 flex flex-col items-center justify-center h-full bg-[#f4f4f6]">
                                  <div className="w-full text-left mb-4">
                                    <button className="text-[9px] font-bold text-gray-500" onClick={() => setActiveTool("list")}>
                                      &lt; Back to Tools
                                    </button>
                                  </div>
                                  <div className="text-2xl font-mono font-extrabold text-[#111] mb-6">
                                    {formatStopwatch(stopwatchTime)}
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      className="px-4 py-1.5 bg-[#3851c5] text-white rounded text-[10px] font-bold"
                                      onClick={() => setStopwatchRunning(!stopwatchRunning)}
                                    >
                                      {stopwatchRunning ? "Pause" : "Start"}
                                    </button>
                                    <button 
                                      className="px-4 py-1.5 bg-gray-300 text-black rounded text-[10px] font-bold"
                                      onClick={() => { setStopwatchTime(0); setStopwatchRunning(false); }}
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </div>
                              )}

                              {activeTool === "flashlight" && (
                                <div 
                                  className="w-full h-full bg-white flex flex-col items-center justify-center cursor-pointer"
                                  onClick={() => setActiveTool("list")}
                                >
                                  <span className="text-[10px] text-gray-400 animate-pulse">FLASHLIGHT ON - CLICK TO CLOSE</span>
                                </div>
                              )}

                              {activeTool === "displaytest" && (
                                <div 
                                  className="w-full h-full flex cursor-pointer"
                                  onClick={() => setActiveTool("list")}
                                >
                                  <div className="flex-1 bg-white" />
                                  <div className="flex-1 bg-yellow-400" />
                                  <div className="flex-1 bg-cyan-400" />
                                  <div className="flex-1 bg-emerald-500" />
                                  <div className="flex-1" style={{ backgroundColor: "#d81b60" }} />
                                  <div className="flex-1 bg-red-500" />
                                  <div className="flex-1 bg-blue-600" />
                                  <div className="flex-1 bg-black" />
                                </div>
                              )}
                            </div>
                          )}

                          {appId === "editor" && (
                            /* TEXT EDITOR */
                            <div className={styles.editorApp}>
                              <div className={styles.editorToolbar}>
                                <span className="text-[8px] text-gray-500 truncate max-w-[120px]">
                                  {editorFilePath ? editorFilePath.split("/").pop() : "Buffer"}
                                </span>
                                <div className="flex gap-1.5">
                                  <button 
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-0.5 rounded text-[8px] font-bold"
                                    onClick={() => setKeyboardOpen(!keyboardOpen)}
                                  >
                                    ⌨️ Keyboard
                                  </button>
                                  <button 
                                    className="bg-[#3851c5] hover:opacity-90 px-2.5 py-0.5 rounded text-[8px] text-white font-bold"
                                    onClick={saveEditorFile}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                              <textarea
                                className={styles.editorInput}
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
                                placeholder="Edit text file..."
                                onFocus={() => setKeyboardOpen(true)}
                              />
                            </div>
                          )}

                          {appId === "settings" && (
                            /* SETTINGS App */
                            <div className={styles.settingsApp}>
                              <div className={styles.settingsList}>
                                <div className={styles.groupHeader}>Connectivity</div>
                                <div 
                                  className={styles.settingsRow}
                                  onClick={() => setShowWifiModal(true)}
                                >
                                  <span>🌐 Wi-Fi</span>
                                  <span className="ml-auto text-[9px] text-gray-400">
                                    {wifiConnected ? "Connected" : "Disconnected"}
                                  </span>
                                </div>
                                <div className={styles.settingsRow}>
                                  <span>📡 Hotspot</span>
                                  <span className="ml-auto">Off</span>
                                </div>
                                <div className={styles.settingsRow}>
                                  <span>📶 Bluetooth</span>
                                  <span className="ml-auto">On</span>
                                </div>

                                <div className={styles.groupHeader} style={{ marginTop: "10px" }}>System</div>
                                <div className={styles.settingsRow}>
                                  <span>🎨 Theme Switcher</span>
                                  <button 
                                    className="ml-auto text-[9px] bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-bold"
                                    onClick={() => {
                                      setSystemTheme(systemTheme === "material-light" ? "hyprland-dark" : "material-light");
                                    }}
                                  >
                                    Theme
                                  </button>
                                </div>
                                <div className={styles.settingsRow}>
                                  <span>☀️ Brightness</span>
                                  <input 
                                    type="range" 
                                    min="15" 
                                    max="100" 
                                    value={brightness}
                                    onChange={(e) => setBrightness(Number(e.target.value))}
                                    className={styles.qsSlider}
                                  />
                                </div>
                                <div className={styles.settingsRow}>
                                  <span>⚠️ Factory Reset</span>
                                  <button 
                                    className="ml-auto bg-red-100 hover:bg-red-200 text-red-600 text-[8px] px-2 py-0.5 rounded font-bold"
                                    onClick={() => {
                                      setBooting(true);
                                      dispatch({ type: "RESET" });
                                    }}
                                  >
                                    Reboot
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* VIRTUAL KEYBOARD PANEL */}
              <div className={`${styles.keyboard} ${keyboardOpen ? styles.keyboardOpen : ""}`}>
                <div className={styles.kbRow}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Back"].map((k) => (
                    <button 
                      key={k} 
                      className={`${styles.kbKey} ${k === "Back" ? styles.kbKeyWide : ""}`}
                      onClick={() => handleKeyClick(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div className={styles.kbRow}>
                  {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "-"].map((k) => (
                    <button key={k} className={styles.kbKey} onClick={() => handleKeyClick(k)}>{k}</button>
                  ))}
                </div>
                <div className={styles.kbRow}>
                  {["a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter"].map((k) => (
                    <button 
                      key={k} 
                      className={`${styles.kbKey} ${k === "Enter" ? styles.kbKeyWide : ""}`}
                      onClick={() => handleKeyClick(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div className={styles.kbRow}>
                  {["z", "x", "c", "v", "b", "n", "m", ",", ".", "Space"].map((k) => (
                    <button 
                      key={k} 
                      className={`${styles.kbKey} ${k === "Space" ? styles.kbKeySpace : ""}`}
                      onClick={() => handleKeyClick(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* VERTICAL APP LAUNCHER PANEL */}
              {showLauncher && (
                <div className={styles.appLauncher}>
                  <h3 className={styles.launcherTitle}>Applications</h3>
                  <div className={styles.launcherGrid}>
                    {APPS.map((app) => (
                      <div 
                        key={app.id} 
                        className={styles.launcherItem}
                        onClick={() => openApp(app.id)}
                      >
                        <span className={styles.launcherIcon}>{app.icon}</span>
                        <span className={styles.launcherLabel}>{app.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOTTOM APP DOCK / BAR */}
              <div className={styles.dock}>
                {/* Launcher Button on Left */}
                <div 
                  className={styles.dockItem} 
                  onClick={() => {
                    setShowLauncher(!showLauncher);
                    setShowNotifPanel(false);
                    setShowQuickAccess(false);
                  }}
                >
                  <span className="text-white text-[10px]">☰</span>
                </div>
                
                {/* Shortcut Apps */}
                <div className={styles.dockShortcuts}>
                  {APPS.slice(0, 4).map((app) => {
                    const isOpen = openApps.includes(app.id);
                    const isFocused = focusedApp === app.id;
                    
                    let btnClass = "";
                    if (isFocused) {
                      if (systemTheme === "hyprland-dark" && app.id === "telemetry") {
                        btnClass = styles.dockItemActiveMagenta;
                      } else {
                        btnClass = styles.dockItemActive;
                      }
                    } else if (isOpen) {
                      btnClass = styles.dockItemOpen;
                    }
                    
                    return (
                      <div
                        key={app.id}
                        className={`${styles.dockItem} ${btnClass}`}
                        onClick={() => {
                          openApp(app.id);
                          setShowNotifPanel(false);
                          setShowQuickAccess(false);
                        }}
                      >
                        <span className="text-white text-[11px]">{app.icon}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Control Center Up Chevron Button on Right - YELLOW WHEN ACTIVE */}
                <div 
                  className={`${styles.dockItem} ${showQuickAccess ? styles.dockItemActive : ""}`}
                  onClick={() => {
                    setShowQuickAccess(!showQuickAccess);
                    setShowNotifPanel(false);
                  }}
                >
                  <span className="text-white text-[10px]">▲</span>
                </div>
              </div>
            </div>
          )}

          {/* WIFI CONNECTION PROMPT MODAL */}
          {showWifiModal && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-6 z-[300]">
              <div className="bg-[#14161f] border border-gray-800 rounded-xl p-4 w-full max-w-[240px] space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  📶 Connect to WiFi
                </h4>
                <div>
                  <p className="text-[8px] text-gray-500 mb-1">Select Network</p>
                  <select className="w-full bg-[#1b1e28] border border-gray-800 rounded p-1 text-[9px] text-white">
                    <option>FlxOS_Labs_IoT (Secured)</option>
                    <option>LilyGo_AP (Open)</option>
                    <option>ESP32_Broadcast (Secured)</option>
                  </select>
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 mb-1">WPA2/WPA3 Password</p>
                  <input
                    type="password"
                    placeholder="Enter password..."
                    className="w-full bg-[#1b1e28] border border-gray-800 rounded p-1 text-[9px] text-white"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                  {wifiError && <p className="text-[7px] text-red-400 mt-1">{wifiError}</p>}
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-[9px] px-2 py-1 rounded"
                    onClick={() => {
                      setShowWifiModal(false);
                      setWifiPassword("");
                      setWifiError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#3851c5] text-white text-[9px] px-3 py-1 rounded font-bold"
                    onClick={handleConnectWifi}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
