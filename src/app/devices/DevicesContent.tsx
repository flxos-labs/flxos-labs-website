"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { lockScroll, unlockScroll } from "../../lib/scrollLock";
import styles from "./DevicesContent.module.css";

interface Release {
  profile: string;
  target: string;
  version: string;
  name: string;
  manifest: string;
  tags: string[];
  incubating: boolean;
  warning_message: string | null;
}

const MOCK_RELEASES: Release[] = [
  {
    profile: "generic-esp32s3",
    target: "esp32s3",
    version: "0.1.0",
    name: "FlxOS for Generic ESP32-S3 (Headless)",
    manifest: "flxos-generic-esp32s3-v0.1.0-cdn/manifest.json",
    tags: ["headless"],
    incubating: false,
    warning_message: null
  },
  {
    profile: "lilygo-t-hmi",
    target: "esp32s3",
    version: "0.1.0",
    name: "FlxOS for LilyGO T-HMI",
    manifest: "flxos-lilygo-t-hmi-v0.1.0-cdn/manifest.json",
    tags: ["tested"],
    incubating: false,
    warning_message: null
  }
];

const TESTED_DEVICES = ["esp32s3-ili9341-xpt", "lilygo-t-hmi"];

interface Device {
  id: string;
  vendor: string;
  name: string;
  target: string;
  flash: string;
  spiram: string;
  display: string;
  touch: string;
  storage: string;
  status: "stable" | "incubating";
  tags: string[];
  notes: string;
}

const DEVICES_DATA: Device[] = [
  {
    id: "btt-panda-touch",
    vendor: "BigTreeTech",
    name: "Panda Touch / K Touch",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OCT (120M)",
    display: "5.0\" RGB 800x480",
    touch: "GT911 (I2C)",
    storage: "None",
    status: "stable",
    tags: ["RGB", "Touch", "USB Host"],
    notes: "USB Host enabled for direct 3D printer controller connections."
  },
  {
    id: "cyd-2432s024c",
    vendor: "CYD",
    name: "CYD 2.4\" Capacitive (2432S024C)",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.4\" SPI ILI9341 240x320",
    touch: "CST816S (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Cheap Yellow Display"],
    notes: "Incubating status due to ongoing CST816S touch driver tuning."
  },
  {
    id: "cyd-2432s024r",
    vendor: "CYD",
    name: "CYD 2.4\" Resistive (2432S024R)",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.4\" SPI ILI9341 240x320",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Cheap Yellow Display"],
    notes: "Resistive touch screen requires manual software calibration."
  },
  {
    id: "cyd-2432s028r",
    vendor: "CYD",
    name: "CYD 2.8\" Resistive (2432S028R)",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.8\" SPI ILI9341 240x320",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Touch", "Cheap Yellow Display"],
    notes: "The classic Cheap Yellow Display. Fully verified and stable."
  },
  {
    id: "cyd-2432s028rv3",
    vendor: "CYD",
    name: "CYD 2.8\" Resistive v3 (2432S028Rv3)",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.8\" SPI ILI9341 240x320",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Cheap Yellow Display"],
    notes: "Version 3 of the 2.8\" Cheap Yellow Display featuring alternate pin mappings."
  },
  {
    id: "cyd-2432s032c",
    vendor: "CYD",
    name: "CYD 3.2\" Capacitive (2432S032C)",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "3.2\" SPI ILI9341 240x320",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Cheap Yellow Display"],
    notes: "Incubating; features GT911 touch controller sharing the main SPI sub-bus."
  },
  {
    id: "cyd-3248s035c",
    vendor: "CYD",
    name: "CYD 3.5\" Capacitive (3248S035C)",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "3.5\" SPI ST7796 320x480",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Cheap Yellow Display"],
    notes: "Incubating; high-resolution 3.5-inch panel with ST7796 controller."
  },
  {
    id: "cyd-4848s040c",
    vendor: "CYD",
    name: "CYD 4.0\" Round (4848S040C)",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OCT (80M)",
    display: "4.0\" RGB ST7701S (480x480)",
    touch: "CST816S (I2C)",
    storage: "None",
    status: "incubating",
    tags: ["RGB", "Touch", "Round Display"],
    notes: "Incubating; ST7701S hybrid driver currently has crash issues during boot."
  },
  {
    id: "cyd-8048s043c",
    vendor: "CYD",
    name: "CYD 4.3\" Widescreen (8048S043C)",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "8MB OCT (120M)",
    display: "4.3\" RGB 800x480",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["RGB", "Touch", "Cheap Yellow Display"],
    notes: "Fully supported 4.3\" RGB panel. Highly responsive and stable."
  },
  {
    id: "cyd-e32r28t",
    vendor: "CYD",
    name: "CYD E32-R28T",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.8\" SPI ILI9341 240x320",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Software SPI"],
    notes: "Touch panel operates over software-emulated SPI lines."
  },
  {
    id: "cyd-e32r32p",
    vendor: "CYD",
    name: "CYD E32-R32P",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.8\" SPI ST7789 240x320",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch"],
    notes: "Resistive touch version utilizing ST7789 display controller."
  },
  {
    id: "elecrow-crowpanel-advance-28",
    vendor: "Elecrow",
    name: "CrowPanel Advance 2.8\"",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "2.8\" SPI ST7789 240x320",
    touch: "FT5X06 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "CrowPanel"],
    notes: "Incubating; FT5X06 capacitive touch driver tuning in progress."
  },
  {
    id: "elecrow-crowpanel-basic-28",
    vendor: "Elecrow",
    name: "CrowPanel Basic 2.8\"",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.8\" SPI ILI9341 240x320",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "CrowPanel"],
    notes: "Incubating; basic board with ILI9341 display and resistive touch."
  },
  {
    id: "elecrow-crowpanel-advance-35",
    vendor: "Elecrow",
    name: "CrowPanel Advance 3.5\"",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "3.5\" SPI ILI9488 320x480",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "CrowPanel"],
    notes: "Incubating; ILI9488 SPI layout with GT911 capacitive touch."
  },
  {
    id: "elecrow-crowpanel-advance-50",
    vendor: "Elecrow",
    name: "CrowPanel Advance 5.0\"",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OCT (120M)",
    display: "5.0\" RGB 800x480",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["RGB", "Touch", "CrowPanel"],
    notes: "Large 5-inch RGB screen, highly responsive capacitive touch."
  },
  {
    id: "elecrow-crowpanel-basic-35",
    vendor: "Elecrow",
    name: "CrowPanel Basic 3.5\"",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "3.5\" SPI ILI9488 320x480",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Touch", "CrowPanel"],
    notes: "Stable basic 3.5-inch target; fully verified and compatible."
  },
  {
    id: "elecrow-crowpanel-basic-50",
    vendor: "Elecrow",
    name: "CrowPanel Basic 5.0\"",
    target: "ESP32-S3",
    flash: "4MB",
    spiram: "8MB OCT (120M)",
    display: "5.0\" RGB 800x480",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["RGB", "Touch", "CrowPanel"],
    notes: "Budget 5-inch S3 model with RGB display and GT911 capacitive touch."
  },
  {
    id: "guition-jc2432w328c",
    vendor: "Guition",
    name: "Guition JC2432W328C",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "2.8\" SPI ST7789 240x320",
    touch: "CST816S (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch"],
    notes: "Capacitive touch CST816S target with ST7789 display panel."
  },
  {
    id: "guition-jc3248w535c",
    vendor: "Guition",
    name: "Guition JC3248W535C",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OCT (120M)",
    display: "3.5\" QSPI AXS15231B 320x480",
    touch: "AXS15231B (I2C)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["QSPI", "Touch", "Audio"],
    notes: "Features AXS15231B display and touch controller with stereo audio output."
  },
  {
    id: "guition-jc8048w550c",
    vendor: "Guition",
    name: "Guition JC8048W550C",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OCT (120M)",
    display: "5.5\" RGB 800x480",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["RGB", "Touch"],
    notes: "Wide 5.5-inch high-contrast display with GT911 touch."
  },
  {
    id: "guition-jc1060p470ciwy",
    vendor: "Guition",
    name: "Guition JC1060P470C-I-W-Y",
    target: "ESP32-P4",
    flash: "16MB",
    spiram: "16MB OCT (200M)",
    display: "7.0\" MIPI DSI JD9165 1024x600",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SDMMC)",
    status: "stable",
    tags: ["MIPI DSI", "Touch", "ESP32-P4", "Battery"],
    notes: "High performance ESP32-P4 device with 7-inch MIPI screen and battery ADC monitor."
  },
  {
    id: "heltec-wifi-lora-32-v3",
    vendor: "Heltec",
    name: "WiFi LoRa 32 v3",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "None",
    display: "0.96\" I2C SSD1306 128x64",
    touch: "None",
    storage: "Internal Only",
    status: "incubating",
    tags: ["OLED", "LoRa", "Mono"],
    notes: "Ultra-small SSD1306 screen. Recommended to run Mono theme due to layout constraints."
  },
  {
    id: "lilygo-tdeck",
    vendor: "LilyGO",
    name: "T-Deck",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "2.8\" SPI ST7789 320x240",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Keyboard", "LoRa"],
    notes: "Incubating; includes full keyboard, trackball, and LoRa capabilities."
  },
  {
    id: "lilygo-tdisplay",
    vendor: "LilyGO",
    name: "T-Display",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "1.14\" SPI ST7789 135x240",
    touch: "None",
    storage: "Internal Only",
    status: "incubating",
    tags: ["SPI", "Mini Screen"],
    notes: "Compact board without touch capability. Uses buttons for navigation."
  },
  {
    id: "lilygo-tdisplay-s3",
    vendor: "LilyGO",
    name: "T-Display S3",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "1.9\" SPI ST7789 170x320",
    touch: "None / Capacitive",
    storage: "Internal Only",
    status: "incubating",
    tags: ["SPI", "Touch"],
    notes: "Supports touch and non-touch versions of the 1.9-inch screen."
  },
  {
    id: "lilygo-tdongle-s3",
    vendor: "LilyGO",
    name: "T-Dongle S3",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "0.96\" SPI ST7735 80x160",
    touch: "None",
    storage: "Internal Only",
    status: "incubating",
    tags: ["SPI", "USB Dongle"],
    notes: "USB dongle form-factor with tiny ST7735 screen."
  },
  {
    id: "lilygo-t-hmi",
    vendor: "LilyGO",
    name: "T-HMI",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "2.4\" SPI ST7789 240x320",
    touch: "Resistive SPI",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Touch"],
    notes: "Fully stable, widely used developer board with resistive touch."
  },
  {
    id: "lilygo-tlora-pager",
    vendor: "LilyGO",
    name: "T-Lora Pager",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (120M)",
    display: "2.33\" SPI ST7796 222x480",
    touch: "None",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Keyboard", "LoRa", "Battery Gauge"],
    notes: "Handheld device with keyboard, encoder navigation, LoRa module, and BQ27220 fuel gauge."
  },
  {
    id: "m5stack-cardputer",
    vendor: "M5Stack",
    name: "Cardputer",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "8MB (80M)",
    display: "1.14\" SPI ST7789 135x240",
    touch: "None",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Keyboard", "Mini Screen"],
    notes: "Pocket computer with built-in physical keyboard. Uses buttons/keyboard for UI controls."
  },
  {
    id: "m5stack-cardputer-adv",
    vendor: "M5Stack",
    name: "Cardputer Advanced",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "8MB (80M)",
    display: "1.14\" SPI ST7789 135x240",
    touch: "None",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Keyboard", "Mini Screen"],
    notes: "Advanced Cardputer with TCA8418 keyboard controller expansion."
  },
  {
    id: "m5stack-core2",
    vendor: "M5Stack",
    name: "M5Stack Core2",
    target: "ESP32",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "2.0\" SPI ILI9342 320x240",
    touch: "FT5X06 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Core"],
    notes: "Incubating; uses custom AXP192 PMIC for power control."
  },
  {
    id: "m5stack-cores3",
    vendor: "M5Stack",
    name: "M5Stack CoreS3",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "2.0\" SPI ILI9342 320x240",
    touch: "FT5X06 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Core"],
    notes: "Incubating; uses AXP2101 PMIC and built-in camera/audio."
  },
  {
    id: "m5stack-papers3",
    vendor: "M5Stack",
    name: "PaperS3",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OPI (80M)",
    display: "4.7\" E-Ink 540x960",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["E-Ink", "Touch", "Buzzer", "Power Control"],
    notes: "Incubating; features custom Epdiy e-ink display driver and GPIO44 power cut-off."
  },
  {
    id: "m5stack-stackchan",
    vendor: "M5Stack",
    name: "M5Stack StackChan",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "2.0\" SPI ILI9342 320x240",
    touch: "FT5X06 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch", "Robot"],
    notes: "Incubating; companion robot configuration based on CoreS3."
  },
  {
    id: "m5stack-stickc-plus2",
    vendor: "M5Stack",
    name: "M5StickC Plus2",
    target: "ESP32",
    flash: "8MB",
    spiram: "None",
    display: "1.14\" SPI ST7789 135x240",
    touch: "None",
    storage: "Internal Only",
    status: "incubating",
    tags: ["SPI", "Mini Screen"],
    notes: "Stick form-factor board. Button navigation only."
  },
  {
    id: "m5stack-sticks3",
    vendor: "M5Stack",
    name: "M5StickS3",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "8MB OCT (120M)",
    display: "1.14\" SPI ST7789 135x240",
    touch: "None",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Mini Screen"],
    notes: "ESP32-S3 version of StickC with card expansion."
  },
  {
    id: "m5stack-tab5",
    vendor: "M5Stack",
    name: "Tab5",
    target: "ESP32-P4",
    flash: "16MB",
    spiram: "16MB HEX (200M)",
    display: "5.0\" MIPI DSI ILI9881C 720x1280",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SDMMC)",
    status: "stable",
    tags: ["MIPI DSI", "Touch", "ESP32-P4", "Power Monitor"],
    notes: "High performance tablet setup featuring MIPI display, GT911 touch, and INA226 voltage/current sensing."
  },
  {
    id: "unphone",
    vendor: "unPhone",
    name: "unPhone",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "8MB OCT (80M)",
    display: "3.5\" SPI HX8357D 320x480",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Touch", "unPhone"],
    notes: "Fully stable. Supported 3.5-inch developer phone platform."
  },
  {
    id: "waveshare-esp32-s3-geek",
    vendor: "WaveShare",
    name: "ESP32-S3 Geek",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "1.14\" SPI ST7789 135x240",
    touch: "None",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Geek", "Mini Screen"],
    notes: "Compact USB developer tool with mini screen and microSD slot."
  },
  {
    id: "waveshare-s3-lcd-13",
    vendor: "WaveShare",
    name: "ESP32-S3 LCD 1.3\"",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "1.3\" SPI ST7789 240x240",
    touch: "None",
    storage: "Internal Only",
    status: "incubating",
    tags: ["SPI", "Round-ish Screen"],
    notes: "Compact screen without touch support."
  },
  {
    id: "waveshare-s3-touch-lcd-128",
    vendor: "WaveShare",
    name: "ESP32-S3 Touch LCD 1.28\"",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OCT (120M)",
    display: "1.28\" SPI GC9A01 240x240",
    touch: "CST816S (I2C)",
    storage: "Internal Only",
    status: "incubating",
    tags: ["SPI", "Touch", "Round Display"],
    notes: "Incubating; round smart-watch style display and CST816S touch controller."
  },
  {
    id: "waveshare-s3-touch-lcd-147",
    vendor: "WaveShare",
    name: "ESP32-S3 Touch LCD 1.47\"",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB OCT (120M)",
    display: "1.47\" SPI ST7789 172x320",
    touch: "AXS5106 (I2C)",
    storage: "MicroSD (SPI)",
    status: "incubating",
    tags: ["SPI", "Touch"],
    notes: "Touch controller AXS5106 is currently in incubating phase."
  },
  {
    id: "waveshare-s3-touch-lcd-43",
    vendor: "WaveShare",
    name: "ESP32-S3 Touch LCD 4.3\"",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "8MB OCT (120M)",
    display: "4.3\" RGB 800x480",
    touch: "GT911 (I2C)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["RGB", "Touch"],
    notes: "High resolution RGB 4.3-inch panel with responsive capacitive touch."
  },
  {
    id: "wireless-tag-wt32-sc01-plus",
    vendor: "Wireless-tag",
    name: "WT32-SC01 Plus",
    target: "ESP32-S3",
    flash: "16MB",
    spiram: "8MB (80M)",
    display: "3.5\" SPI ST7796 320x480",
    touch: "FT6336 (I2C)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Touch"],
    notes: "Popular 3.5-inch target with capacitive touch screen."
  },
  {
    id: "generic-esp32",
    vendor: "Generic",
    name: "ESP32 (Headless)",
    target: "ESP32",
    flash: "4MB",
    spiram: "None",
    display: "Headless (Serial Console)",
    touch: "None",
    storage: "Internal Only",
    status: "stable",
    tags: ["Headless", "CLI"],
    notes: "Headless CLI console profile for general ESP32 modules."
  },
  {
    id: "generic-esp32s3",
    vendor: "Generic",
    name: "ESP32-S3 (Headless)",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "None",
    display: "Headless (Serial Console)",
    touch: "None",
    storage: "Internal Only",
    status: "stable",
    tags: ["Headless", "CLI"],
    notes: "Headless CLI console profile for general ESP32-S3 modules."
  },
  {
    id: "generic-esp32c6",
    vendor: "Generic",
    name: "ESP32-C6 (Headless)",
    target: "ESP32-C6",
    flash: "8MB",
    spiram: "None",
    display: "Headless (Serial Console)",
    touch: "None",
    storage: "Internal Only",
    status: "stable",
    tags: ["Headless", "CLI"],
    notes: "Headless CLI console profile for general ESP32-C6 modules."
  },
  {
    id: "generic-esp32p4",
    vendor: "Generic",
    name: "ESP32-P4 (Headless)",
    target: "ESP32-P4",
    flash: "8MB",
    spiram: "None",
    display: "Headless (Serial Console)",
    touch: "None",
    storage: "Internal Only",
    status: "stable",
    tags: ["Headless", "CLI"],
    notes: "Headless CLI console profile for general ESP32-P4 modules."
  },
  {
    id: "esp32s3-ili9341-xpt",
    vendor: "Generic",
    name: "ESP32-S3 ILI9341 XPT Breakout",
    target: "ESP32-S3",
    flash: "8MB",
    spiram: "None",
    display: "3.2\" SPI ILI9341 240x320",
    touch: "XPT2046 (SPI)",
    storage: "MicroSD (SPI)",
    status: "stable",
    tags: ["SPI", "Touch"],
    notes: "Generic wiring profile for ESP32-S3 boards combined with external SPI touch screens."
  }
];

export default function DevicesContent() {
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTest, setSelectedTest] = useState("All");
  
  const [releases, setReleases] = useState<Release[]>([]);
  const [loadingReleases, setLoadingReleases] = useState(true);
  const [activeFlashRelease, setActiveFlashRelease] = useState<Release | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch("https://raw.githubusercontent.com/flxos-labs/flxos/releases/releases/index.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch index.json: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Response is not an array");
        }
        const isValid = data.every(
          (item) =>
            item &&
            typeof item === "object" &&
            typeof item.profile === "string" &&
            typeof item.name === "string" &&
            typeof item.version === "string" &&
            typeof item.manifest === "string"
        );
        if (!isValid) {
          throw new Error("Response elements are missing required fields (profile, name, version, manifest)");
        }
        setReleases(data);
        setLoadingReleases(false);
      })
      .catch((err) => {
        console.warn("Could not load releases from GitHub. Falling back to local mock data for testing:", err);
        setReleases(MOCK_RELEASES);
        setLoadingReleases(false);
      });
  }, []);

  // Prevent scroll when flashing modal is open
  useEffect(() => {
    if (activeFlashRelease) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [activeFlashRelease]);

  const vendors = useMemo(() => {
    const list = new Set(DEVICES_DATA.map((d) => d.vendor));
    return ["All", ...Array.from(list).sort()];
  }, []);

  const filteredDevices = useMemo(() => {
    return DEVICES_DATA.filter((device) => {
      const isTested = TESTED_DEVICES.includes(device.id);
      const matchesSearch =
        device.name.toLowerCase().includes(search.toLowerCase()) ||
        device.id.toLowerCase().includes(search.toLowerCase()) ||
        device.target.toLowerCase().includes(search.toLowerCase()) ||
        device.display.toLowerCase().includes(search.toLowerCase()) ||
        device.touch.toLowerCase().includes(search.toLowerCase()) ||
        device.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

      const matchesVendor = selectedVendor === "All" || device.vendor === selectedVendor;
      const matchesStatus = selectedStatus === "All" || device.status === selectedStatus;

      const matchesTest =
        selectedTest === "All" ||
        (selectedTest === "tested" && isTested) ||
        (selectedTest === "not-tested" && !isTested);

      return matchesSearch && matchesVendor && matchesStatus && matchesTest;
    });
  }, [search, selectedVendor, selectedStatus, selectedTest]);

  const countLabel = useMemo(() => {
    if (filteredDevices.length === DEVICES_DATA.length) {
      return `Showing all ${DEVICES_DATA.length} devices`;
    }
    return `Showing ${filteredDevices.length} of ${DEVICES_DATA.length} devices`;
  }, [filteredDevices]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Glow Orbs background */}
      <div className={styles.heroOrbs} aria-hidden="true">
        <span className={`${styles.orb} ${styles.orb1} opacity-30`} />
        <span className={`${styles.orb} ${styles.orb2} opacity-25`} />
        <span className={`${styles.orb} ${styles.orb3} opacity-20`} />
      </div>

      {/* ── Header Section ── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="space-y-6 text-center md:text-left">
          <nav className="flex items-center justify-center md:justify-start gap-2 text-xs text-[color:var(--muted)] font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[color:var(--ink)] transition-colors">Home</Link>
            <span>/</span>
            <span>Devices</span>
          </nav>
          <p className={styles.eyebrow}>Compatibility Hub</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-[color:var(--ink)] max-w-4xl">
            Explore supported{" "}
            <span className="bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-3)] bg-clip-text text-transparent">
              hardware profiles.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-[color:var(--muted)] leading-relaxed">
            FlxOS is profile-driven and dynamically adapts to a wide range of screens, microcontrollers, touch chips, and peripherals.
          </p>
        </div>
      </section>

      {/* ── Filters & Search ── */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_auto] items-center mb-8">
          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name, chip (e.g. S3), display driver, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Search devices"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus("All")}
              className={`${styles.tabButton} ${selectedStatus === "All" ? styles.tabButtonActive : ""}`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setSelectedStatus("stable")}
              className={`${styles.tabButton} ${selectedStatus === "stable" ? styles.tabButtonActive : ""}`}
            >
              Stable
            </button>
            <button
              onClick={() => setSelectedStatus("incubating")}
              className={`${styles.tabButton} ${selectedStatus === "incubating" ? styles.tabButtonActive : ""}`}
            >
              Incubating
            </button>
          </div>

          {/* Test Support Filter */}
          <div className="flex gap-2" role="group" aria-label="Test support filter">
            <button
              onClick={() => setSelectedTest("All")}
              aria-pressed={selectedTest === "All"}
              className={`${styles.tabButton} ${selectedTest === "All" ? styles.tabButtonActive : ""}`}
            >
              All Support
            </button>
            <button
              onClick={() => setSelectedTest("tested")}
              aria-pressed={selectedTest === "tested"}
              className={`${styles.tabButton} ${selectedTest === "tested" ? styles.tabButtonActive : ""}`}
            >
              Tested
            </button>
            <button
              onClick={() => setSelectedTest("not-tested")}
              aria-pressed={selectedTest === "not-tested"}
              className={`${styles.tabButton} ${selectedTest === "not-tested" ? styles.tabButtonActive : ""}`}
            >
              Not Tested
            </button>
          </div>
        </div>

        {/* Vendor/Category Filter Tabs */}
        <div className={styles.filterTabs}>
          {vendors.map((vendor) => (
            <button
              key={vendor}
              onClick={() => setSelectedVendor(vendor)}
              className={`${styles.tabButton} ${selectedVendor === vendor ? styles.tabButtonActive : ""}`}
            >
              {vendor}
            </button>
          ))}
        </div>

        {/* Counts Indicator */}
        <div className="flex justify-between items-center text-xs text-[color:var(--muted)] font-medium mb-6">
          <span>{countLabel}</span>
        </div>
      </section>

      {/* ── Devices Grid ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {filteredDevices.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDevices.map((device) => (
              <div key={device.id} className={styles.deviceCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.vendorName}>{device.vendor}</span>
                    <h3 className={styles.deviceName}>{device.name}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`${styles.statusBadge} ${
                        device.status === "stable" ? styles.statusBadgeStable : styles.statusBadgeIncubating
                      }`}
                    >
                      {device.status}
                    </span>
                    <span
                      className={`${styles.statusBadge} ${
                        TESTED_DEVICES.includes(device.id) ? styles.statusBadgeTested : styles.statusBadgeNotTested
                      }`}
                    >
                      {TESTED_DEVICES.includes(device.id) ? "tested" : "not tested"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Profile ID</span>
                    <span className={`${styles.specValue} ${styles.specCode}`}>{device.id}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>MCU Chip</span>
                    <span className={styles.specValue}>{device.target}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Flash / PSRAM</span>
                    <span className={styles.specValue}>
                      {device.flash} / {device.spiram !== "None" ? device.spiram : "No RAM"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Display</span>
                    <span className={styles.specValue}>{device.display}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Touch Controller</span>
                    <span className={styles.specValue}>{device.touch}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>User Storage</span>
                    <span className={styles.specValue}>{device.storage}</span>
                  </div>
                </div>

                {device.notes && (
                  <div className={styles.notesArea}>
                    <span className="font-semibold text-[color:var(--ink)] block mb-1">Status Notes:</span>
                    <p className="leading-relaxed">{device.notes}</p>
                  </div>
                )}

                <div className={styles.tagPills}>
                  {device.tags.map((tag) => (
                    <span key={tag} className={styles.tagPill}>
                      {tag}
                    </span>
                  ))}
                </div>

                {(() => {
                  const matchingRelease = releases.find((r) => r.profile === device.id);
                  if (matchingRelease) {
                    return (
                      <button
                        onClick={() => setActiveFlashRelease(matchingRelease)}
                        className={styles.cardFlashButton}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                          />
                        </svg>
                        Flash from Web
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[color:var(--border-muted)] rounded-3xl bg-[rgba(var(--surface-rgb),0.3)]">
            <svg className="w-12 h-12 mx-auto text-[color:var(--muted)] opacity-50 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <p className="text-[color:var(--muted)] font-medium">No matching hardware profiles found.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedVendor("All");
                setSelectedStatus("All");
                setSelectedTest("All");
              }}
              className="mt-3 text-xs text-[color:var(--accent)] font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* ── Web Flasher Modal ── */}
      {activeFlashRelease && (
        <>
          {/* ── ESP Web Tools Loader (Loaded dynamically when flashing is initiated) ── */}
          <Script
            src="https://unpkg.com/esp-web-tools@10.2.1/dist/web/install-button.js"
            strategy="afterInteractive"
            type="module"
            integrity="sha384-DLSRQX8nILUsYRCKoOL+FvGRis5HoNA+9ak4QYqreENR9UVDIXUSoZrdt1Ibty96"
            crossOrigin="anonymous"
          />

          <div className={styles.modalOverlay}>
            <div
              className={styles.modalBackdrop}
              onClick={() => setActiveFlashRelease(null)}
            />
            <div className={styles.modalContent}>
              <button
                className={styles.modalCloseButton}
                onClick={() => setActiveFlashRelease(null)}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-6">
                <span className={styles.modalEyebrow}>Firmware Installer</span>
                <h2 className={styles.modalTitle}>Flash {activeFlashRelease.name}</h2>
                <p className={styles.modalSubtitle}>
                  Install <strong>v{activeFlashRelease.version}</strong> ({activeFlashRelease.profile}) directly to your device via serial connection.
                </p>
              </div>

            {/* Warning / Notes */}
            {activeFlashRelease.warning_message && (
              <div className={styles.modalWarning}>
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-xs font-semibold leading-relaxed text-amber-800 dark:text-amber-200">
                  {activeFlashRelease.warning_message}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold text-[color:var(--ink)] uppercase tracking-wider">Instructions:</h4>
              <ol className={styles.instructionList}>
                <li>
                  <span className={styles.stepNumber}>1</span>
                  <p>Connect the device to your computer using a high-quality data USB cable.</p>
                </li>
                <li>
                  <span className={styles.stepNumber}>2</span>
                  <p>Hold down the <strong>BOOT / IO0</strong> button (if available) while connecting, or press it to enter flashing mode.</p>
                </li>
                <li>
                  <span className={styles.stepNumber}>3</span>
                  <p>Click <strong>Start Flashing</strong>, select the correct COM/Serial port from the browser list, and confirm.</p>
                </li>
              </ol>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[color:var(--border-muted)] rounded-2xl bg-[rgba(var(--surface-rgb),0.3)] w-full">
              {isClient ? (
                /* Web component integration (Client-only to avoid SSR hydration mismatch) */
                <esp-web-install-button
                  manifest={`https://cdn.jsdelivr.net/gh/flxos-labs/flxos@releases/releases/${activeFlashRelease.manifest}`}
                >
                  <button slot="activate" className={styles.modalFlashButton}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Start Flashing
                  </button>
                  <div slot="unsupported" className={styles.unsupportedAlert}>
                    <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs leading-relaxed font-semibold">
                      Browser compatibility issue: Web Serial is not supported. Please use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on a desktop computer.
                    </p>
                  </div>
                  <div slot="not-allowed" className={styles.unsupportedAlert}>
                    <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs leading-relaxed font-semibold">
                      Secure context required: Flashing is only permitted over HTTPS or localhost connections.
                    </p>
                  </div>
                </esp-web-install-button>
              ) : (
                <button className={styles.modalFlashButton} disabled>
                  Loading Installer...
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    )}
    </main>
  );
}
