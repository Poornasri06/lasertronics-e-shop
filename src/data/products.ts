import usbcCable from "@/assets/p/usbc-cable.jpg";
import lightningCable from "@/assets/p/lightning-cable.jpg";
import powerbank from "@/assets/p/powerbank.jpg";
import magsafePowerbank from "@/assets/p/magsafe-powerbank.jpg";
import ganCharger from "@/assets/p/gan-charger.jpg";
import usbcCharger from "@/assets/p/usbc-charger.jpg";
import earbuds from "@/assets/p/earbuds.jpg";
import neckband from "@/assets/p/neckband.jpg";
import carHolder from "@/assets/p/car-holder.jpg";
import tripod from "@/assets/p/tripod.jpg";

import psuModule from "@/assets/p/psu-module.jpg";
import capacitorKit from "@/assets/p/capacitor-kit.jpg";
import resistorKit from "@/assets/p/resistor-kit.jpg";
import ledKit from "@/assets/p/led-kit.jpg";
import relay from "@/assets/p/relay.jpg";
import dcmotor from "@/assets/p/dcmotor.jpg";
import servo from "@/assets/p/servo.jpg";
import breadboard from "@/assets/p/breadboard.jpg";
import roboticsKit from "@/assets/p/robotics-kit.jpg";
import bluetoothModule from "@/assets/p/bluetooth-module.jpg";

import hdmiCable from "@/assets/p/hdmi-cable.jpg";
import hdmiSplitter from "@/assets/p/hdmi-splitter.jpg";
import hdmiSwitch from "@/assets/p/hdmi-switch.jpg";
import opticalCable from "@/assets/p/optical-cable.jpg";
import avConverter from "@/assets/p/av-converter.jpg";
import displayport from "@/assets/p/displayport.jpg";
import remote from "@/assets/p/remote.jpg";
import wallmount from "@/assets/p/wallmount.jpg";
import tvKeyboard from "@/assets/p/tv-keyboard.jpg";
import streamingAdapter from "@/assets/p/streaming-adapter.jpg";

import esp32 from "@/assets/p/esp32.jpg";
import nodemcu from "@/assets/p/nodemcu.jpg";
import uno from "@/assets/p/uno.jpg";
import nano from "@/assets/p/nano.jpg";
import piCase from "@/assets/p/pi-case.jpg";
import piAdapter from "@/assets/p/pi-adapter.jpg";
import iotKit from "@/assets/p/iot-kit.jpg";
import wifiSensor from "@/assets/p/wifi-sensor.jpg";
import pir from "@/assets/p/pir.jpg";
import ultrasonic from "@/assets/p/ultrasonic.jpg";

import screwdriverSet from "@/assets/p/screwdriver-set.jpg";
import multimeter from "@/assets/p/multimeter.jpg";
import solderingStation from "@/assets/p/soldering-station.jpg";
import repairToolkit from "@/assets/p/repair-toolkit.jpg";
import desolderPump from "@/assets/p/desolder-pump.jpg";
import antistatic from "@/assets/p/antistatic.jpg";
import solderWire from "@/assets/p/solder-wire.jpg";
import tweezers from "@/assets/p/tweezers.jpg";
import heatGun from "@/assets/p/heat-gun.jpg";
import pryTools from "@/assets/p/pry-tools.jpg";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  blurb: string;
  specs: { label: string; value: string }[];
  badge?: string;
  rating: number;
  reviews: number;
  stock: number;
};

export const categories: Category[] = [
  {
    slug: "mobile-accessories",
    name: "Mobile Accessories",
    tagline: "Charge, carry, connect",
    description:
      "Fast chargers, braided cables, power banks and audio gear tested for Sri Lankan mains and daily commutes.",
  },
  {
    slug: "electronics",
    name: "Electronics",
    tagline: "Components & modules",
    description:
      "Passive components, motors, relays and power modules for prototyping benches, labs and production runs.",
  },
  {
    slug: "tv-accessories",
    name: "TV Accessories",
    tagline: "Every screen, connected",
    description:
      "HDMI, optical and streaming accessories that keep home cinema and conference rooms running cleanly.",
  },
  {
    slug: "iot-and-microcontrollers",
    name: "IoT and Microcontrollers",
    tagline: "Build connected things",
    description:
      "Dev boards, sensors and starter kits for makers, university projects and industrial IoT deployments.",
  },
  {
    slug: "repair-kits",
    name: "Repair Kits",
    tagline: "Bench-grade tooling",
    description:
      "Soldering stations, precision drivers and ESD-safe tools trusted by service centres across the island.",
  },
];

export const products: Product[] = [
  // Mobile Accessories
  {
    slug: "titan-usb-c-braided-cable-2m",
    name: "Titan USB-C to USB-C Braided Cable 2m",
    category: "mobile-accessories",
    price: 2450,
    oldPrice: 2990,
    image: usbcCable,
    blurb: "100W PD nylon-braided cable rated for 30,000 bend cycles.",
    specs: [
      { label: "Length", value: "2 metres" },
      { label: "Power", value: "100W PD 3.0" },
      { label: "Data", value: "480 Mbps" },
      { label: "Jacket", value: "Double-braided nylon" },
    ],
    badge: "Best seller",
    rating: 4.8,
    reviews: 214,
    stock: 68,
  },
  {
    slug: "titan-lightning-fast-charge-cable",
    name: "Titan Lightning Fast-Charge Cable 1.5m",
    category: "mobile-accessories",
    price: 2890,
    image: lightningCable,
    blurb: "MFi-grade lightning cable with reinforced strain relief.",
    specs: [
      { label: "Length", value: "1.5 metres" },
      { label: "Output", value: "20W" },
      { label: "Connector", value: "USB-C to Lightning" },
      { label: "Warranty", value: "12 months" },
    ],
    rating: 4.6,
    reviews: 132,
    stock: 41,
  },
  {
    slug: "voltcore-20000mah-power-bank",
    name: "VoltCore 20,000mAh Power Bank",
    category: "mobile-accessories",
    price: 11900,
    oldPrice: 13500,
    image: powerbank,
    blurb: "Dual-port 22.5W power bank with digital charge display.",
    specs: [
      { label: "Capacity", value: "20,000mAh" },
      { label: "Output", value: "22.5W max" },
      { label: "Ports", value: "USB-C + 2x USB-A" },
      { label: "Cells", value: "Grade-A Li-polymer" },
    ],
    badge: "Popular",
    rating: 4.7,
    reviews: 305,
    stock: 25,
  },
  {
    slug: "voltcore-magsafe-power-bank",
    name: "VoltCore Magnetic Wireless Power Bank",
    category: "mobile-accessories",
    price: 14500,
    image: magsafePowerbank,
    blurb: "10,000mAh magnetic pack with 15W wireless and pass-through charging.",
    specs: [
      { label: "Capacity", value: "10,000mAh" },
      { label: "Wireless", value: "15W magnetic" },
      { label: "Wired", value: "20W USB-C PD" },
      { label: "Finish", value: "Soft-touch matte" },
    ],
    rating: 4.5,
    reviews: 87,
    stock: 19,
  },
  {
    slug: "pulse-65w-gan-charger",
    name: "Pulse 65W GaN Wall Charger",
    category: "mobile-accessories",
    price: 9800,
    oldPrice: 11200,
    image: ganCharger,
    blurb: "Three-port GaN charger that runs a laptop and two phones at once.",
    specs: [
      { label: "Output", value: "65W total" },
      { label: "Ports", value: "2x USB-C, 1x USB-A" },
      { label: "Input", value: "100-240V" },
      { label: "Protection", value: "OVP / OCP / OTP" },
    ],
    badge: "New",
    rating: 4.9,
    reviews: 156,
    stock: 52,
  },
  {
    slug: "pulse-33w-dual-charger",
    name: "Pulse 33W Dual-Port Charger",
    category: "mobile-accessories",
    price: 4750,
    image: usbcCharger,
    blurb: "Compact travel charger with PD and QC 3.0 fast charging.",
    specs: [
      { label: "Output", value: "33W total" },
      { label: "Ports", value: "USB-C + USB-A" },
      { label: "Standards", value: "PD 3.0, QC 3.0" },
      { label: "Plug", value: "Type G (SL)" },
    ],
    rating: 4.4,
    reviews: 96,
    stock: 74,
  },
  {
    slug: "aria-anc-true-wireless-earbuds",
    name: "Aria ANC True Wireless Earbuds",
    category: "mobile-accessories",
    price: 16900,
    oldPrice: 19900,
    image: earbuds,
    blurb: "Hybrid active noise cancelling with 32 hours total playback.",
    specs: [
      { label: "Drivers", value: "12mm dynamic" },
      { label: "ANC", value: "Hybrid -35dB" },
      { label: "Battery", value: "8h + 24h case" },
      { label: "Bluetooth", value: "5.3 multipoint" },
    ],
    rating: 4.6,
    reviews: 241,
    stock: 33,
  },
  {
    slug: "aria-sport-neckband",
    name: "Aria Sport Neckband Headset",
    category: "mobile-accessories",
    price: 5900,
    image: neckband,
    blurb: "Sweat-resistant neckband with magnetic buds and 20h runtime.",
    specs: [
      { label: "Battery", value: "20 hours" },
      { label: "Rating", value: "IPX5" },
      { label: "Charging", value: "USB-C" },
      { label: "Mic", value: "Inline ENC" },
    ],
    rating: 4.3,
    reviews: 74,
    stock: 61,
  },
  {
    slug: "gripmount-magnetic-car-holder",
    name: "GripMount Magnetic Car Holder",
    category: "mobile-accessories",
    price: 3450,
    image: carHolder,
    blurb: "Vent-mounted N52 magnet holder with 360° aluminium ball joint.",
    specs: [
      { label: "Mount", value: "Air vent clip" },
      { label: "Magnets", value: "6x N52" },
      { label: "Rotation", value: "360°" },
      { label: "Fits", value: "Phones up to 7\"" },
    ],
    rating: 4.5,
    reviews: 58,
    stock: 88,
  },
  {
    slug: "framer-tripod-selfie-stick",
    name: "Framer Tripod & Selfie Stick",
    category: "mobile-accessories",
    price: 4200,
    image: tripod,
    blurb: "Aluminium tripod with detachable Bluetooth remote shutter.",
    specs: [
      { label: "Height", value: "Up to 1.6m" },
      { label: "Remote", value: "Bluetooth 5.0" },
      { label: "Load", value: "1.5kg" },
      { label: "Weight", value: "320g" },
    ],
    rating: 4.2,
    reviews: 46,
    stock: 37,
  },

  // Electronics
  {
    slug: "railbench-adjustable-psu-module",
    name: "RailBench Adjustable PSU Module",
    category: "electronics",
    price: 6900,
    image: psuModule,
    blurb: "Buck-boost bench supply module with constant-current limiting.",
    specs: [
      { label: "Input", value: "6-40V DC" },
      { label: "Output", value: "1.2-36V DC" },
      { label: "Current", value: "5A max" },
      { label: "Display", value: "Dual LED readout" },
    ],
    badge: "Bench pick",
    rating: 4.7,
    reviews: 63,
    stock: 22,
  },
  {
    slug: "electrolytic-capacitor-kit-500pc",
    name: "Electrolytic Capacitor Kit (500pc)",
    category: "electronics",
    price: 4600,
    image: capacitorKit,
    blurb: "24 values from 0.1µF to 1000µF in a labelled storage box.",
    specs: [
      { label: "Pieces", value: "500" },
      { label: "Values", value: "24 assorted" },
      { label: "Voltage", value: "16V - 50V" },
      { label: "Tolerance", value: "±20%" },
    ],
    rating: 4.5,
    reviews: 51,
    stock: 44,
  },
  {
    slug: "metal-film-resistor-kit-1280pc",
    name: "Metal Film Resistor Kit (1280pc)",
    category: "electronics",
    price: 3200,
    oldPrice: 3900,
    image: resistorKit,
    blurb: "1% tolerance resistors across 64 values, each bagged and labelled.",
    specs: [
      { label: "Pieces", value: "1280" },
      { label: "Values", value: "64 (10Ω - 1MΩ)" },
      { label: "Tolerance", value: "±1%" },
      { label: "Power", value: "1/4W" },
    ],
    rating: 4.8,
    reviews: 119,
    stock: 96,
  },
  {
    slug: "led-assortment-kit-600pc",
    name: "LED Assortment Kit (600pc)",
    category: "electronics",
    price: 2800,
    image: ledKit,
    blurb: "3mm and 5mm LEDs in five colours with matching resistors.",
    specs: [
      { label: "Pieces", value: "600" },
      { label: "Sizes", value: "3mm & 5mm" },
      { label: "Colours", value: "Red, green, blue, yellow, white" },
      { label: "Forward voltage", value: "1.8 - 3.2V" },
    ],
    rating: 4.4,
    reviews: 72,
    stock: 120,
  },
  {
    slug: "4-channel-relay-module",
    name: "4-Channel Opto-Isolated Relay Module",
    category: "electronics",
    price: 2350,
    image: relay,
    blurb: "5V relay board with opto-isolation for safe mains switching.",
    specs: [
      { label: "Channels", value: "4" },
      { label: "Coil", value: "5V DC" },
      { label: "Contacts", value: "10A @ 250V AC" },
      { label: "Isolation", value: "Optocoupler" },
    ],
    rating: 4.6,
    reviews: 88,
    stock: 57,
  },
  {
    slug: "geared-dc-motor-set",
    name: "Geared DC Motor Set with Wheels",
    category: "electronics",
    price: 3900,
    image: dcmotor,
    blurb: "TT gear motors and rubber wheels for robotics chassis builds.",
    specs: [
      { label: "Voltage", value: "3-6V DC" },
      { label: "Gear ratio", value: "1:48" },
      { label: "Includes", value: "4 motors, 4 wheels" },
      { label: "Speed", value: "200 RPM @ 6V" },
    ],
    rating: 4.3,
    reviews: 41,
    stock: 48,
  },
  {
    slug: "micro-servo-motor-pack",
    name: "Micro Servo Motor 3-Pack",
    category: "electronics",
    price: 2990,
    image: servo,
    blurb: "SG90-compatible micro servos with full horn and screw sets.",
    specs: [
      { label: "Torque", value: "1.8 kg·cm" },
      { label: "Rotation", value: "180°" },
      { label: "Voltage", value: "4.8 - 6V" },
      { label: "Quantity", value: "3 units" },
    ],
    rating: 4.5,
    reviews: 67,
    stock: 73,
  },
  {
    slug: "solderless-breadboard-830",
    name: "Solderless Breadboard 830 Points",
    category: "electronics",
    price: 1450,
    image: breadboard,
    blurb: "Full-size breadboard with adhesive back and jumper wire bundle.",
    specs: [
      { label: "Tie points", value: "830" },
      { label: "Rails", value: "2 power rails" },
      { label: "Includes", value: "65 jumper wires" },
      { label: "Pitch", value: "2.54mm" },
    ],
    badge: "Best seller",
    rating: 4.7,
    reviews: 198,
    stock: 140,
  },
  {
    slug: "robotics-builder-kit",
    name: "Robotics Builder Kit",
    category: "electronics",
    price: 18900,
    oldPrice: 21500,
    image: roboticsKit,
    blurb: "Chassis, controller, motor driver and sensors in one project box.",
    specs: [
      { label: "Controller", value: "ATmega328P board" },
      { label: "Driver", value: "L298N dual H-bridge" },
      { label: "Sensors", value: "Ultrasonic + IR line" },
      { label: "Level", value: "Beginner to intermediate" },
    ],
    rating: 4.6,
    reviews: 54,
    stock: 16,
  },
  {
    slug: "bluetooth-serial-module",
    name: "Bluetooth Serial UART Module",
    category: "electronics",
    price: 1990,
    image: bluetoothModule,
    blurb: "Drop-in wireless serial bridge for microcontroller projects.",
    specs: [
      { label: "Profile", value: "SPP serial" },
      { label: "Voltage", value: "3.3 - 6V" },
      { label: "Range", value: "10 metres" },
      { label: "Baud", value: "9600 - 115200" },
    ],
    rating: 4.4,
    reviews: 79,
    stock: 65,
  },

  // TV Accessories
  {
    slug: "clearview-8k-hdmi-cable-3m",
    name: "ClearView 8K HDMI 2.1 Cable 3m",
    category: "tv-accessories",
    price: 5400,
    oldPrice: 6300,
    image: hdmiCable,
    blurb: "48Gbps certified cable for 8K60 and 4K120 gaming.",
    specs: [
      { label: "Standard", value: "HDMI 2.1" },
      { label: "Bandwidth", value: "48 Gbps" },
      { label: "Length", value: "3 metres" },
      { label: "Shielding", value: "Triple-layer braided" },
    ],
    badge: "Best seller",
    rating: 4.8,
    reviews: 167,
    stock: 54,
  },
  {
    slug: "clearview-1x4-hdmi-splitter",
    name: "ClearView 1x4 HDMI Splitter",
    category: "tv-accessories",
    price: 8900,
    image: hdmiSplitter,
    blurb: "Mirror one source to four displays at full 4K60 with HDR pass-through.",
    specs: [
      { label: "Ports", value: "1 in / 4 out" },
      { label: "Resolution", value: "4K @ 60Hz" },
      { label: "HDR", value: "HDR10 pass-through" },
      { label: "Power", value: "5V adapter included" },
    ],
    rating: 4.5,
    reviews: 62,
    stock: 27,
  },
  {
    slug: "clearview-5-port-hdmi-switch",
    name: "ClearView 5-Port HDMI Switch",
    category: "tv-accessories",
    price: 7200,
    image: hdmiSwitch,
    blurb: "Auto-sensing switch with IR remote for five source devices.",
    specs: [
      { label: "Ports", value: "5 in / 1 out" },
      { label: "Resolution", value: "4K @ 60Hz" },
      { label: "Control", value: "Button + IR remote" },
      { label: "Auto switch", value: "Yes" },
    ],
    rating: 4.4,
    reviews: 48,
    stock: 31,
  },
  {
    slug: "optical-toslink-audio-cable",
    name: "Optical TOSLINK Audio Cable 2m",
    category: "tv-accessories",
    price: 2600,
    image: opticalCable,
    blurb: "Gold-plated fibre optical cable for soundbars and AV receivers.",
    specs: [
      { label: "Length", value: "2 metres" },
      { label: "Audio", value: "PCM, Dolby, DTS" },
      { label: "Connector", value: "TOSLINK gold-plated" },
      { label: "Core", value: "Optical fibre" },
    ],
    rating: 4.6,
    reviews: 93,
    stock: 82,
  },
  {
    slug: "av-to-hdmi-converter",
    name: "AV to HDMI Signal Converter",
    category: "tv-accessories",
    price: 4300,
    image: avConverter,
    blurb: "Bring legacy RCA equipment to modern HDMI panels at 1080p.",
    specs: [
      { label: "Input", value: "3x RCA composite" },
      { label: "Output", value: "HDMI 720p/1080p" },
      { label: "Power", value: "USB 5V" },
      { label: "Latency", value: "Low-lag scaler" },
    ],
    rating: 4.2,
    reviews: 37,
    stock: 45,
  },
  {
    slug: "displayport-to-hdmi-cable",
    name: "DisplayPort to HDMI 4K Cable 2m",
    category: "tv-accessories",
    price: 4900,
    image: displayport,
    blurb: "Connect desktops and docks to any HDMI television at 4K60.",
    specs: [
      { label: "Length", value: "2 metres" },
      { label: "Resolution", value: "4K @ 60Hz" },
      { label: "Direction", value: "DP source to HDMI display" },
      { label: "Chipset", value: "Active converter" },
    ],
    rating: 4.5,
    reviews: 55,
    stock: 39,
  },
  {
    slug: "universal-smart-tv-remote",
    name: "Universal Smart TV Remote",
    category: "tv-accessories",
    price: 3100,
    image: remote,
    blurb: "Pre-programmed for major brands with quick-launch app keys.",
    specs: [
      { label: "Compatibility", value: "Most major TV brands" },
      { label: "Setup", value: "Auto code search" },
      { label: "Battery", value: "2x AAA" },
      { label: "Range", value: "8 metres" },
    ],
    rating: 4.1,
    reviews: 84,
    stock: 110,
  },
  {
    slug: "tilt-tv-wall-mount",
    name: "Heavy-Duty Tilt TV Wall Mount",
    category: "tv-accessories",
    price: 9600,
    oldPrice: 11400,
    image: wallmount,
    blurb: "Cold-rolled steel mount for 32-75\" panels with ±12° tilt.",
    specs: [
      { label: "Screen size", value: "32\" - 75\"" },
      { label: "Load", value: "50kg" },
      { label: "VESA", value: "Up to 600x400" },
      { label: "Tilt", value: "±12°" },
    ],
    rating: 4.7,
    reviews: 71,
    stock: 18,
  },
  {
    slug: "wireless-tv-keyboard-remote",
    name: "Wireless TV Keyboard Remote",
    category: "tv-accessories",
    price: 5800,
    image: tvKeyboard,
    blurb: "Backlit mini keyboard with touchpad for smart TVs and media boxes.",
    specs: [
      { label: "Connection", value: "2.4GHz USB dongle" },
      { label: "Touchpad", value: "Multi-touch" },
      { label: "Backlight", value: "3-level white" },
      { label: "Battery", value: "Rechargeable Li-ion" },
    ],
    rating: 4.4,
    reviews: 43,
    stock: 29,
  },
  {
    slug: "4k-streaming-adapter",
    name: "4K HDR Streaming Adapter",
    category: "tv-accessories",
    price: 13500,
    image: streamingAdapter,
    blurb: "Turn any HDMI television into a 4K HDR streaming smart TV.",
    specs: [
      { label: "Output", value: "4K HDR10" },
      { label: "Wi-Fi", value: "Dual-band 802.11ac" },
      { label: "Storage", value: "8GB" },
      { label: "Audio", value: "Dolby Audio" },
    ],
    badge: "New",
    rating: 4.5,
    reviews: 66,
    stock: 24,
  },

  // IoT and Microcontrollers
  {
    slug: "esp32-wroom-dev-board",
    name: "ESP32-WROOM Development Board",
    category: "iot-and-microcontrollers",
    price: 3450,
    oldPrice: 3990,
    image: esp32,
    blurb: "Dual-core Wi-Fi + Bluetooth board with 38 broken-out pins.",
    specs: [
      { label: "MCU", value: "Xtensa dual-core 240MHz" },
      { label: "Wireless", value: "Wi-Fi + BLE 4.2" },
      { label: "Flash", value: "4MB" },
      { label: "GPIO", value: "38 pins" },
    ],
    badge: "Best seller",
    rating: 4.9,
    reviews: 342,
    stock: 130,
  },
  {
    slug: "nodemcu-esp8266-board",
    name: "NodeMCU ESP8266 Wi-Fi Board",
    category: "iot-and-microcontrollers",
    price: 2150,
    image: nodemcu,
    blurb: "The classic low-cost Wi-Fi board for connected home projects.",
    specs: [
      { label: "MCU", value: "ESP8266 80MHz" },
      { label: "Flash", value: "4MB" },
      { label: "USB", value: "Micro-USB CH340" },
      { label: "GPIO", value: "11 digital" },
    ],
    rating: 4.6,
    reviews: 187,
    stock: 118,
  },
  {
    slug: "uno-r3-compatible-board",
    name: "UNO R3 Compatible Board",
    category: "iot-and-microcontrollers",
    price: 3900,
    image: uno,
    blurb: "ATmega328P board with USB cable, ideal for teaching labs.",
    specs: [
      { label: "MCU", value: "ATmega328P" },
      { label: "Clock", value: "16MHz" },
      { label: "I/O", value: "14 digital, 6 analog" },
      { label: "Includes", value: "USB-B cable" },
    ],
    rating: 4.7,
    reviews: 221,
    stock: 92,
  },
  {
    slug: "nano-v3-compatible-board",
    name: "Nano V3 Compatible Board",
    category: "iot-and-microcontrollers",
    price: 2600,
    image: nano,
    blurb: "Breadboard-friendly ATmega328P board with pre-soldered headers.",
    specs: [
      { label: "MCU", value: "ATmega328P" },
      { label: "USB", value: "Type-C CH340" },
      { label: "Footprint", value: "45 x 18mm" },
      { label: "Headers", value: "Pre-soldered" },
    ],
    rating: 4.5,
    reviews: 143,
    stock: 104,
  },
  {
    slug: "single-board-computer-case",
    name: "Aluminium SBC Case with Fan",
    category: "iot-and-microcontrollers",
    price: 6400,
    image: piCase,
    blurb: "Passive-plus-active cooling enclosure for single-board computers.",
    specs: [
      { label: "Material", value: "CNC aluminium" },
      { label: "Cooling", value: "Heatsink + 30mm fan" },
      { label: "Access", value: "All ports exposed" },
      { label: "Includes", value: "Thermal pads, screws" },
    ],
    rating: 4.6,
    reviews: 39,
    stock: 21,
  },
  {
    slug: "sbc-power-adapter-usb-c",
    name: "SBC USB-C Power Adapter 5V/3A",
    category: "iot-and-microcontrollers",
    price: 3300,
    image: piAdapter,
    blurb: "Regulated 15W supply with inline switch for single-board computers.",
    specs: [
      { label: "Output", value: "5.1V / 3A" },
      { label: "Connector", value: "USB-C" },
      { label: "Cable", value: "1.5m fixed" },
      { label: "Switch", value: "Inline on/off" },
    ],
    rating: 4.5,
    reviews: 58,
    stock: 63,
  },
  {
    slug: "iot-starter-sensor-kit",
    name: "IoT Starter Sensor Kit (37-in-1)",
    category: "iot-and-microcontrollers",
    price: 12400,
    oldPrice: 14200,
    image: iotKit,
    blurb: "Thirty-seven sensor modules in a foam-lined case with guide.",
    specs: [
      { label: "Modules", value: "37" },
      { label: "Compatible", value: "UNO, Nano, ESP32" },
      { label: "Case", value: "Foam-lined storage box" },
      { label: "Docs", value: "Online project guide" },
    ],
    badge: "Popular",
    rating: 4.7,
    reviews: 108,
    stock: 26,
  },
  {
    slug: "wifi-temperature-humidity-sensor",
    name: "Wi-Fi Temperature & Humidity Sensor",
    category: "iot-and-microcontrollers",
    price: 5600,
    image: wifiSensor,
    blurb: "Calibrated environmental sensor node with MQTT-ready firmware.",
    specs: [
      { label: "Accuracy", value: "±0.3°C / ±2% RH" },
      { label: "Radio", value: "Wi-Fi 2.4GHz" },
      { label: "Protocol", value: "MQTT / HTTP" },
      { label: "Power", value: "USB-C or battery" },
    ],
    rating: 4.4,
    reviews: 47,
    stock: 34,
  },
  {
    slug: "pir-motion-sensor-module",
    name: "PIR Motion Sensor Module",
    category: "iot-and-microcontrollers",
    price: 890,
    image: pir,
    blurb: "Adjustable delay and sensitivity passive infrared detector.",
    specs: [
      { label: "Range", value: "Up to 7 metres" },
      { label: "Angle", value: "110°" },
      { label: "Voltage", value: "4.5 - 20V" },
      { label: "Output", value: "3.3V digital" },
    ],
    rating: 4.3,
    reviews: 126,
    stock: 156,
  },
  {
    slug: "ultrasonic-distance-sensor",
    name: "Ultrasonic Distance Sensor",
    category: "iot-and-microcontrollers",
    price: 950,
    image: ultrasonic,
    blurb: "2cm to 4m ranging module for robots, tanks and parking sensors.",
    specs: [
      { label: "Range", value: "2cm - 400cm" },
      { label: "Resolution", value: "3mm" },
      { label: "Voltage", value: "5V DC" },
      { label: "Interface", value: "Trigger / Echo" },
    ],
    rating: 4.5,
    reviews: 174,
    stock: 148,
  },

  // Repair Kits
  {
    slug: "precision-screwdriver-set-32-in-1",
    name: "Precision Screwdriver Set (32-in-1)",
    category: "repair-kits",
    price: 4900,
    oldPrice: 5800,
    image: screwdriverSet,
    blurb: "CRV magnetised bits with a swivel-cap driver in a slim case.",
    specs: [
      { label: "Bits", value: "32 CRV steel" },
      { label: "Driver", value: "Magnetic swivel cap" },
      { label: "Case", value: "Hard shell" },
      { label: "Use", value: "Phones, laptops, consoles" },
    ],
    badge: "Best seller",
    rating: 4.8,
    reviews: 189,
    stock: 71,
  },
  {
    slug: "true-rms-digital-multimeter",
    name: "True-RMS Digital Multimeter",
    category: "repair-kits",
    price: 11500,
    image: multimeter,
    blurb: "CAT III 600V meter with auto-ranging, continuity and capacitance.",
    specs: [
      { label: "Safety", value: "CAT III 600V" },
      { label: "Display", value: "6000 counts backlit" },
      { label: "Measures", value: "V, A, Ω, C, Hz, diode" },
      { label: "Ranging", value: "Auto + manual" },
    ],
    rating: 4.7,
    reviews: 96,
    stock: 28,
  },
  {
    slug: "digital-soldering-station-60w",
    name: "Digital Soldering Station 60W",
    category: "repair-kits",
    price: 19800,
    oldPrice: 22900,
    image: solderingStation,
    blurb: "Temperature-stable ceramic station with sleep mode and stand.",
    specs: [
      { label: "Power", value: "60W" },
      { label: "Range", value: "200 - 480°C" },
      { label: "Heat-up", value: "Under 30 seconds" },
      { label: "Includes", value: "Stand + 3 tips" },
    ],
    badge: "Pro pick",
    rating: 4.8,
    reviews: 112,
    stock: 15,
  },
  {
    slug: "professional-repair-toolkit",
    name: "Professional Repair Toolkit",
    category: "repair-kits",
    price: 24500,
    image: repairToolkit,
    blurb: "Full technician case: drivers, pliers, probes and opening tools.",
    specs: [
      { label: "Pieces", value: "68" },
      { label: "Case", value: "Aluminium flight case" },
      { label: "Finish", value: "Chrome vanadium" },
      { label: "Ideal for", value: "Service centres" },
    ],
    rating: 4.9,
    reviews: 58,
    stock: 9,
  },
  {
    slug: "aluminium-desoldering-pump",
    name: "Aluminium Desoldering Pump",
    category: "repair-kits",
    price: 1750,
    image: desolderPump,
    blurb: "High-vacuum solder sucker with replaceable PTFE nozzle.",
    specs: [
      { label: "Body", value: "Anodised aluminium" },
      { label: "Nozzle", value: "Replaceable PTFE" },
      { label: "Length", value: "195mm" },
      { label: "Action", value: "Single-hand release" },
    ],
    rating: 4.4,
    reviews: 83,
    stock: 87,
  },
  {
    slug: "esd-safe-wrist-strap-and-mat",
    name: "ESD-Safe Wrist Strap & Mat",
    category: "repair-kits",
    price: 3600,
    image: antistatic,
    blurb: "Grounded anti-static kit that protects boards during every repair.",
    specs: [
      { label: "Includes", value: "Strap + mat + lead" },
      { label: "Resistance", value: "1MΩ safety resistor" },
      { label: "Mat size", value: "300 x 250mm" },
      { label: "Cable", value: "1.8m coiled" },
    ],
    rating: 4.5,
    reviews: 64,
    stock: 52,
  },
  {
    slug: "rosin-core-solder-wire-100g",
    name: "Rosin-Core Solder Wire 100g",
    category: "repair-kits",
    price: 2900,
    image: solderWire,
    blurb: "0.8mm flux-cored wire that wets fast and leaves clean joints.",
    specs: [
      { label: "Diameter", value: "0.8mm" },
      { label: "Weight", value: "100g" },
      { label: "Flux", value: "Rosin core 2%" },
      { label: "Melting point", value: "183°C" },
    ],
    rating: 4.6,
    reviews: 141,
    stock: 99,
  },
  {
    slug: "precision-tweezers-set",
    name: "Precision Tweezers Set (6pc)",
    category: "repair-kits",
    price: 3200,
    image: tweezers,
    blurb: "Non-magnetic stainless tweezers for SMD and micro-soldering work.",
    specs: [
      { label: "Pieces", value: "6" },
      { label: "Material", value: "Non-magnetic stainless" },
      { label: "Tips", value: "Straight, curved, flat, fine" },
      { label: "Finish", value: "ESD-safe coating" },
    ],
    rating: 4.7,
    reviews: 77,
    stock: 68,
  },
  {
    slug: "hot-air-rework-station",
    name: "Hot Air Rework Station",
    category: "repair-kits",
    price: 32900,
    oldPrice: 36500,
    image: heatGun,
    blurb: "Brushless hot air station with digital control for SMD rework.",
    specs: [
      { label: "Power", value: "700W" },
      { label: "Range", value: "100 - 480°C" },
      { label: "Airflow", value: "120 L/min" },
      { label: "Nozzles", value: "3 included" },
    ],
    rating: 4.8,
    reviews: 45,
    stock: 7,
  },
  {
    slug: "device-opening-pry-tool-kit",
    name: "Device Opening Pry Tool Kit",
    category: "repair-kits",
    price: 1990,
    image: pryTools,
    blurb: "Spudgers, picks and suction cup for scratch-free disassembly.",
    specs: [
      { label: "Pieces", value: "11" },
      { label: "Material", value: "Nylon + steel" },
      { label: "Includes", value: "Suction cup" },
      { label: "Safe on", value: "Glass and plastic" },
    ],
    rating: 4.3,
    reviews: 92,
    stock: 115,
  },
];

export const formatLKR = (value: number) =>
  `LKR ${value.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const productsByCategory = (slug: string, limit?: number) => {
  const list = products.filter((p) => p.category === slug);
  return limit ? list.slice(0, limit) : list;
};

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const relatedProducts = (product: Product, limit = 4) =>
  products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
