"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import styles from "./FlxOSSimulator.module.css";

// App definitions
interface AppInfo {
  id: string;
  name: string;
  icon: string; // Emoji or SVG path
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
  { id: "files", name: "Files Manager", icon: "📁" },
  { id: "editor", name: "Text Editor", icon: "📝" },
  { id: "terminal", name: "Terminal CLI", icon: "⚡" },
  { id: "telemetry", name: "System Info", icon: "📊" },
  { id: "calc", name: "Calculator", icon: "🧮" },
  { id: "calendar", name: "Calendar", icon: "📅" },
  { id: "settings", name: "Settings", icon: "⚙️" },
];

const INITIAL_LOGS = [
  "Initializing FlxOS v1.0.0...",
  "CPU: ESP32-S3 (XTensa LX7 dual core, 240MHz)",
  "Memory: 512KB SRAM, 8MB PSRAM initialized",
  "Flash: 16MB SPI Flash (QIO 120MHz) detected",
  "HAL: Display driver LovyanGFX registered (480x320)",
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

export default function FlxOSSimulator() {
  // General simulator states
  const [booting, setBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [focusedApp, setFocusedApp] = useState<string | null>(null);
  
  // Status Bar & Settings states
  const [systemTime, setSystemTime] = useState("");
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [wifiConnected, setWifiConnected] = useState(true);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiError, setWifiError] = useState("");
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(60);
  const [systemTheme, setSystemTheme] = useState<"material-light" | "hyprland-dark" | "retro-amber">("hyprland-dark");
  const [layoutMode, setLayoutMode] = useState<"tiling" | "floating">("tiling");
  
  // Shell overlays
  const [showLauncher, setShowLauncher] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; text: string; time: string }>>([
    { id: 1, text: "System booted successfully.", time: "Just now" },
    { id: 2, text: "WiFi connected to 'FlxOS_Labs_IoT'.", time: "Just now" }
  ]);

  // Floating windows coordinates
  const [windowCoords, setWindowCoords] = useState<Record<string, WindowData>>({});
  
  // Virtual Filesystem State
  const [fileSystem, setFileSystem] = useState<Record<string, string>>({
    "/flash/welcome.txt": "Welcome to FlxOS!\n\nThis is a modular, profile-driven operating system designed for ESP32 and desktop platforms. Double-click files to open them or use the Terminal command line.",
    "/flash/system.cfg": "{\n  \"version\": \"1.0.0\",\n  \"profile\": \"esp32s3-ili9341-xpt\",\n  \"theme\": \"hyprland-dark\",\n  \"wifi_enabled\": true,\n  \"brightness\": 85\n}",
    "/flash/readme.md": "### Features:\n- EventBus\n- Window Manager (Dwindle)\n- App Framework\n- Services orchestration\n- LovyanGFX drivers",
    "/sdcard/todo.txt": "- Implement hardware watchdog\n- Add ESP-NOW mesh router\n- Optimise LovyanGFX DMA queue\n- Prepare for release",
  });
  const [currentDir, setCurrentDir] = useState<"/flash" | "/sdcard">("/flash");
  
  // App specific states
  // Files App
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  // Editor App
  const [editorFilePath, setEditorFilePath] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  
  // Terminal App
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "FlxOS Kernel Shell v1.0.0",
    "Type 'help' for a list of available commands.",
    ""
  ]);
  const termEndRef = useRef<HTMLDivElement>(null);
  
  // Telemetry App
  const [cpuUsage, setCpuUsage] = useState({ core0: 12, core1: 18 });
  const [ramUsage, setRamUsage] = useState(196); // in KB
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[0.000] EventBus: Init",
    "[0.045] LVGL: Started main tick loop",
  ]);

  // Calculator App
  const [calcInput, setCalcInput] = useState("0");
  
  // Calendar App
  const [selectedDay, setSelectedDay] = useState(13);
  const [calendarEvents, setCalendarEvents] = useState<Record<number, string[]>>({
    13: ["OS Demo launch", "Pair programming session"],
    15: ["FlxOS Community Call @ 18:00 UTC"],
    20: ["ESP-IDF v6.0.2 Merge Deadline"],
    24: ["Hardware test session: LilyGo T-HMI"],
  });
  const [newEventText, setNewEventText] = useState("");

  // Refs for dragging
  const dragStartPos = useRef({ x: 0, y: 0 });
  const activeDragWindow = useRef<string | null>(null);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      const secs = String(d.getSeconds()).padStart(2, "0");
      setSystemTime(`${hrs}:${mins}:${secs}`);
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
        // Add a slight delay before finishing boot
        setTimeout(() => {
          setBooting(false);
          // Auto-open Terminal and Telemetry as default dwindle showcase
          setOpenApps(["terminal", "telemetry"]);
          setFocusedApp("terminal");
        }, 600);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [booting]);

  // Simulated Telemetry updates (CPU, RAM, Kernel logs)
  useEffect(() => {
    if (booting) return;
    const interval = setInterval(() => {
      setCpuUsage({
        core0: Math.floor(Math.random() * 45) + 5,
        core1: Math.floor(Math.random() * 35) + 5,
      });
      setRamUsage((prev) => {
        const offset = Math.floor(Math.random() * 9) - 4;
        const next = prev + offset;
        return next > 320 ? 320 : next < 120 ? 120 : next;
      });

      // Random logs
      const possibleLogs = [
        "LVGL: Render loop completed in 14ms",
        "EventBus: Dispatching WiFiBeaconEvent",
        "LovyanGFX: DMA write transaction complete",
        "Kernel: CPU core frequency scaled to 240MHz",
        "TaskScheduler: Running idle service checks",
        "HAL: Touch gesture detected (Slide Down)",
        "Preferences: Synced configuration cache to NVS",
        "Diagnostics: Internal memory heap fragmentation is 4.2%"
      ];
      const log = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
      const timestamp = (performance.now() / 1000).toFixed(3);
      setTelemetryLogs((prev) => [...prev.slice(-30), `[${timestamp}] ${log}`]);
    }, 2000);

    return () => clearInterval(interval);
  }, [booting]);

  // Scroll terminal to bottom
  useEffect(() => {
    if (termEndRef.current) {
      termEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory]);

  // Open an App
  const openApp = (appId: string) => {
    setShowLauncher(false);
    if (openApps.includes(appId)) {
      setFocusedApp(appId);
      return;
    }

    setOpenApps((prev) => [...prev, appId]);
    setFocusedApp(appId);

    // Initialize window coordinates if in floating mode
    if (!windowCoords[appId]) {
      const idx = openApps.length;
      setWindowCoords((prev) => ({
        ...prev,
        [appId]: {
          id: appId,
          x: 20 + idx * 15,
          y: 35 + idx * 15,
          width: 320,
          height: 220,
          isMaximized: false,
        },
      }));
    }

    // Add log
    const timestamp = (performance.now() / 1000).toFixed(3);
    setTelemetryLogs((prev) => [...prev, `[${timestamp}] EventBus: Open App (${appId})`]);
  };

  // Close an App
  const closeApp = (appId: string) => {
    setOpenApps((prev) => prev.filter((id) => id !== appId));
    if (focusedApp === appId) {
      const remaining = openApps.filter((id) => id !== appId);
      setFocusedApp(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
    if (appId === "editor") {
      setKeyboardOpen(false);
    }
  };

  // Layout calculations for Dwindle Tiling layout
  // Returns bounding rect (percentage coordinates) for each index in the list
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

  const dwindleRects = getDwindleRects(openApps.length);

  // Floating windows drag event handlers
  const handleDragStart = (e: MouseEvent<HTMLDivElement>, appId: string) => {
    if (layoutMode === "tiling") return;
    setFocusedApp(appId);
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
      
      // Clamp coordinates to screen bounds (approximate)
      const clampedX = Math.max(-50, Math.min(600, newX));
      const clampedY = Math.max(28, Math.min(350, newY));

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

  // Toggle maximize
  const toggleMaximize = (appId: string) => {
    setWindowCoords((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isMaximized: !prev[appId]?.isMaximized,
      },
    }));
  };

  // Simulator Wifi connecting simulation
  const handleConnectWifi = () => {
    setWifiError("");
    if (!wifiPassword) {
      setWifiError("Password cannot be empty.");
      return;
    }
    
    // Simulate latency
    setTimeout(() => {
      setWifiConnected(true);
      setShowWifiModal(false);
      setWifiPassword("");
      
      const newNotif = {
        id: Date.now(),
        text: "Connected to WiFi successfully.",
        time: "Just now"
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }, 1000);
  };

  // Simulated Terminal Commands Parser
  const runTerminalCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;
    
    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    setTerminalHistory((prev) => [...prev, `flxos ~ $ ${trimmed}`]);

    let response: string[] = [];

    switch (cmd) {
      case "help":
        response = [
          "Available commands:",
          "  help           - Show this help listing",
          "  ls             - List files in current directory",
          "  cat <file>     - Print content of a file",
          "  write <f> <c>  - Write text content to file",
          "  rm <file>      - Delete a file",
          "  neofetch       - Display system specifications",
          "  wifi           - Check wifi connection status",
          "  reboot         - Reboot the FlxOS system",
          "  clear          - Clear terminal buffer"
        ];
        break;
      case "ls":
        const files = Object.keys(fileSystem).filter((p) => p.startsWith(currentDir));
        response = files.map((p) => p.replace(currentDir + "/", ""));
        if (response.length === 0) response = ["Directory empty."];
        break;
      case "cat":
        if (args.length === 0) {
          response = ["Error: Please specify file name."];
        } else {
          const path = `${currentDir}/${args[0]}`;
          if (fileSystem[path] !== undefined) {
            response = fileSystem[path].split("\n");
          } else {
            response = [`Error: File '${args[0]}' not found.`];
          }
        }
        break;
      case "write":
        if (args.length < 2) {
          response = ["Usage: write <filename> <content>"];
        } else {
          const filename = args[0];
          const content = args.slice(1).join(" ");
          const path = `${currentDir}/${filename}`;
          setFileSystem((prev) => ({ ...prev, [path]: content }));
          response = [`Success: Wrote to file ${path}`];
        }
        break;
      case "rm":
        if (args.length === 0) {
          response = ["Error: Specify file to delete."];
        } else {
          const path = `${currentDir}/${args[0]}`;
          if (fileSystem[path] !== undefined) {
            setFileSystem((prev) => {
              const copy = { ...prev };
              delete copy[path];
              return copy;
            });
            response = [`File '${args[0]}' removed successfully.`];
          } else {
            response = [`Error: File '${args[0]}' not found.`];
          }
        }
        break;
      case "neofetch":
        response = [
          "  ██████╗ ██╗     ██╗  ██╗ ██████╗ ███████╗",
          "  ██╔═══██╗██║     ╚██╗██╔╝██╔═══██╗██╔════╝",
          "  ██║   ██║██║      ╚███╔╝ ██║   ██║███████╗",
          "  ██║   ██║██║      ██╔██╗ ██║   ██║╚════██║",
          "  ╚██████╔╝███████╗██╔╝ ██╗╚██████╔╝███████║",
          "   ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝",
          "--------------------------------------------",
          "OS: FlxOS v1.0.0",
          "Host: ESP32-S3 custom board",
          "Kernel: flx-daemon-v6.0.2",
          "Uptime: " + Math.floor(performance.now() / 1000) + " seconds",
          "Shell: EventBus Prompt V1",
          "Theme: Hyprland Dark (LVGL custom skin)",
          "Resolution: LovyanGFX 480x320",
          "Memory: 196KB / 512KB SRAM",
          "PSRAM: 1.2MB / 8.0MB PSRAM"
        ];
        break;
      case "wifi":
        response = [
          "WiFi Module Status: " + (wifiEnabled ? "ENABLED" : "DISABLED"),
          "Link Status: " + (wifiConnected ? "CONNECTED" : "DISCONNECTED"),
          "Active SSID: " + (wifiConnected ? "FlxOS_Labs_IoT" : "N/A"),
          "Signal: -64dBm (Excellent)"
        ];
        break;
      case "reboot":
        setBooting(true);
        setOpenApps([]);
        return;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        response = [`Command not found: '${cmd}'. Type 'help' for instructions.`];
        break;
    }

    setTerminalHistory((prev) => [...prev, ...response, ""]);
    setTerminalInput("");
  };

  // Simulated Calculator Action
  const handleCalcClick = (val: string) => {
    if (val === "C") {
      setCalcInput("0");
    } else if (val === "=") {
      try {
        // Safe evaluation for simple calculations (avoid eval for safety)
        const sanitized = calcInput.replace(/×/g, "*").replace(/÷/g, "/");
        // Simple parser
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

  // Calendar Event Add
  const handleAddCalendarEvent = () => {
    if (!newEventText.trim()) return;
    setCalendarEvents((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newEventText.trim()],
    }));
    setNewEventText("");
  };

  // Keyboard character click
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

  // Save text editor contents
  const saveEditorFile = () => {
    if (editorFilePath) {
      setFileSystem((prev) => ({
        ...prev,
        [editorFilePath]: editorContent,
      }));
      setNotifications((prev) => [
        { id: Date.now(), text: `Saved file: ${editorFilePath.split("/").pop()}`, time: "Just now" },
        ...prev
      ]);
    }
  };

  // Open file in Editor
  const openFileInEditor = (path: string) => {
    setEditorFilePath(path);
    setEditorContent(fileSystem[path]);
    openApp("editor");
  };

  return (
    <div className={styles.container}>
      {/* Outer physical hardware device mockup */}
      <div className={styles.deviceFrame}>
        <div className={`${styles.led} ${booting ? styles.ledBooting : ""}`} />
        
        {/* Device screen area */}
        <div 
          className={`${styles.screen} ${systemTheme === "retro-amber" ? styles.retroTheme : ""}`}
          style={{ 
            aspectRatio: "4/3",
            filter: `brightness(${50 + brightness * 0.5}%)`
          }}
        >
          {/* CRT scanline filters */}
          {systemTheme === "retro-amber" && <div className={styles.crtOverlay} />}

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
            /* DESKTOP OS INTERFACE */
            <div 
              className={styles.desktop}
              style={{
                backgroundImage: systemTheme === "retro-amber" 
                  ? "radial-gradient(#201505 20%, transparent 20%), radial-gradient(#201505 20%, transparent 20%)" 
                  : systemTheme === "material-light"
                    ? "linear-gradient(135deg, #f3ede2 0%, #e2d7c5 100%)"
                    : "linear-gradient(135deg, #1b1e2a 0%, #0d0f17 100%)",
                backgroundSize: systemTheme === "retro-amber" ? "20px 20px" : "cover",
                backgroundPosition: systemTheme === "retro-amber" ? "0 0, 10px 10px" : "center",
              }}
            >
              {/* TOP STATUS BAR */}
              <div 
                className={styles.statusBar}
                onClick={() => setShowQuickSettings(!showQuickSettings)}
              >
                <div className={styles.statusBarItem}>
                  <span className="font-extrabold font-display tracking-wider text-[color:var(--accent)]">FlxOS</span>
                  {focusedApp && (
                    <span className="text-[10px] text-gray-400 border-l border-gray-700 pl-2">
                      {APPS.find(a => a.id === focusedApp)?.name}
                    </span>
                  )}
                </div>
                
                <div className={styles.statusBarItem}>
                  {layoutMode === "tiling" ? "📐 Tiling" : "🎏 Float"}
                  <span className="opacity-40">|</span>
                  {wifiConnected ? "📶" : "❌📶"}
                  <span className="opacity-40">|</span>
                  🔋 94%
                  <span className="opacity-40">|</span>
                  <span className="font-mono">{systemTime}</span>
                </div>
              </div>

              {/* QUICK SETTINGS PANEL */}
              {showQuickSettings && (
                <div className={styles.quickSettings}>
                  <div className={styles.quickSettingsGrid}>
                    <button 
                      className={`${styles.qsButton} ${wifiConnected ? styles.qsButtonActive : ""}`}
                      onClick={() => {
                        if (wifiConnected) {
                          setWifiConnected(false);
                        } else {
                          setShowWifiModal(true);
                        }
                      }}
                    >
                      <span>{wifiConnected ? "📶 On" : "📶 Off"}</span>
                      <span>WiFi</span>
                    </button>
                    
                    <button 
                      className={`${styles.qsButton} ${layoutMode === "tiling" ? styles.qsButtonActive : ""}`}
                      onClick={() => setLayoutMode(layoutMode === "tiling" ? "floating" : "tiling")}
                    >
                      <span>📐 Layout</span>
                      <span>{layoutMode === "tiling" ? "Tiling" : "Floating"}</span>
                    </button>

                    <button 
                      className={`${styles.qsButton} ${systemTheme === "retro-amber" ? styles.qsButtonActive : ""}`}
                      onClick={() => {
                        const themes: Array<"material-light" | "hyprland-dark" | "retro-amber"> = ["material-light", "hyprland-dark", "retro-amber"];
                        const nextIdx = (themes.indexOf(systemTheme) + 1) % themes.length;
                        setSystemTheme(themes[nextIdx]);
                      }}
                    >
                      <span>🎨 Theme</span>
                      <span>
                        {systemTheme === "material-light" && "Light"}
                        {systemTheme === "hyprland-dark" && "Dark"}
                        {systemTheme === "retro-amber" && "Amber"}
                      </span>
                    </button>
                  </div>

                  <div className={styles.qsSliderRow}>
                    <span>☀️</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className={styles.qsSlider}
                    />
                    <span className="font-mono text-[9px] w-6">{brightness}%</span>
                  </div>

                  <div className={styles.qsSliderRow}>
                    <span>🔊</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className={styles.qsSlider}
                    />
                    <span className="font-mono text-[9px] w-6">{volume}%</span>
                  </div>

                  {/* Notification List */}
                  <div className={styles.notificationsList}>
                    <p className="text-[9px] text-gray-500 font-bold mb-1.5 uppercase tracking-wide">Notifications</p>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-[10px] italic">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={styles.notificationItem}>
                          <span>{n.text}</span>
                          <span className="text-[8px] opacity-50">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* WINDOW MANAGER WORKSPACE */}
              <div 
                className={styles.workspace}
                onClick={() => {
                  setShowQuickSettings(false);
                  setShowLauncher(false);
                }}
              >
                {openApps.map((appId, idx) => {
                  const app = APPS.find((a) => a.id === appId);
                  if (!app) return null;
                  
                  const isActive = focusedApp === appId;
                  const coords = windowCoords[appId] || { x: 30, y: 40, width: 320, height: 220, isMaximized: false };
                  
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
                        setFocusedApp(appId);
                      }}
                    >
                      {/* Window Header */}
                      <div 
                        className={styles.windowHeader}
                        onMouseDown={(e) => handleDragStart(e, appId)}
                      >
                        <div className={styles.windowTitle}>
                          <span>{app.icon}</span>
                          <span>{app.name}</span>
                        </div>
                        <div className={styles.windowControls}>
                          <button 
                            className={`${styles.windowBtn} ${styles.winMin}`}
                            onClick={(e) => { e.stopPropagation(); closeApp(appId); }}
                            title="Close"
                          />
                          {layoutMode === "floating" && (
                            <button 
                              className={`${styles.windowBtn} ${styles.winMax}`}
                              onClick={(e) => { e.stopPropagation(); toggleMaximize(appId); }}
                              title="Maximize"
                            />
                          )}
                          <button 
                            className={`${styles.windowBtn} ${styles.winClose}`}
                            onClick={(e) => { e.stopPropagation(); closeApp(appId); }}
                            title="Close"
                          />
                        </div>
                      </div>

                      {/* Window Body */}
                      <div className={styles.windowBody}>
                        {/* APP RENDER SWITCH */}
                        <div className={styles.appContent}>
                          {appId === "telemetry" && (
                            /* TELEMETRY DIAGNOSTICS */
                            <div className={styles.telemetryApp}>
                              <div className={styles.telGrid}>
                                <div className={styles.telStatCard}>
                                  <div className="text-[9px] text-gray-400">CPU Core 0</div>
                                  <div className={styles.telValue}>{cpuUsage.core0}%</div>
                                  <div className={styles.telProgressBg}>
                                    <div className={styles.telProgressBar} style={{ width: `${cpuUsage.core0}%` }} />
                                  </div>
                                </div>
                                <div className={styles.telStatCard}>
                                  <div className="text-[9px] text-gray-400">CPU Core 1</div>
                                  <div className={styles.telValue}>{cpuUsage.core1}%</div>
                                  <div className={styles.telProgressBg}>
                                    <div className={styles.telProgressBar} style={{ width: `${cpuUsage.core1}%` }} />
                                  </div>
                                </div>
                              </div>
                              
                              <div className={styles.telGrid}>
                                <div className={styles.telStatCard}>
                                  <div className="text-[9px] text-gray-400">RAM Heap Available</div>
                                  <div className={styles.telValue}>{ramUsage}KB / 512KB</div>
                                  <div className={styles.telProgressBg}>
                                    <div className={styles.telProgressBar} style={{ width: `${(ramUsage/512)*100}%`, background: "var(--accent-2)" }} />
                                  </div>
                                </div>
                                <div className={styles.telStatCard}>
                                  <div className="text-[9px] text-gray-400">Uptime</div>
                                  <div className="font-mono text-[11px] font-bold mt-1 text-[color:var(--accent-3)]">
                                    {(performance.now() / 1000).toFixed(1)}s
                                  </div>
                                </div>
                              </div>

                              <p className="text-[9px] text-gray-400 font-bold mb-1 mt-2 uppercase">Kernel LogStream</p>
                              <div className={styles.telLogsContainer}>
                                {telemetryLogs.map((log, lIdx) => (
                                  <div key={lIdx}>{log}</div>
                                ))}
                              </div>
                            </div>
                          )}

                          {appId === "files" && (
                            /* FILES MANAGER */
                            <div className={styles.filesApp}>
                              <div className={styles.filesSidebar}>
                                <div 
                                  className={`${styles.filesSidebarItem} ${currentDir === "/flash" ? styles.filesSidebarActive : ""}`}
                                  onClick={() => { setCurrentDir("/flash"); setSelectedFile(null); }}
                                >
                                  ⚡ /flash
                                </div>
                                <div 
                                  className={`${styles.filesSidebarItem} ${currentDir === "/sdcard" ? styles.filesSidebarActive : ""}`}
                                  onClick={() => { setCurrentDir("/sdcard"); setSelectedFile(null); }}
                                >
                                  💾 /sd
                                </div>
                              </div>
                              <div className={styles.filesContent}>
                                <div className={styles.filesGrid}>
                                  {Object.keys(fileSystem)
                                    .filter((p) => p.startsWith(currentDir))
                                    .map((path) => {
                                      const filename = path.replace(currentDir + "/", "");
                                      const isTxt = filename.endsWith(".txt") || filename.endsWith(".cfg") || filename.endsWith(".md");
                                      const icon = isTxt ? "📄" : "🖼️";
                                      const isSelected = selectedFile === path;
                                      
                                      return (
                                        <div
                                          key={path}
                                          className={`${styles.fileItem} ${isSelected ? "bg-[rgba(255,255,255,0.08)] text-white" : ""}`}
                                          onClick={() => setSelectedFile(path)}
                                          onDoubleClick={() => {
                                            if (isTxt) {
                                              openFileInEditor(path);
                                            } else {
                                              // Show mock photo
                                              alert(`Image viewer: Rendering raster bitmap ${filename}`);
                                            }
                                          }}
                                        >
                                          <span className="text-2xl">{icon}</span>
                                          <span className={styles.fileLabel}>{filename}</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}

                          {appId === "editor" && (
                            /* TEXT EDITOR */
                            <div className={styles.editorApp}>
                              <div className={styles.editorToolbar}>
                                <span className="text-[9px] text-gray-400 truncate max-w-[150px]">
                                  {editorFilePath ? editorFilePath.split("/").pop() : "Untitled.txt"}
                                </span>
                                <div className="flex gap-2">
                                  <button 
                                    className="bg-gray-800 hover:bg-gray-700 px-2 py-0.5 rounded text-[9px]"
                                    onClick={() => setKeyboardOpen(!keyboardOpen)}
                                  >
                                    ⌨️ Keyboard
                                  </button>
                                  <button 
                                    className="bg-[color:var(--accent)] hover:opacity-90 px-2.5 py-0.5 rounded text-[9px] text-white font-bold"
                                    onClick={saveEditorFile}
                                  >
                                    💾 Save
                                  </button>
                                </div>
                              </div>
                              <textarea
                                className={styles.editorInput}
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
                                placeholder="Start typing... Use physical or virtual keyboard."
                                onFocus={() => setKeyboardOpen(true)}
                              />
                            </div>
                          )}

                          {appId === "terminal" && (
                            /* TERMINAL CLI */
                            <div 
                              className={styles.terminalApp}
                              onClick={() => {
                                // Auto focus input
                                const inputEl = document.getElementById("simulator-terminal-input");
                                if (inputEl) inputEl.focus();
                              }}
                            >
                              {terminalHistory.map((line, lIdx) => (
                                <div key={lIdx} className={styles.termLine}>{line}</div>
                              ))}
                              <div className={styles.termPromptRow}>
                                <span className={styles.termPrompt}>flxos ~ $</span>
                                <input
                                  id="simulator-terminal-input"
                                  type="text"
                                  className={styles.termInput}
                                  value={terminalInput}
                                  onChange={(e) => setTerminalInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      runTerminalCommand(terminalInput);
                                    }
                                  }}
                                  autoFocus
                                  autoComplete="off"
                                />
                              </div>
                              <div ref={termEndRef} />
                            </div>
                          )}

                          {appId === "calc" && (
                            /* CALCULATOR */
                            <div className={styles.calcApp}>
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

                          {appId === "calendar" && (
                            /* CALENDAR */
                            <div className={styles.calendarApp}>
                              <div className={styles.calHeader}>
                                <span>July 2026</span>
                                <span className="text-[10px] text-gray-400">Current Time</span>
                              </div>
                              <div className={styles.calGrid}>
                                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                  <div key={i} className={styles.calDayLabel}>{d}</div>
                                ))}
                                {/* Shift July 2026 starts on Wednesday (3 empty spots) */}
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: 31 }).map((_, i) => {
                                  const day = i + 1;
                                  const isActive = day === selectedDay;
                                  const hasEvents = calendarEvents[day] && calendarEvents[day].length > 0;
                                  return (
                                    <div
                                      key={day}
                                      className={`${styles.calDayCell} ${isActive ? styles.calDayActive : ""} ${hasEvents ? styles.calDayHasEvent : ""}`}
                                      onClick={() => setSelectedDay(day)}
                                    >
                                      {day}
                                    </div>
                                  );
                                })}
                              </div>

                              <div className={styles.calEventPanel}>
                                <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">
                                  Events for July {selectedDay}
                                </p>
                                {(calendarEvents[selectedDay] || []).length === 0 ? (
                                  <p className="text-gray-500 italic text-[10px]">No events scheduled.</p>
                                ) : (
                                  <ul className="list-disc pl-4 space-y-0.5">
                                    {(calendarEvents[selectedDay] || []).map((e, idx) => (
                                      <li key={idx} className="text-gray-200">{e}</li>
                                    ))}
                                  </ul>
                                )}
                                <div className="mt-2 flex gap-1">
                                  <input 
                                    type="text" 
                                    placeholder="New event..."
                                    className="bg-gray-800 border border-gray-700 px-2 py-0.5 rounded text-[9px] flex-1 text-white"
                                    value={newEventText}
                                    onChange={(e) => setNewEventText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleAddCalendarEvent();
                                    }}
                                  />
                                  <button 
                                    className="bg-[color:var(--accent)] text-white px-2 py-0.5 rounded text-[9px] font-bold"
                                    onClick={handleAddCalendarEvent}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {appId === "settings" && (
                            /* SETTINGS PANEL */
                            <div className={styles.settingsApp}>
                              <div className={styles.settingsSection}>
                                <div className={styles.settingsTitle}>Network Config</div>
                                <div className={styles.settingsRow}>
                                  <span>Enable Wi-Fi</span>
                                  <input 
                                    type="checkbox" 
                                    checked={wifiEnabled}
                                    onChange={(e) => {
                                      setWifiEnabled(e.target.checked);
                                      if (!e.target.checked) setWifiConnected(false);
                                    }}
                                  />
                                </div>
                                {wifiEnabled && (
                                  <div className={styles.settingsRow}>
                                    <span>Status</span>
                                    <span className="font-bold">
                                      {wifiConnected ? (
                                        <span className="text-[color:var(--accent-2)]">Connected</span>
                                      ) : (
                                        <button 
                                          className="text-[color:var(--accent)] text-[10px] hover:underline"
                                          onClick={() => setShowWifiModal(true)}
                                        >
                                          Connect
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className={styles.settingsSection}>
                                <div className={styles.settingsTitle}>Device Hardware</div>
                                <div className={styles.settingsRow}>
                                  <span>Display Driver</span>
                                  <span className="font-mono text-gray-400">LovyanGFX_ILI9341</span>
                                </div>
                                <div className={styles.settingsRow}>
                                  <span>Target Profile</span>
                                  <span className="font-mono text-gray-400">esp32s3-t-hmi</span>
                                </div>
                                <div className={styles.settingsRow}>
                                  <span>CPU Frequency</span>
                                  <span className="font-mono text-gray-400">240 MHz (Dual Core)</span>
                                </div>
                              </div>

                              <div className={styles.settingsSection}>
                                <div className={styles.settingsTitle}>System Control</div>
                                <button 
                                  className="w-full bg-red-600/35 hover:bg-red-600/50 border border-red-500/30 text-red-200 text-[10px] font-bold py-1 px-2 rounded"
                                  onClick={() => {
                                    setBooting(true);
                                    setOpenApps([]);
                                  }}
                                >
                                  🔴 Reset / Factory Reboot
                                </button>
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
                  {["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "Enter"].map((k) => (
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
                  {["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Space"].map((k) => (
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

              {/* APP LAUNCHER PANEL */}
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
                        <div className={styles.launcherIcon}>{app.icon}</div>
                        <span className={styles.launcherLabel}>{app.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOTTOM APP DOCK */}
              <div className={styles.dock}>
                <div 
                  className={styles.dockItem} 
                  onClick={() => setShowLauncher(!showLauncher)}
                  title="Applications"
                >
                  ⚡
                </div>
                <div className="w-[1px] h-6 bg-gray-800" />
                {APPS.slice(0, 5).map((app) => {
                  const isOpen = openApps.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      className={`${styles.dockItem} ${isOpen ? styles.dockItemActive : ""}`}
                      onClick={() => openApp(app.id)}
                      title={app.name}
                    >
                      {app.icon}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WIFI CONNECTION PROMPT MODAL */}
          {showWifiModal && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-6 z-[300]">
              <div className="bg-[#14161f] border border-gray-800 rounded-xl p-4 w-full max-w-[280px] space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  📶 Connect to WiFi
                </h4>
                <div>
                  <p className="text-[9px] text-gray-500 mb-1">Select Network</p>
                  <select className="w-full bg-[#1b1e28] border border-gray-800 rounded p-1 text-[10px] text-white">
                    <option>FlxOS_Labs_IoT (Secured)</option>
                    <option>LilyGo_AP (Open)</option>
                    <option>ESP32_Broadcast (Secured)</option>
                  </select>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 mb-1">WPA2/WPA3 Password</p>
                  <input
                    type="password"
                    placeholder="Enter password..."
                    className="w-full bg-[#1b1e28] border border-gray-800 rounded p-1 text-[10px] text-white"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                  {wifiError && <p className="text-[8px] text-red-400 mt-1">{wifiError}</p>}
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] px-2 py-1 rounded"
                    onClick={() => {
                      setShowWifiModal(false);
                      setWifiPassword("");
                      setWifiError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[color:var(--accent)] text-white text-[10px] px-3 py-1 rounded font-bold"
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
