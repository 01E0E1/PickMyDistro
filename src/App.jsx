import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   DISTRO DATABASE (57 distributions, verified March 2026)
   Source: distros.json — see schema.json for field documentation
   ═══════════════════════════════════════════════ */

const DISTROS = {
  ubuntu: {
    name: "Ubuntu", tagline: "The gateway to Linux", color: "#E95420", icon: "🟠", difficulty: 1,
    desktop: ["GNOME"], packageManager: "APT (deb) + Snap", releaseModel: "Fixed (6-month, LTS every 2 years)",
    description: "The most popular desktop Linux distribution. Massive community, commercial support from Canonical, and the widest software compatibility of any distro. Ubuntu 24.04 LTS is the current long-term release.",
    pros: ["Largest community and documentation","Widest software and hardware compatibility","Long-term support (5+ years with ESM)","Excellent cloud and server integration"],
    cons: ["Snap packages can be slow to launch","GNOME is resource-heavy","Canonical's commercial priorities sometimes conflict with community"],
    website: "https://ubuntu.com",
    traits: { beginner: 10, gaming: 7, privacy: 5, dev: 7, server: 8, light: 3, custom: 5, stable: 8, latest: 5 },
    categories: ["beginner","desktop","server","enterprise","developer"], nvidiaSupport: "good", immutable: false,
  },
  mint: {
    name: "Linux Mint", tagline: "Elegant & comfortable", color: "#87CF3E", icon: "🟢", difficulty: 1,
    desktop: ["Cinnamon","MATE","Xfce"], packageManager: "APT (deb) + Flatpak", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "The most Windows-like Linux experience. Ships Cinnamon desktop with no Snaps, excellent out-of-the-box usability, and rock-solid Ubuntu LTS base. Mint 22 is the current release.",
    pros: ["Most familiar experience for Windows users","No Snap packages","Excellent built-in tools (Timeshift, Update Manager)","Stable Ubuntu LTS base"],
    cons: ["Slower to receive newest software","Smaller community than Ubuntu","Not suitable for server use"],
    website: "https://linuxmint.com",
    traits: { beginner: 10, gaming: 7, privacy: 6, dev: 6, server: 3, light: 5, custom: 6, stable: 9, latest: 3 },
    categories: ["beginner","desktop"], nvidiaSupport: "good", immutable: false,
  },
  lmde: {
    name: "LMDE", tagline: "Mint, directly on Debian", color: "#6BBD45", icon: "🟢", difficulty: 2,
    desktop: ["Cinnamon"], packageManager: "APT (deb)", releaseModel: "Fixed (follows Debian Stable)",
    description: "Linux Mint Debian Edition — the same Mint experience built directly on Debian Stable instead of Ubuntu. Insurance policy for the Mint project and a great choice for Debian fans who want Cinnamon.",
    pros: ["Pure Debian base without Ubuntu layer","Same Mint tools and Cinnamon experience","Longer support cycle than Ubuntu-based Mint","No Snaps, no Ubuntu dependencies"],
    cons: ["Cinnamon only (no MATE/Xfce editions)","Older packages than Ubuntu-based Mint","Smaller community and fewer guides"],
    website: "https://linuxmint.com/download_lmde.php",
    traits: { beginner: 8, gaming: 5, privacy: 6, dev: 6, server: 3, light: 5, custom: 5, stable: 9, latest: 2 },
    categories: ["beginner","desktop"], nvidiaSupport: "good", immutable: false,
  },
  fedora: {
    name: "Fedora", tagline: "Leading-edge innovation", color: "#51A2DA", icon: "🔵", difficulty: 2,
    desktop: ["GNOME","KDE","Xfce","Sway","Budgie"], packageManager: "DNF 5 (rpm) + Flatpak", releaseModel: "Fixed (6-month cycles)",
    description: "Red Hat's community distribution. Fedora 42+ ships DNF 5, Rust-based coreutils, and the latest GNOME. The proving ground for RHEL technologies with strong privacy defaults.",
    pros: ["Latest stable software without rolling risk","Excellent GNOME and KDE spins","Strong security defaults (SELinux)","DNF 5 is significantly faster"],
    cons: ["Short support cycle (13 months per release)","No proprietary codecs out of the box","Smaller repos than Debian/Ubuntu"],
    website: "https://fedoraproject.org",
    traits: { beginner: 6, gaming: 6, privacy: 7, dev: 9, server: 6, light: 4, custom: 5, stable: 7, latest: 8 },
    categories: ["desktop","developer"], nvidiaSupport: "good", immutable: false,
  },
  fedora_silverblue: {
    name: "Fedora Silverblue", tagline: "Immutable Fedora with GNOME", color: "#3C6EB4", icon: "🔷", difficulty: 3,
    desktop: ["GNOME"], packageManager: "rpm-ostree + Flatpak", releaseModel: "Fixed (follows Fedora)",
    description: "Fedora's immutable desktop variant using OSTree. The base system is read-only with atomic updates and rollbacks. Apps are installed via Flatpak or toolbox containers.",
    pros: ["Atomic updates with instant rollback","Rock-solid base system","Flatpak-first app model","Same Fedora release cadence"],
    cons: ["Can't easily install traditional RPMs","Steeper learning curve for package management","Toolbox/Distrobox needed for dev work"],
    website: "https://fedoraproject.org/atomic-desktops/silverblue/",
    traits: { beginner: 4, gaming: 5, privacy: 7, dev: 7, server: 3, light: 4, custom: 4, stable: 9, latest: 8 },
    categories: ["desktop","developer","immutable"], nvidiaSupport: "good", immutable: true,
  },
  arch: {
    name: "Arch Linux", tagline: "Keep it simple, build it yourself", color: "#1793D1", icon: "🏔️", difficulty: 4,
    desktop: ["Any (you choose)"], packageManager: "Pacman + AUR", releaseModel: "Rolling",
    description: "A rolling-release distribution with a minimal base. You build your system from scratch using pacman and the AUR. The Arch Wiki is the best documentation in all of Linux.",
    pros: ["Always up-to-date packages","AUR has virtually everything","Legendary Arch Wiki","Total system control"],
    cons: ["Manual installation (archinstall helps)","Can break with updates","Steep learning curve","Requires ongoing maintenance"],
    website: "https://archlinux.org",
    traits: { beginner: 1, gaming: 8, privacy: 7, dev: 9, server: 4, light: 8, custom: 10, stable: 5, latest: 10 },
    categories: ["advanced","developer","desktop"], nvidiaSupport: "good", immutable: false,
  },
  debian: {
    name: "Debian", tagline: "The universal operating system", color: "#A80030", icon: "🔴", difficulty: 3,
    desktop: ["GNOME","KDE","Xfce","MATE","LXQt","Cinnamon"], packageManager: "APT (deb)", releaseModel: "Fixed (2-year cycles)",
    description: "The grandfather of Ubuntu, Mint, and hundreds of derivatives. Famous for rock-solid stability and 60,000+ packages. Debian 12 'Bookworm' is the current stable release.",
    pros: ["Legendary stability","Massive 60,000+ package repository","Strong free software commitment","The backbone of countless servers"],
    cons: ["Older software versions in Stable","Installer less polished than Ubuntu","Hardware support can lag behind"],
    website: "https://debian.org",
    traits: { beginner: 4, gaming: 4, privacy: 7, dev: 7, server: 10, light: 6, custom: 7, stable: 10, latest: 2 },
    categories: ["server","developer","advanced"], nvidiaSupport: "fair", immutable: false,
  },
  opensuse: {
    name: "openSUSE", tagline: "Choose your adventure", color: "#73BA25", icon: "🦎", difficulty: 2,
    desktop: ["KDE","GNOME","Xfce"], packageManager: "Zypper (rpm)", releaseModel: "Rolling (Tumbleweed) or Fixed (Leap)",
    description: "Two flavors: Tumbleweed (rolling) and Leap (stable). YaST is the most powerful graphical system configuration tool in Linux. Strong enterprise heritage from SUSE.",
    pros: ["YaST configuration tool","Choice of rolling or stable","Excellent KDE implementation","Btrfs snapshots with Snapper by default"],
    cons: ["Smaller community than Debian/Ubuntu","Fewer tutorials available","Package naming conventions can confuse"],
    website: "https://opensuse.org",
    traits: { beginner: 5, gaming: 5, privacy: 6, dev: 8, server: 8, light: 4, custom: 7, stable: 8, latest: 7 },
    categories: ["desktop","developer","server"], nvidiaSupport: "good", immutable: false,
  },
  opensuse_aeon: {
    name: "openSUSE Aeon", tagline: "Immutable GNOME desktop by SUSE", color: "#5BA951", icon: "🦎", difficulty: 3,
    desktop: ["GNOME"], packageManager: "transactional-update + Flatpak", releaseModel: "Rolling (immutable)",
    description: "openSUSE's immutable desktop with GNOME and Btrfs transactional updates. The base system auto-updates atomically; apps are installed via Flatpak. Aeon (GNOME) and Kalpa (KDE) variants.",
    pros: ["Atomic transactional updates","Btrfs snapshots for easy rollback","Flatpak-first app model","SUSE enterprise heritage"],
    cons: ["Limited to GNOME (Kalpa for KDE)","Newer project, smaller community","Traditional package installs are restricted"],
    website: "https://aeondesktop.github.io",
    traits: { beginner: 4, gaming: 4, privacy: 6, dev: 6, server: 3, light: 4, custom: 3, stable: 9, latest: 7 },
    categories: ["desktop","immutable"], nvidiaSupport: "fair", immutable: true,
  },
  popos: {
    name: "Pop!_OS", tagline: "Built for creators & gamers", color: "#FCC624", icon: "🟡", difficulty: 1,
    desktop: ["COSMIC"], packageManager: "APT (deb)", releaseModel: "Fixed (follows Ubuntu)",
    description: "System76's distribution now featuring COSMIC — a Rust-based desktop environment built from scratch. COSMIC Epoch 1 launched December 2025 with Wayland-native tiling, excellent NVIDIA support, and polished productivity workflows.",
    pros: ["Best NVIDIA out-of-the-box support","COSMIC desktop with native tiling","Recovery partition for emergencies","System76 hardware optimization"],
    cons: ["COSMIC is young — some rough edges remain","Smaller team than Ubuntu/Fedora","COSMIC ecosystem still growing"],
    website: "https://pop.system76.com",
    traits: { beginner: 8, gaming: 9, privacy: 5, dev: 8, server: 3, light: 4, custom: 6, stable: 7, latest: 6 },
    categories: ["beginner","gaming","developer","desktop"], nvidiaSupport: "excellent", immutable: false,
  },
  manjaro: {
    name: "Manjaro", tagline: "Arch made accessible", color: "#35BF5C", icon: "🌿", difficulty: 2,
    desktop: ["KDE","GNOME","Xfce"], packageManager: "Pacman + AUR", releaseModel: "Rolling (with delay buffer)",
    description: "An Arch-based distribution with a user-friendly installer, hardware detection, and a delayed package buffer for extra stability. Bridges the gap between beginner-friendly and rolling-release power.",
    pros: ["Arch packages without the manual setup","Excellent hardware detection tool (mhwd)","Multiple official desktop editions","Good gaming support"],
    cons: ["Delayed packages can break AUR compatibility","History of security certificate lapses","Not pure Arch — some community friction"],
    website: "https://manjaro.org",
    traits: { beginner: 6, gaming: 8, privacy: 5, dev: 7, server: 3, light: 5, custom: 8, stable: 6, latest: 8 },
    categories: ["desktop","gaming"], nvidiaSupport: "good", immutable: false,
  },
  zorin: {
    name: "Zorin OS", tagline: "Your computer, but better", color: "#15A6F0", icon: "💎", difficulty: 1,
    desktop: ["GNOME (customized)"], packageManager: "APT (deb) + Flatpak", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "Designed specifically for Windows and macOS migrants. Beautiful interface with switchable layouts that mimic Windows 11, macOS, or ChromeOS. Zorin 17 is based on Ubuntu 24.04 LTS.",
    pros: ["Familiar layouts for Windows/macOS/ChromeOS users","Beautiful default theme","Very beginner-friendly","Lite edition for older hardware"],
    cons: ["Pro edition costs money","Smaller community than Ubuntu","Limited customization in free Core edition"],
    website: "https://zorin.com",
    traits: { beginner: 10, gaming: 6, privacy: 5, dev: 5, server: 2, light: 5, custom: 4, stable: 8, latest: 3 },
    categories: ["beginner","desktop"], nvidiaSupport: "good", immutable: false,
  },
  endeavouros: {
    name: "EndeavourOS", tagline: "A terminal-centric Arch experience", color: "#7B3FA0", icon: "🟣", difficulty: 3,
    desktop: ["KDE","GNOME","Xfce","i3","BSPWM","Sway","Hyprland"], packageManager: "Pacman + AUR", releaseModel: "Rolling",
    description: "A graphical Arch installer that stays close to vanilla Arch. Ganymede Neo (January 2026) ships KDE Plasma 6.5 and Linux 6.18. The community is famously friendly and welcoming.",
    pros: ["True vanilla Arch experience simplified","Exceptionally friendly community","Wide DE/WM selection","Close to upstream Arch"],
    cons: ["Smaller project than Manjaro","Can still break like any Arch system","Less hand-holding post-install"],
    website: "https://endeavouros.com",
    traits: { beginner: 3, gaming: 7, privacy: 6, dev: 8, server: 4, light: 7, custom: 9, stable: 5, latest: 9 },
    categories: ["advanced","desktop","developer"], nvidiaSupport: "good", immutable: false,
  },
  cachyos: {
    name: "CachyOS", tagline: "Performance-tuned Arch", color: "#4FC3F7", icon: "⚡", difficulty: 2,
    desktop: ["KDE","GNOME","Xfce","COSMIC","Hyprland","Sway","i3"], packageManager: "Pacman (forked) + AUR", releaseModel: "Rolling",
    description: "The hottest Arch derivative in 2025–2026, topping DistroWatch. Features BORE scheduler, CPU-targeted builds (x86-64-v3/v4), AutoFDO-profiled kernels, and a Calamares installer with animated desktop previews. March 2026 ships Linux 6.18 LTS and KDE Plasma 6.6.",
    pros: ["BORE scheduler + AutoFDO-profiled kernel for top performance","CPU-optimized builds (v3/v4/znver4)","Excellent gaming support with Proton-CachyOS","User-friendly for an Arch derivative"],
    cons: ["Relatively young project (2021)","Custom pacman fork may cause compatibility quirks","Performance focus may not matter on older hardware"],
    website: "https://cachyos.org",
    traits: { beginner: 5, gaming: 10, privacy: 6, dev: 8, server: 4, light: 5, custom: 8, stable: 6, latest: 10 },
    categories: ["gaming","desktop","developer"], nvidiaSupport: "excellent", immutable: false,
  },
  nixos: {
    name: "NixOS", tagline: "Reproducible builds, declarative config", color: "#5277C3", icon: "❄️", difficulty: 5,
    desktop: ["Any (you choose)"], packageManager: "Nix", releaseModel: "Fixed + Rolling (Unstable)",
    description: "Your entire system defined in a single configuration file. Atomic upgrades, instant rollbacks, and fully reproducible environments. The largest package repository (100,000+ packages in Nixpkgs).",
    pros: ["Declarative, reproducible system configuration","Atomic upgrades with instant rollback","Largest package repository in Linux","Perfect for DevOps and infrastructure-as-code"],
    cons: ["Steep learning curve (Nix language)","Documentation has gaps","Nix community governance controversies","Non-standard FHS can break assumptions"],
    website: "https://nixos.org",
    traits: { beginner: 1, gaming: 5, privacy: 7, dev: 10, server: 8, light: 6, custom: 9, stable: 8, latest: 8 },
    categories: ["advanced","developer","server"], nvidiaSupport: "fair", immutable: false,
  },
  tails: {
    name: "Tails", tagline: "Privacy by design", color: "#56347C", icon: "🔒", difficulty: 2,
    desktop: ["GNOME"], packageManager: "APT (deb)", releaseModel: "Fixed",
    description: "A portable OS that routes all traffic through Tor and leaves no trace. Boots from USB, forgets everything on shutdown. Used by journalists, activists, and privacy advocates worldwide.",
    pros: ["Maximum privacy and anonymity","Amnesic — leaves no trace on disk","All traffic routed through Tor","Portable — boots from USB on any computer"],
    cons: ["Not designed for daily use","Limited software selection","Tor overhead slows browsing","Cannot persist data without extra setup"],
    website: "https://tails.net",
    traits: { beginner: 3, gaming: 1, privacy: 10, dev: 2, server: 1, light: 5, custom: 1, stable: 7, latest: 3 },
    categories: ["privacy","security"], nvidiaSupport: "poor", immutable: false,
  },
  qubes: {
    name: "Qubes OS", tagline: "Security through compartmentalization", color: "#3874D8", icon: "🛡️", difficulty: 5,
    desktop: ["Xfce (dom0)"], packageManager: "DNF + APT (in qubes)", releaseModel: "Fixed",
    description: "Uses Xen hypervisor to run every application in an isolated virtual machine. Endorsed by Edward Snowden and the Freedom of the Press Foundation. The most security-focused desktop OS available.",
    pros: ["Strongest compartmentalized security model","Endorsed by top security researchers","Isolates work, personal, and untrusted activities","Disposable VMs for risky operations"],
    cons: ["Extremely high hardware requirements","Steep learning curve","No GPU passthrough (limited gaming)","Resource-intensive (needs 16GB+ RAM)"],
    website: "https://qubes-os.org",
    traits: { beginner: 1, gaming: 0, privacy: 10, dev: 6, server: 1, light: 1, custom: 5, stable: 7, latest: 5 },
    categories: ["privacy","security","advanced"], nvidiaSupport: "poor", immutable: false,
  },
  whonix: {
    name: "Whonix", tagline: "Anonymous operating system", color: "#007BFF", icon: "🌐", difficulty: 3,
    desktop: ["Xfce"], packageManager: "APT (deb)", releaseModel: "Fixed (follows Debian)",
    description: "A two-VM approach to privacy: a Gateway VM routes all traffic through Tor, while a Workstation VM runs your apps. IP leaks are architecturally impossible. Runs inside VirtualBox, KVM, or Qubes.",
    pros: ["IP leaks architecturally impossible","Works inside any host OS via VM","Tor-enforced at network level","Can run inside Qubes for extra hardening"],
    cons: ["Runs in VMs — performance overhead","Complex setup for non-technical users","Not a standalone OS","Limited by Tor speed"],
    website: "https://whonix.org",
    traits: { beginner: 2, gaming: 0, privacy: 9, dev: 3, server: 1, light: 3, custom: 2, stable: 7, latest: 3 },
    categories: ["privacy","security"], nvidiaSupport: "poor", immutable: false,
  },
  elementary: {
    name: "elementary OS", tagline: "The thoughtful, capable, ethical OS", color: "#3689E6", icon: "✨", difficulty: 1,
    desktop: ["Pantheon"], packageManager: "APT (deb) + Flatpak", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "macOS-inspired aesthetics with the Pantheon desktop. Focuses on design, simplicity, and a curated AppCenter with pay-what-you-want apps. elementary OS 8 is based on Ubuntu 24.04 LTS.",
    pros: ["Beautiful macOS-like design language","Curated AppCenter with Flatpak","Consistent, cohesive UI experience","Ethical pay-what-you-want model"],
    cons: ["Limited customization by design","Smaller app ecosystem","Not for power users or tinkerers"],
    website: "https://elementary.io",
    traits: { beginner: 9, gaming: 4, privacy: 5, dev: 5, server: 1, light: 5, custom: 2, stable: 8, latest: 3 },
    categories: ["beginner","desktop"], nvidiaSupport: "fair", immutable: false,
  },
  void: {
    name: "Void Linux", tagline: "Independent & lightweight", color: "#478061", icon: "🌑", difficulty: 4,
    desktop: ["Any (you choose)"], packageManager: "XBPS", releaseModel: "Rolling",
    description: "Fully independent distribution with its own package manager (xbps), init system (runit), and optional musl libc builds. No systemd. Fast, lean, and principled.",
    pros: ["Runit init (fast, simple, no systemd)","Very lightweight and fast","musl libc option for minimal footprint","Truly independent — no parent distro"],
    cons: ["Small community","Fewer packages than Arch or Debian","Limited documentation compared to Arch Wiki","DIY mentality required"],
    website: "https://voidlinux.org",
    traits: { beginner: 1, gaming: 4, privacy: 6, dev: 7, server: 5, light: 10, custom: 9, stable: 6, latest: 8 },
    categories: ["advanced","lightweight"], nvidiaSupport: "fair", immutable: false,
  },
  mxlinux: {
    name: "MX Linux", tagline: "Midweight simplicity", color: "#F37626", icon: "🔶", difficulty: 2,
    desktop: ["Xfce","KDE","Fluxbox"], packageManager: "APT (deb)", releaseModel: "Fixed (Debian Stable)",
    description: "A cooperative venture between antiX and MX communities. Excellent on older hardware with great built-in MX Tools suite. Based on Debian Stable for rock-solid reliability.",
    pros: ["Excellent on older hardware","Outstanding MX Tools suite","Debian Stable base for reliability","Active, helpful community"],
    cons: ["Default aesthetics are dated","Not for bleeding-edge software users","Less mainstream recognition"],
    website: "https://mxlinux.org",
    traits: { beginner: 8, gaming: 4, privacy: 5, dev: 5, server: 4, light: 9, custom: 6, stable: 9, latest: 3 },
    categories: ["beginner","desktop","lightweight"], nvidiaSupport: "fair", immutable: false,
  },
  antix: {
    name: "antiX", tagline: "Fast, lightweight, easy to install", color: "#D32F2F", icon: "🐜", difficulty: 2,
    desktop: ["IceWM","Fluxbox","JWM"], packageManager: "APT (deb)", releaseModel: "Fixed (Debian Stable)",
    description: "Ultra-lightweight Debian Stable derivative for very old hardware. Can run on 256MB RAM. Uses IceWM and Fluxbox window managers. No systemd.",
    pros: ["Runs on extremely old hardware (256MB RAM)","No systemd","Debian Stable packages","Very fast boot and operation"],
    cons: ["Dated appearance","Window managers require manual configuration","Not beginner-friendly UX","Limited multimedia out of box"],
    website: "https://antixlinux.com",
    traits: { beginner: 4, gaming: 1, privacy: 5, dev: 3, server: 2, light: 10, custom: 7, stable: 9, latest: 2 },
    categories: ["lightweight"], nvidiaSupport: "poor", immutable: false,
  },
  alpine: {
    name: "Alpine Linux", tagline: "Small. Simple. Secure.", color: "#0D597F", icon: "⛰️", difficulty: 4,
    desktop: ["Any (you choose)"], packageManager: "APK", releaseModel: "Fixed (6-month cycles)",
    description: "Security-oriented, lightweight distro built on musl libc and BusyBox. The de facto standard for Docker container base images. ~5MB base image. OpenRC init system.",
    pros: ["Tiny footprint (~5MB base)","Docker container standard","Security-hardened (PaX, SSP)","OpenRC init (simple, fast)"],
    cons: ["musl libc breaks some glibc-dependent software","Not desktop-friendly without effort","Smaller community","Limited desktop documentation"],
    website: "https://alpinelinux.org",
    traits: { beginner: 1, gaming: 1, privacy: 7, dev: 8, server: 9, light: 10, custom: 7, stable: 8, latest: 5 },
    categories: ["server","advanced","lightweight"], nvidiaSupport: "poor", immutable: false,
  },
  gentoo: {
    name: "Gentoo", tagline: "Compile everything, understand everything", color: "#54487A", icon: "🐄", difficulty: 5,
    desktop: ["Any (you choose)"], packageManager: "Portage (emerge)", releaseModel: "Rolling",
    description: "Source-based distribution where you compile every package with your chosen USE flags and optimizations. Maximum control over every binary running on your system.",
    pros: ["Compile-time optimizations via USE flags","Total system understanding and control","Extremely flexible","Excellent Gentoo Handbook documentation"],
    cons: ["Compilation takes hours or days","Steep learning curve","Time-intensive maintenance","Patience is mandatory"],
    website: "https://gentoo.org",
    traits: { beginner: 1, gaming: 5, privacy: 6, dev: 8, server: 6, light: 8, custom: 10, stable: 6, latest: 9 },
    categories: ["advanced"], nvidiaSupport: "fair", immutable: false,
  },
  rocky: {
    name: "Rocky Linux", tagline: "Enterprise-grade, community-driven", color: "#10B981", icon: "🪨", difficulty: 3,
    desktop: ["GNOME"], packageManager: "DNF (rpm)", releaseModel: "Fixed (follows RHEL, 10-year support)",
    description: "A 1:1 RHEL-compatible rebuild created after CentOS shifted to Stream. Built for production servers with 10-year support lifecycle. Co-founded by CentOS co-creator Gregory Kurtzer.",
    pros: ["Full RHEL compatibility","10-year support lifecycle","Free enterprise-grade Linux","Strong corporate adoption"],
    cons: ["Very old software by design","Not suitable for desktop daily use","Dependent on RHEL release timing","Minimal desktop polish"],
    website: "https://rockylinux.org",
    traits: { beginner: 3, gaming: 1, privacy: 5, dev: 5, server: 10, light: 4, custom: 3, stable: 10, latest: 1 },
    categories: ["server","enterprise"], nvidiaSupport: "fair", immutable: false,
  },
  alma: {
    name: "AlmaLinux", tagline: "Forever-free enterprise Linux", color: "#0F4880", icon: "🔷", difficulty: 3,
    desktop: ["GNOME"], packageManager: "DNF (rpm)", releaseModel: "Fixed (follows RHEL, 10-year support)",
    description: "Another RHEL-compatible rebuild, backed by CloudLinux Inc. ABI-compatible with RHEL for seamless enterprise migration. Strong cloud provider support.",
    pros: ["RHEL ABI compatibility","Backed by CloudLinux Inc.","Fast security patches","Wide cloud provider support (AWS, Azure, GCP)"],
    cons: ["Old packages by design","Not for desktop use","Similar to Rocky — community fragmentation","Dependent on RHEL releases"],
    website: "https://almalinux.org",
    traits: { beginner: 3, gaming: 1, privacy: 5, dev: 5, server: 10, light: 4, custom: 3, stable: 10, latest: 1 },
    categories: ["server","enterprise"], nvidiaSupport: "fair", immutable: false,
  },
  rhel: {
    name: "Red Hat Enterprise Linux", tagline: "The enterprise standard", color: "#EE0000", icon: "🎩", difficulty: 3,
    desktop: ["GNOME"], packageManager: "DNF (rpm)", releaseModel: "Fixed (10-year support)",
    description: "The commercial enterprise Linux standard. 10-year support, certified hardware/software ecosystem, and professional support from Red Hat (IBM). Free for up to 16 systems via developer subscription.",
    pros: ["Industry-standard enterprise Linux","10-year support with backported security","Certified hardware and software ecosystem","Free developer subscription (16 systems)"],
    cons: ["Paid subscription for production use","Very conservative package versions","Source code access controversies","Not for personal desktop use"],
    website: "https://redhat.com/en/technologies/linux-platforms/enterprise-linux",
    traits: { beginner: 2, gaming: 1, privacy: 5, dev: 6, server: 10, light: 3, custom: 3, stable: 10, latest: 1 },
    categories: ["server","enterprise"], nvidiaSupport: "fair", immutable: false,
  },
  bazzite: {
    name: "Bazzite", tagline: "SteamOS for every device", color: "#8B5CF6", icon: "🎮", difficulty: 2,
    desktop: ["KDE","GNOME"], packageManager: "rpm-ostree + Flatpak", releaseModel: "Rolling (immutable, image-based)",
    description: "An immutable Fedora Atomic-based gaming OS. Drop-in SteamOS replacement for desktops, HTPCs, and handhelds. Boots to Steam Big Picture or KDE/GNOME desktop. Part of the Universal Blue project.",
    pros: ["Console-like gaming experience","Immutable = rock-solid stability","Desktop, HTPC, and handheld editions","Automatic updates with rollback"],
    cons: ["Immutable model unfamiliar to traditional Linux users","Harder to customize than standard distros","Flatpak-only for apps (no native packages)","Relatively new project"],
    website: "https://bazzite.gg",
    traits: { beginner: 7, gaming: 10, privacy: 5, dev: 3, server: 1, light: 3, custom: 3, stable: 8, latest: 7 },
    categories: ["gaming","immutable"], nvidiaSupport: "excellent", immutable: true,
  },
  nobara: {
    name: "Nobara", tagline: "Fedora tuned for gaming", color: "#FF6B35", icon: "🌺", difficulty: 2,
    desktop: ["KDE","GNOME"], packageManager: "DNF (rpm) + Flatpak", releaseModel: "Fixed (follows Fedora)",
    description: "A Fedora fork by GloriousEggroll (the Proton-GE maintainer). Pre-configured with gaming tools, codecs, custom kernel optimizations, and falcond for per-game CPU tuning. KDE Plasma default.",
    pros: ["Pre-installed gaming stack (Steam, Lutris, Proton-GE)","Custom kernel with latency/performance tweaks","Codecs and drivers included out of box","Built by the Proton-GE maintainer"],
    cons: ["One-person passion project — bus factor risk","Updates lag behind vanilla Fedora","Lots of pre-installed software (perceived bloat)","Not officially affiliated with Fedora"],
    website: "https://nobaraproject.org",
    traits: { beginner: 7, gaming: 9, privacy: 5, dev: 6, server: 2, light: 4, custom: 5, stable: 6, latest: 7 },
    categories: ["gaming","desktop"], nvidiaSupport: "excellent", immutable: false,
  },
  garuda: {
    name: "Garuda Linux", tagline: "Performance Arch with flair", color: "#E91E63", icon: "🦅", difficulty: 3,
    desktop: ["KDE","GNOME","Xfce","Sway","i3","Hyprland"], packageManager: "Pacman + AUR", releaseModel: "Rolling",
    description: "An Arch-based distro with flashy aesthetics (Dragonized), gaming optimizations, Btrfs + Snapper snapshots, and pre-installed gaming tools. Mokka edition offers a calmer Catppuccin theme.",
    pros: ["Gaming Edition comes ready to play","Btrfs snapshots auto-created before updates","Multiple desktop editions including Dragonized","Performance-tuned kernel options"],
    cons: ["Flashy aesthetics not for minimalists","Arch-based — requires some maintenance","Lots of pre-installed software","Smaller community than EndeavourOS/Manjaro"],
    website: "https://garudalinux.org",
    traits: { beginner: 4, gaming: 9, privacy: 5, dev: 7, server: 3, light: 4, custom: 8, stable: 5, latest: 9 },
    categories: ["gaming","desktop"], nvidiaSupport: "good", immutable: false,
  },
  steamos: {
    name: "SteamOS", tagline: "Valve's gaming OS for Steam Deck", color: "#1B2838", icon: "🎮", difficulty: 2,
    desktop: ["KDE"], packageManager: "Flatpak (desktop)", releaseModel: "Rolling (immutable)",
    description: "Valve's Arch-based OS powering the Steam Deck. Boots to Game Mode (Big Picture) or a KDE Plasma desktop. Immutable base with Flatpak for desktop apps. SteamOS 3.6+ is current.",
    pros: ["Built specifically for gaming by Valve","Powers the Steam Deck","Console-like Game Mode experience","KDE desktop for productivity"],
    cons: ["Designed for Steam Deck hardware","Limited non-gaming software","Desktop mode is secondary focus","Not officially supported on non-Deck hardware"],
    website: "https://store.steampowered.com/steamos",
    traits: { beginner: 7, gaming: 10, privacy: 3, dev: 2, server: 0, light: 4, custom: 3, stable: 8, latest: 7 },
    categories: ["gaming"], nvidiaSupport: "poor", immutable: true,
  },
  solus: {
    name: "Solus", tagline: "Designed for home computing", color: "#5294E2", icon: "🌊", difficulty: 2,
    desktop: ["Budgie","GNOME","KDE","MATE"], packageManager: "eopkg", releaseModel: "Rolling (curated)",
    description: "An independent, curated rolling-release distro with its own Budgie desktop environment. Focuses on a polished desktop experience with careful package curation. Revived under new leadership in 2023.",
    pros: ["Beautiful Budgie desktop (created by Solus)","Curated rolling release — tested before shipping","Clean, focused desktop experience","Independent — no parent distro baggage"],
    cons: ["Smaller package repository","History of project leadership changes","Smaller community than major distros","eopkg is unique — no cross-distro skills"],
    website: "https://getsol.us",
    traits: { beginner: 7, gaming: 6, privacy: 5, dev: 5, server: 2, light: 5, custom: 5, stable: 7, latest: 6 },
    categories: ["beginner","desktop"], nvidiaSupport: "good", immutable: false,
  },
  kali: {
    name: "Kali Linux", tagline: "Penetration testing & security auditing", color: "#367BF0", icon: "🐉", difficulty: 3,
    desktop: ["Xfce","GNOME","KDE"], packageManager: "APT (deb)", releaseModel: "Rolling (Debian Testing)",
    description: "The industry-standard penetration testing distribution. Ships 600+ security tools pre-installed. Based on Debian Testing. Not designed as a daily-driver desktop OS.",
    pros: ["600+ pre-installed security tools","Industry standard for pentesting","Regular tool and kernel updates","Good documentation and training resources"],
    cons: ["Not designed for daily desktop use","Running as root by default was a past issue","Can be overwhelming for beginners","Misused by people who don't understand it"],
    website: "https://kali.org",
    traits: { beginner: 2, gaming: 2, privacy: 7, dev: 6, server: 2, light: 4, custom: 5, stable: 6, latest: 7 },
    categories: ["pentesting","security"], nvidiaSupport: "fair", immutable: false,
  },
  parrot: {
    name: "Parrot OS", tagline: "Security, privacy & development", color: "#00D4AA", icon: "🦜", difficulty: 3,
    desktop: ["MATE","KDE"], packageManager: "APT (deb)", releaseModel: "Rolling (Debian Testing)",
    description: "Security-focused Debian derivative with Home (privacy/daily use) and Security (pentesting) editions. Lighter than Kali and more suitable as a daily driver for security professionals.",
    pros: ["Home Edition works as a privacy daily driver","Lighter than Kali with similar security tools","AnonSurf for Tor integration","Good for security learning"],
    cons: ["Smaller community than Kali","Fewer guides and training resources","Pentesting tools overkill for most users","Based on Testing — occasional instability"],
    website: "https://parrotsec.org",
    traits: { beginner: 3, gaming: 2, privacy: 8, dev: 6, server: 2, light: 5, custom: 5, stable: 6, latest: 6 },
    categories: ["security","pentesting","privacy"], nvidiaSupport: "fair", immutable: false,
  },
  kubuntu: {
    name: "Kubuntu", tagline: "KDE Plasma on Ubuntu", color: "#0074D9", icon: "🔵", difficulty: 1,
    desktop: ["KDE"], packageManager: "APT (deb) + Snap", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "Official Ubuntu flavor featuring KDE Plasma desktop. Same Ubuntu base with LTS support but a more customizable, Windows-like interface. KDE Plasma 6+ on 24.04.",
    pros: ["Full Ubuntu compatibility","KDE Plasma's extensive customization","LTS support cycle","Familiar Windows-like layout"],
    cons: ["KDE can feel complex for beginners","Snap packages in base install","Smaller community than mainline Ubuntu","Can be heavier than GNOME on some hardware"],
    website: "https://kubuntu.org",
    traits: { beginner: 8, gaming: 7, privacy: 5, dev: 7, server: 5, light: 4, custom: 8, stable: 8, latest: 5 },
    categories: ["beginner","desktop"], nvidiaSupport: "good", immutable: false,
  },
  xubuntu: {
    name: "Xubuntu", tagline: "Elegant and easy to use", color: "#2A96E7", icon: "🐭", difficulty: 1,
    desktop: ["Xfce"], packageManager: "APT (deb) + Snap", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "Official Ubuntu flavor with Xfce desktop. Lighter than GNOME while maintaining full Ubuntu compatibility. Good for mid-range and older hardware.",
    pros: ["Lighter than GNOME Ubuntu","Full Ubuntu compatibility","Xfce is fast and stable","Good for older hardware"],
    cons: ["Xfce looks dated to some users","Fewer modern DE features than KDE/GNOME","Smaller community than mainline Ubuntu","Less polished out of box"],
    website: "https://xubuntu.org",
    traits: { beginner: 8, gaming: 6, privacy: 5, dev: 6, server: 4, light: 7, custom: 6, stable: 8, latest: 5 },
    categories: ["beginner","desktop","lightweight"], nvidiaSupport: "good", immutable: false,
  },
  lubuntu: {
    name: "Lubuntu", tagline: "Lightweight Ubuntu with LXQt", color: "#0067C0", icon: "🪶", difficulty: 1,
    desktop: ["LXQt"], packageManager: "APT (deb) + Snap", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "Official Ubuntu flavor targeting older computers and resource-constrained hardware. Uses LXQt desktop environment for minimal resource usage while keeping Ubuntu compatibility.",
    pros: ["Very low resource usage","Full Ubuntu package compatibility","LXQt is fast and functional","Ideal for repurposing old hardware"],
    cons: ["LXQt is basic — fewer features","Less polished visually","Smaller user community","Some tasks require manual configuration"],
    website: "https://lubuntu.me",
    traits: { beginner: 7, gaming: 4, privacy: 5, dev: 5, server: 3, light: 9, custom: 5, stable: 8, latest: 5 },
    categories: ["beginner","lightweight"], nvidiaSupport: "good", immutable: false,
  },
  ubuntu_mate: {
    name: "Ubuntu MATE", tagline: "Traditional desktop for everyone", color: "#87A556", icon: "🟤", difficulty: 1,
    desktop: ["MATE"], packageManager: "APT (deb) + Snap", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "Official Ubuntu flavor with the MATE desktop — a continuation of GNOME 2. Traditional desktop layout that's intuitive and resource-efficient. Great Raspberry Pi support.",
    pros: ["Traditional, intuitive desktop layout","Lower resource use than GNOME","Excellent Raspberry Pi support","Highly customizable panel layouts"],
    cons: ["MATE looks dated to some","Smaller community than mainline","Fewer modern DE features","Wayland support still in progress"],
    website: "https://ubuntu-mate.org",
    traits: { beginner: 8, gaming: 5, privacy: 5, dev: 6, server: 4, light: 7, custom: 6, stable: 8, latest: 5 },
    categories: ["beginner","desktop","lightweight"], nvidiaSupport: "good", immutable: false,
  },
  kde_neon: {
    name: "KDE neon", tagline: "Latest KDE on stable Ubuntu", color: "#1D99F3", icon: "💠", difficulty: 2,
    desktop: ["KDE"], packageManager: "APT (deb)", releaseModel: "Fixed base + rolling KDE",
    description: "The latest KDE Plasma desktop on a stable Ubuntu LTS base. Maintained by the KDE project itself. You always get the newest KDE on release day, with Ubuntu's rock-solid foundation.",
    pros: ["Absolute latest KDE on release day","Maintained by KDE developers themselves","Stable Ubuntu LTS base","Best showcase of KDE Plasma"],
    cons: ["Only KDE Plasma — no alternatives","Not a full distro — focused on KDE showcase","Smaller community","Base Ubuntu packages can be old"],
    website: "https://neon.kde.org",
    traits: { beginner: 6, gaming: 6, privacy: 5, dev: 6, server: 2, light: 4, custom: 8, stable: 7, latest: 8 },
    categories: ["desktop"], nvidiaSupport: "good", immutable: false,
  },
  deepin: {
    name: "deepin", tagline: "Beautiful and intuitive", color: "#0078D7", icon: "🌊", difficulty: 1,
    desktop: ["DDE"], packageManager: "APT (deb)", releaseModel: "Fixed (based on Debian)",
    description: "Chinese-developed distribution with the stunning Deepin Desktop Environment (DDE). Known for some of the most beautiful default aesthetics in Linux. Based on Debian Stable.",
    pros: ["Arguably the most beautiful Linux desktop","Unique Deepin Desktop Environment","Very beginner-friendly UX","Good hardware compatibility"],
    cons: ["Chinese origin raises privacy concerns for some","DDE can be resource-heavy","Smaller global community","Some telemetry concerns historically"],
    website: "https://deepin.org",
    traits: { beginner: 8, gaming: 4, privacy: 3, dev: 5, server: 2, light: 3, custom: 4, stable: 7, latest: 4 },
    categories: ["beginner","desktop"], nvidiaSupport: "fair", immutable: false,
  },
  artix: {
    name: "Artix Linux", tagline: "Arch without systemd", color: "#5090C8", icon: "🌀", difficulty: 4,
    desktop: ["Any (you choose)"], packageManager: "Pacman + AUR", releaseModel: "Rolling",
    description: "An Arch Linux fork that replaces systemd with your choice of runit, OpenRC, s6, or dinit. For users who want Arch's rolling packages and AUR without systemd.",
    pros: ["Arch packages and AUR without systemd","Choice of init: runit, OpenRC, s6, dinit","Rolling release","Good for systemd-free purists"],
    cons: ["Some Arch packages need systemd patches","Smaller community than Arch","AUR packages may assume systemd","Requires more manual intervention"],
    website: "https://artixlinux.org",
    traits: { beginner: 1, gaming: 6, privacy: 7, dev: 7, server: 4, light: 7, custom: 9, stable: 5, latest: 9 },
    categories: ["advanced"], nvidiaSupport: "fair", immutable: false,
  },
  slackware: {
    name: "Slackware", tagline: "The oldest surviving distro", color: "#303030", icon: "🖥️", difficulty: 5,
    desktop: ["KDE","Xfce"], packageManager: "pkgtools (tgz/txz)", releaseModel: "Fixed (irregular, ~3-5 year cycles)",
    description: "The oldest actively maintained Linux distribution (since 1993). BSD-style init, no automatic dependency resolution, and a philosophy of simplicity and Unix tradition.",
    pros: ["Oldest surviving distro — 30+ years","Pure Unix philosophy","Extremely stable","No dependency auto-resolution — you learn everything"],
    cons: ["No automatic dependency resolution","Very manual setup and maintenance","Irregular release schedule","Tiny community by modern standards"],
    website: "https://slackware.com",
    traits: { beginner: 1, gaming: 3, privacy: 6, dev: 5, server: 5, light: 6, custom: 8, stable: 8, latest: 3 },
    categories: ["advanced"], nvidiaSupport: "fair", immutable: false,
  },
  pclinuxos: {
    name: "PCLinuxOS", tagline: "Radically simple", color: "#3D6EB6", icon: "💻", difficulty: 2,
    desktop: ["KDE","MATE","Xfce"], packageManager: "APT-RPM", releaseModel: "Rolling",
    description: "A rolling-release, RPM-based distro with KDE Plasma as the primary desktop. Focuses on providing a simple, out-of-the-box experience. Loyal, long-standing community.",
    pros: ["Smooth rolling release","Excellent KDE implementation","Strong out-of-box experience","Loyal, dedicated community"],
    cons: ["64-bit only","Smaller package repository","Less mainstream visibility","Slower to adopt newest technologies"],
    website: "https://pclinuxos.com",
    traits: { beginner: 7, gaming: 5, privacy: 5, dev: 5, server: 3, light: 5, custom: 6, stable: 7, latest: 6 },
    categories: ["desktop"], nvidiaSupport: "fair", immutable: false,
  },
  peppermint: {
    name: "Peppermint OS", tagline: "Ice-cool lightweight Linux", color: "#C0392B", icon: "🍬", difficulty: 1,
    desktop: ["Xfce"], packageManager: "APT (deb)", releaseModel: "Fixed (Debian Stable)",
    description: "A lightweight Debian-based distro using Xfce. Designed for cloud-centric workflows and web applications. Very low resource footprint with a clean, minimal interface.",
    pros: ["Very lightweight and fast","Good for cloud/web workflows","Clean, minimal interface","Debian Stable base for reliability"],
    cons: ["Limited pre-installed applications","Xfce desktop may feel basic","Smaller community","Not much beyond lightweight browsing"],
    website: "https://peppermintos.com",
    traits: { beginner: 7, gaming: 2, privacy: 5, dev: 3, server: 2, light: 9, custom: 4, stable: 8, latest: 3 },
    categories: ["lightweight","beginner"], nvidiaSupport: "fair", immutable: false,
  },
  bodhi: {
    name: "Bodhi Linux", tagline: "Enlightenment meets Ubuntu", color: "#4CAF50", icon: "🌿", difficulty: 2,
    desktop: ["Moksha"], packageManager: "APT (deb)", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "A minimal Ubuntu LTS-based distro featuring the Moksha desktop (fork of Enlightenment). Extremely lightweight while offering a unique, customizable desktop experience.",
    pros: ["Extremely lightweight (Moksha desktop)","Ubuntu LTS compatibility","Unique, attractive desktop","Runs on very old hardware"],
    cons: ["Moksha/Enlightenment learning curve","Small community","Limited software pre-installed","Niche desktop environment"],
    website: "https://bodhilinux.com",
    traits: { beginner: 5, gaming: 3, privacy: 5, dev: 4, server: 2, light: 9, custom: 7, stable: 8, latest: 3 },
    categories: ["lightweight"], nvidiaSupport: "fair", immutable: false,
  },
  puppy: {
    name: "Puppy Linux", tagline: "Small, fast, runs in RAM", color: "#FF9800", icon: "🐶", difficulty: 3,
    desktop: ["JWM","Openbox"], packageManager: "PET / SFS packages", releaseModel: "Fixed (various puplets)",
    description: "An ultra-lightweight family of distros that load entirely into RAM. Boots from USB/CD in seconds on ancient hardware. Saves session to a persistent file. Incredibly fast once loaded.",
    pros: ["Entire OS runs in RAM — blazing fast","Boots on ancient hardware (128MB RAM)","Portable — runs from USB/CD","Saves session to persistent file"],
    cons: ["Unconventional package management","Dated interface","Not suitable for modern desktop workflows","Running as root by default"],
    website: "https://puppylinux-woof-ce.github.io",
    traits: { beginner: 4, gaming: 1, privacy: 4, dev: 2, server: 1, light: 10, custom: 5, stable: 6, latest: 2 },
    categories: ["lightweight"], nvidiaSupport: "poor", immutable: false,
  },
  sparky: {
    name: "SparkyLinux", tagline: "Fast, lightweight, fully customizable", color: "#D32F2F", icon: "⚡", difficulty: 2,
    desktop: ["LXQt","KDE","Xfce","MATE","Openbox"], packageManager: "APT (deb)", releaseModel: "Fixed (Stable) or Rolling (Testing)",
    description: "A Debian-based distro available in Stable and Rolling (Debian Testing) editions. Offers multiple desktop environments and a \"MinimalGUI\" for advanced users to build from scratch.",
    pros: ["Choice of Stable or Rolling","Multiple DE options","Good Gaming/Multimedia editions","Lightweight options available"],
    cons: ["Less polished than Ubuntu derivatives","Smaller community","Rolling edition can have Debian Testing issues","Less documentation than MX Linux"],
    website: "https://sparkylinux.org",
    traits: { beginner: 6, gaming: 5, privacy: 5, dev: 5, server: 3, light: 7, custom: 7, stable: 7, latest: 5 },
    categories: ["desktop","lightweight"], nvidiaSupport: "fair", immutable: false,
  },
  bunsenlabs: {
    name: "BunsenLabs", tagline: "A light-weight Openbox desktop", color: "#505050", icon: "🔥", difficulty: 3,
    desktop: ["Openbox"], packageManager: "APT (deb)", releaseModel: "Fixed (Debian Stable)",
    description: "Successor to CrunchBang. A minimalist Debian-based distro with preconfigured Openbox window manager, tint2 panel, and conky. For users who love a clean, keyboard-driven workflow.",
    pros: ["Beautiful preconfigured Openbox","Extremely lightweight","Keyboard-driven workflow","Debian Stable reliability"],
    cons: ["Openbox requires learning","Not for beginners","Small community","Very DIY for anything beyond basics"],
    website: "https://bunsenlabs.org",
    traits: { beginner: 2, gaming: 2, privacy: 5, dev: 5, server: 2, light: 9, custom: 8, stable: 9, latest: 2 },
    categories: ["lightweight","advanced"], nvidiaSupport: "fair", immutable: false,
  },
  mageia: {
    name: "Mageia", tagline: "Mandriva's community successor", color: "#2397D4", icon: "🟦", difficulty: 2,
    desktop: ["KDE","GNOME","Xfce"], packageManager: "DNF/urpmi (rpm)", releaseModel: "Fixed (annual)",
    description: "A community fork of the historic Mandriva Linux. Features the Mageia Control Center (MCC) for system administration and a friendly, community-driven development process.",
    pros: ["Mageia Control Center for easy admin","Mandriva heritage","Community-driven governance","Multiple DE options"],
    cons: ["Declining community activity","Fewer packages than major distros","Less modern than peers","Uncertain long-term future"],
    website: "https://mageia.org",
    traits: { beginner: 6, gaming: 4, privacy: 5, dev: 5, server: 4, light: 5, custom: 5, stable: 7, latest: 4 },
    categories: ["desktop"], nvidiaSupport: "fair", immutable: false,
  },
  tinycore: {
    name: "Tiny Core Linux", tagline: "The smallest usable Linux", color: "#1565C0", icon: "🔬", difficulty: 5,
    desktop: ["FLTK/Flwm"], packageManager: "TCZ extensions", releaseModel: "Fixed",
    description: "A minimal Linux distribution at just 11MB (Core) or 23MB (TinyCore with GUI). Loads entirely into RAM, with extensions loaded on demand. An educational tool and embedded systems platform.",
    pros: ["Incredibly tiny (11-23MB)","Loads entirely into RAM","Extremely fast boot","Educational — learn how Linux works"],
    cons: ["Not for daily use","Minimal pre-installed software","Unique extension system to learn","Very small community"],
    website: "http://tinycorelinux.net",
    traits: { beginner: 1, gaming: 0, privacy: 4, dev: 3, server: 2, light: 10, custom: 6, stable: 6, latest: 3 },
    categories: ["lightweight","advanced"], nvidiaSupport: "poor", immutable: false,
  },
  openmandriva: {
    name: "OpenMandriva", tagline: "Clang-built innovation", color: "#2962FF", icon: "🌟", difficulty: 2,
    desktop: ["KDE"], packageManager: "DNF (rpm)", releaseModel: "Rolling (ROME) or Fixed (Rock)",
    description: "The direct continuation of Mandriva Linux. Notable for being one of the few distros built entirely with Clang/LLVM. Offers ROME (rolling) and Rock (stable) editions with KDE Plasma.",
    pros: ["Clang/LLVM-compiled for potential performance gains","Choice of rolling or stable","Good KDE implementation","Mandriva heritage with modern approach"],
    cons: ["Very small community","Limited documentation","Fewer packages than major distros","Niche appeal"],
    website: "https://openmandriva.org",
    traits: { beginner: 5, gaming: 4, privacy: 5, dev: 5, server: 3, light: 5, custom: 5, stable: 6, latest: 7 },
    categories: ["desktop"], nvidiaSupport: "fair", immutable: false,
  },
  calculate: {
    name: "Calculate Linux", tagline: "Gentoo for the workplace", color: "#52148C", icon: "🧮", difficulty: 3,
    desktop: ["KDE","Cinnamon","MATE","Xfce","LXQt"], packageManager: "Portage + binary overlay", releaseModel: "Rolling",
    description: "A Gentoo-based distribution pre-configured for desktop, server, and enterprise use. Provides binary packages so you don't need to compile from source like vanilla Gentoo.",
    pros: ["Gentoo base without mandatory compilation","Multiple ready-made editions","Server and desktop variants","LDAP/Active Directory integration"],
    cons: ["Small community outside Russia","Limited English documentation","Gentoo knowledge still helpful","Niche distribution"],
    website: "https://calculate-linux.org",
    traits: { beginner: 3, gaming: 4, privacy: 5, dev: 6, server: 7, light: 5, custom: 7, stable: 6, latest: 7 },
    categories: ["server","desktop"], nvidiaSupport: "fair", immutable: false,
  },
  arcolinux: {
    name: "ArcoLinux", tagline: "Learn Arch, step by step", color: "#40C4FF", icon: "📘", difficulty: 3,
    desktop: ["Xfce","Openbox","i3","many others"], packageManager: "Pacman + AUR", releaseModel: "Rolling",
    description: "An educational Arch-based project with three tiers: ArcoLinux (full), ArcoLinuxD (minimal), and ArcoLinuxB (build your own). Extensive video tutorials for learning Arch.",
    pros: ["Extensive learning resources and videos","Three tiers from easy to advanced","Great stepping stone to pure Arch","Active YouTube channel with tutorials"],
    cons: ["Learning-focused — not a production distro","Can be overwhelming with options","Not widely used outside education","Frequent ISO releases to track"],
    website: "https://arcolinux.com",
    traits: { beginner: 4, gaming: 5, privacy: 5, dev: 6, server: 2, light: 5, custom: 8, stable: 5, latest: 9 },
    categories: ["education","desktop"], nvidiaSupport: "good", immutable: false,
  },
  trisquel: {
    name: "Trisquel", tagline: "100% free software", color: "#0080C0", icon: "🕊️", difficulty: 2,
    desktop: ["MATE"], packageManager: "APT (deb)", releaseModel: "Fixed (follows Ubuntu LTS)",
    description: "An FSF-endorsed fully free distribution based on Ubuntu LTS. Ships only libre software — no proprietary firmware, drivers, or codecs. For free software purists.",
    pros: ["FSF-endorsed — 100% free software","Ubuntu LTS stability","Ethical computing choice","MATE desktop is reliable"],
    cons: ["No proprietary drivers (WiFi, GPU issues)","Limited multimedia codec support","Very small community","Hardware compatibility challenges"],
    website: "https://trisquel.info",
    traits: { beginner: 5, gaming: 1, privacy: 7, dev: 4, server: 3, light: 6, custom: 4, stable: 8, latest: 3 },
    categories: ["desktop","privacy"], nvidiaSupport: "poor", immutable: false,
  },
  guix: {
    name: "GNU Guix System", tagline: "Reproducible, hackable, libre", color: "#FFB300", icon: "🐃", difficulty: 5,
    desktop: ["Any (you choose)"], packageManager: "Guix", releaseModel: "Rolling",
    description: "An advanced distribution from the GNU Project using the Guix package manager (like Nix but using Guile Scheme). Fully reproducible, transactional, and 100% free software.",
    pros: ["Fully reproducible builds","Transactional upgrades and rollbacks","Guile Scheme config (more readable than Nix)","FSF-endorsed — 100% free software"],
    cons: ["Very steep learning curve","No proprietary software in repos","Small community","Hardware support limited by libre policy"],
    website: "https://guix.gnu.org",
    traits: { beginner: 0, gaming: 1, privacy: 7, dev: 8, server: 5, light: 5, custom: 9, stable: 7, latest: 7 },
    categories: ["advanced","developer"], nvidiaSupport: "poor", immutable: false,
  },
  vanillaos: {
    name: "Vanilla OS", tagline: "Vanilla experience, immutable by design", color: "#FFAB00", icon: "🍦", difficulty: 2,
    desktop: ["GNOME"], packageManager: "Apx (multi-distro containers) + Flatpak", releaseModel: "Fixed",
    description: "An immutable Ubuntu-based distro using the Vib image builder and ABRoot for atomic transactions. Apx package manager can install from any distro's repos via containers.",
    pros: ["Immutable with atomic updates","Apx can install packages from any distro","Clean, unmodified GNOME experience","Innovative approach to package management"],
    cons: ["Young project (2022)","Small community","Immutable model has learning curve","Limited real-world track record"],
    website: "https://vanillaos.org",
    traits: { beginner: 5, gaming: 4, privacy: 5, dev: 5, server: 2, light: 4, custom: 3, stable: 7, latest: 6 },
    categories: ["desktop","immutable"], nvidiaSupport: "fair", immutable: true,
  },
  nitrux: {
    name: "Nitrux", tagline: "Beautiful and immutable", color: "#2196F3", icon: "💎", difficulty: 2,
    desktop: ["KDE (NX Desktop)"], packageManager: "APT + AppImage + Flatpak", releaseModel: "Fixed (quarterly)",
    description: "A Debian-based immutable distribution featuring the NX Desktop (customized KDE Plasma) and MauiKit applications. Beautiful defaults with a focus on AppImages and Flatpak.",
    pros: ["Stunning default KDE customization","AppImage-focused app delivery","Immutable root for stability","OpenRC init (no systemd)"],
    cons: ["Non-standard package management","Small development team","OpenRC can cause compatibility issues","Learning curve for NX Desktop specifics"],
    website: "https://nxos.org",
    traits: { beginner: 5, gaming: 4, privacy: 5, dev: 5, server: 2, light: 4, custom: 5, stable: 7, latest: 5 },
    categories: ["desktop","immutable"], nvidiaSupport: "fair", immutable: true,
  },
};
const DISTRO_COUNT = 57;


/* ═══════════════════════════════════════════════
   DECISION TREE ENGINE
   Expanded: security/pentesting, gaming (bazzite/cachyos/nobara/garuda),
   privacy (qubes/whonix), lightweight (antix/lubuntu), KDE paths (kubuntu)
   ═══════════════════════════════════════════════ */

const TREE = {
  root: {
    id: "experience", question: "What's your experience with Linux?",
    subtitle: "This helps us calibrate everything else",
    options: [
      { label: "Complete beginner", sublabel: "Never used Linux before", value: "beginner", next: "purpose" },
      { label: "Tried it briefly", sublabel: "Live USB or dual boot once", value: "dabbler", next: "purpose" },
      { label: "Comfortable user", sublabel: "Used Linux for a while", value: "intermediate", next: "purpose" },
      { label: "Power user", sublabel: "Terminal is my home", value: "advanced", next: "purpose" },
    ],
  },
  purpose: {
    id: "purpose", question: "What will you primarily use it for?",
    subtitle: "This determines which questions we ask next",
    options: [
      { label: "Daily desktop", sublabel: "Browsing, office, media", value: "desktop", next: "_route_desktop" },
      { label: "Software development", sublabel: "Coding, containers, tools", value: "development", next: "_route_dev" },
      { label: "Gaming", sublabel: "Steam, Proton, performance", value: "gaming", next: "gpu" },
      { label: "Server / Self-hosting", sublabel: "Web servers, homelab, Docker", value: "server", next: "_route_server" },
      { label: "Security / Pentesting", sublabel: "Ethical hacking, forensics, privacy tools", value: "security", next: "_route_security" },
    ],
  },
  gpu: {
    id: "gpu", question: "Do you have an NVIDIA graphics card?",
    subtitle: "NVIDIA needs special driver support on Linux",
    options: [
      { label: "Yes, NVIDIA", sublabel: "GeForce, Quadro, or similar", value: "nvidia", next: "_route_gaming" },
      { label: "AMD / Intel", sublabel: "Radeon, Arc, or integrated", value: "amd_intel", next: "_route_gaming" },
      { label: "Not sure", sublabel: "I'll figure it out later", value: "gpu_unknown", next: "_route_gaming" },
    ],
  },
  priority_desktop: {
    id: "priority", question: "What matters most to you?",
    subtitle: "Your top priority in a daily driver",
    options: [
      { label: "Stability & reliability", sublabel: "It should just work", value: "stability", next: "_route_desktop_prio" },
      { label: "Latest software", sublabel: "Bleeding edge packages", value: "latest", next: "_route_desktop_prio" },
      { label: "Privacy & security", sublabel: "Control over my data", value: "privacy", next: "_route_desktop_privacy" },
      { label: "Customization & control", sublabel: "Make it truly mine", value: "customization", next: "_route_desktop_prio" },
    ],
  },
  priority_server: {
    id: "priority", question: "What matters most for your server?",
    subtitle: "Your top priority for a server OS",
    options: [
      { label: "Maximum stability", sublabel: "Long-term support, never breaks", value: "stability", next: "_resolve_server" },
      { label: "Latest packages", sublabel: "Cutting-edge server software", value: "latest", next: "_resolve_server" },
      { label: "Customization", sublabel: "Build it exactly how I want", value: "customization", next: "hardware_server" },
      { label: "Privacy & security", sublabel: "Hardened, minimal attack surface", value: "privacy", next: "_resolve_server" },
    ],
  },
  priority_dev: {
    id: "priority", question: "What matters most for development?",
    subtitle: "Your top priority as a developer",
    options: [
      { label: "Stability", sublabel: "Reliable environment, no surprises", value: "stability", next: "_resolve_dev" },
      { label: "Latest tools", sublabel: "Newest compilers, runtimes, packages", value: "latest", next: "_resolve_dev" },
      { label: "Full customization", sublabel: "Control every aspect of the system", value: "customization", next: "_resolve_dev" },
      { label: "Privacy", sublabel: "Secure, private development environment", value: "privacy", next: "_resolve_dev" },
    ],
  },
  priority_gaming: {
    id: "priority", question: "What else matters to you besides gaming?",
    subtitle: "Your secondary priority",
    options: [
      { label: "Easy setup", sublabel: "Just install and play", value: "stability", next: "_resolve_gaming" },
      { label: "Latest everything", sublabel: "Newest drivers, kernels, Mesa", value: "latest", next: "_resolve_gaming" },
      { label: "Customization", sublabel: "Tweak performance to the max", value: "customization", next: "_resolve_gaming" },
    ],
  },
  hardware_desktop: {
    id: "hardware", question: "What kind of hardware are you running?",
    subtitle: "This affects which distros will run smoothly",
    options: [
      { label: "Modern & powerful", sublabel: "Recent CPU, 8GB+ RAM, SSD", value: "powerful", next: "_route_desktop_hw" },
      { label: "Mid-range / Average", sublabel: "A few years old, decent specs", value: "midrange", next: "_route_desktop_hw" },
      { label: "Old / Low-spec", sublabel: "Limited RAM, older CPU", value: "lowspec", next: "_route_desktop_lowspec" },
    ],
  },
  hardware_server: {
    id: "hardware", question: "What are your server's resources?",
    subtitle: "This determines lightweight vs full-featured options",
    options: [
      { label: "Standard / Cloud", sublabel: "Decent RAM, modern CPU or VPS", value: "powerful", next: "_resolve_server_custom" },
      { label: "Constrained / Embedded", sublabel: "Raspberry Pi, IoT, minimal resources", value: "lowspec", next: "_resolve_server_custom" },
    ],
  },
  migration: {
    id: "migration", question: "Where are you coming from?",
    subtitle: "We'll match you with something that feels familiar",
    options: [
      { label: "Windows", sublabel: "Familiar with the Windows desktop", value: "windows", next: "_resolve_desktop_migration" },
      { label: "macOS", sublabel: "Coming from the Apple ecosystem", value: "macos", next: "_resolve_desktop_migration" },
      { label: "ChromeOS / Other", sublabel: "Something else entirely", value: "other_os", next: "_resolve_desktop_migration" },
    ],
  },
};

function resolveRoute(routeId, answers) {
  const exp = answers.experience;
  const priority = answers.priority;
  const hardware = answers.hardware;
  const gpu = answers.gpu;
  const migration = answers.migration;
  const isNewbie = exp === "beginner" || exp === "dabbler";
  const isAdvanced = exp === "advanced";

  switch (routeId) {
    case "_route_desktop": return { next: "priority_desktop" };
    case "_route_dev": return { next: "priority_dev" };
    case "_route_server": return { next: "priority_server" };
    case "_route_gaming": return { next: "priority_gaming" };

    case "_route_security":
      if (isNewbie) return { leaf: ["parrot", "kali", "ubuntu"], reason: "you want to learn security \u2014 Parrot Home is friendlier for beginners, Kali is the industry standard" };
      if (isAdvanced) return { leaf: ["kali", "qubes", "parrot"], reason: "you're experienced enough for professional pentesting and compartmentalized security" };
      return { leaf: ["kali", "parrot", "fedora"], reason: "you want a solid security toolkit with good community support" };

    case "_route_desktop_prio":
      if (isAdvanced) return resolveRoute("_resolve_desktop_advanced", answers);
      return { next: "hardware_desktop" };

    case "_route_desktop_privacy":
      if (isNewbie) return { next: "hardware_desktop" };
      if (isAdvanced) return { leaf: ["qubes", "tails", "whonix"], reason: "you have the expertise for the strongest privacy and security tools available" };
      return { leaf: ["tails", "fedora", "debian"], reason: "privacy is your overriding concern and you have experience with specialized tools" };

    case "_route_desktop_hw":
      if (isAdvanced) return resolveRoute("_resolve_desktop_advanced", answers);
      return { next: "migration" };

    case "_route_desktop_lowspec":
      if (isAdvanced) return { leaf: ["void", "antix", "alpine"], reason: "you want full control on lightweight hardware" };
      if (isNewbie) return { next: "migration" };
      return { leaf: ["mxlinux", "antix", "xubuntu"], reason: "you need a capable system on limited hardware" };

    case "_resolve_desktop_migration": {
      if (hardware === "lowspec") {
        if (migration === "windows") return { leaf: ["mxlinux", "lubuntu", "zorin"], reason: "you want a Windows-like experience on lightweight hardware" };
        return { leaf: ["mxlinux", "lubuntu", "xubuntu"], reason: "you need a lightweight, beginner-friendly system" };
      }
      if (priority === "stability") {
        if (migration === "macos") return { leaf: ["elementary", "zorin", "ubuntu"], reason: "you want a stable, macOS-like experience" };
        if (migration === "windows") return { leaf: ["mint", "zorin", "kubuntu"], reason: "you want a stable, familiar desktop coming from Windows" };
        return { leaf: ["mint", "ubuntu", "zorin"], reason: "you want a stable, easy-to-use desktop" };
      }
      if (priority === "latest") {
        if (migration === "macos") return { leaf: ["fedora", "elementary", "ubuntu"], reason: "you want modern software with a polished experience" };
        return { leaf: ["fedora", "ubuntu", "popos"], reason: "you want up-to-date software in a beginner-friendly package" };
      }
      if (priority === "customization") {
        if (migration === "windows") return { leaf: ["kubuntu", "manjaro", "fedora"], reason: "you want KDE's customization with a Windows-like layout" };
        return { leaf: ["manjaro", "fedora", "solus"], reason: "you want customization options while keeping things approachable" };
      }
      if (priority === "privacy") {
        if (migration === "macos") return { leaf: ["fedora", "elementary", "ubuntu"], reason: "you want a privacy-respecting, polished desktop" };
        return { leaf: ["fedora", "mint", "ubuntu"], reason: "you want a privacy-respecting, friendly desktop" };
      }
      return { leaf: ["ubuntu", "mint", "zorin"], reason: "you want a reliable, easy-to-use Linux desktop" };
    }

    case "_resolve_desktop_advanced": {
      if (priority === "customization") return { leaf: ["arch", "endeavouros", "gentoo"], reason: "you want maximum control over every aspect of your system" };
      if (priority === "latest") return { leaf: ["arch", "cachyos", "fedora"], reason: "you want the absolute latest packages with full control" };
      if (priority === "stability") return { leaf: ["debian", "opensuse", "fedora"], reason: "you want rock-solid stability with power-user capabilities" };
      if (priority === "privacy") return { leaf: ["qubes", "tails", "whonix"], reason: "you have the skills for the strongest privacy tools available" };
      return { leaf: ["arch", "fedora", "nixos"], reason: "you're a power user who wants a cutting-edge desktop" };
    }

    case "_resolve_server": {
      if (isNewbie) {
        if (priority === "stability") return { leaf: ["ubuntu", "debian", "rocky"], reason: "you need a stable, beginner-friendly server platform" };
        if (priority === "latest") return { leaf: ["ubuntu", "fedora", "debian"], reason: "you want recent server software with good documentation" };
        if (priority === "privacy") return { leaf: ["debian", "ubuntu", "alpine"], reason: "you want a privacy-focused server manageable for newcomers" };
        return { leaf: ["ubuntu", "debian", "rocky"], reason: "you need a reliable server with great community support" };
      }
      if (priority === "stability") return { leaf: ["debian", "rocky", "alma"], reason: "you want proven, enterprise-grade server stability" };
      if (priority === "latest") return { leaf: ["nixos", "fedora", "opensuse"], reason: "you want cutting-edge server software with modern tooling" };
      if (priority === "privacy") return { leaf: ["debian", "alpine", "opensuse"], reason: "you want a security-hardened server platform" };
      return { leaf: ["debian", "rocky", "opensuse"], reason: "you need a professional-grade server platform" };
    }

    case "_resolve_server_custom": {
      if (hardware === "lowspec") return { leaf: ["alpine", "void", "debian"], reason: "you want a customizable, minimal-footprint server" };
      return { leaf: ["nixos", "arch", "debian"], reason: "you want full control over your server configuration" };
    }

    case "_resolve_dev": {
      if (isAdvanced) {
        if (priority === "customization") return { leaf: ["nixos", "arch", "gentoo"], reason: "you want a fully customizable development environment" };
        if (priority === "latest") return { leaf: ["arch", "fedora", "cachyos"], reason: "you want the newest dev tools available immediately" };
        if (priority === "stability") return { leaf: ["debian", "nixos", "opensuse"], reason: "you want a rock-solid development environment" };
        if (priority === "privacy") return { leaf: ["nixos", "debian", "fedora"], reason: "you want a private, powerful development setup" };
        return { leaf: ["fedora", "nixos", "arch"], reason: "you want a cutting-edge development platform" };
      }
      if (exp === "intermediate") {
        if (priority === "latest") return { leaf: ["fedora", "manjaro", "cachyos"], reason: "you want up-to-date dev tools with moderate complexity" };
        if (priority === "stability") return { leaf: ["ubuntu", "fedora", "opensuse"], reason: "you want a stable dev environment" };
        if (priority === "customization") return { leaf: ["manjaro", "fedora", "endeavouros"], reason: "you want a customizable dev setup" };
        return { leaf: ["fedora", "ubuntu", "popos"], reason: "you want a well-rounded development platform" };
      }
      if (priority === "latest") return { leaf: ["fedora", "ubuntu", "popos"], reason: "you want modern dev tools in a beginner-friendly package" };
      if (priority === "stability") return { leaf: ["ubuntu", "mint", "popos"], reason: "you want a stable environment to learn development" };
      return { leaf: ["ubuntu", "popos", "fedora"], reason: "you want an accessible platform to start coding on" };
    }

    case "_resolve_gaming": {
      const hasNv = gpu === "nvidia";
      if (isNewbie) {
        if (hasNv) return { leaf: ["bazzite", "nobara", "popos"], reason: "you want easy gaming with excellent NVIDIA support \u2014 Bazzite offers a console-like experience" };
        return { leaf: ["bazzite", "popos", "nobara"], reason: "you want an easy gaming setup \u2014 Bazzite is console-like, Pop!_OS is a great daily driver" };
      }
      if (priority === "latest") {
        if (hasNv) return { leaf: ["cachyos", "nobara", "manjaro"], reason: "you want bleeding-edge performance with NVIDIA drivers \u2014 CachyOS has optimized kernels" };
        return { leaf: ["cachyos", "arch", "garuda"], reason: "you want the absolute latest drivers, kernels, and Mesa with top performance" };
      }
      if (priority === "customization") return { leaf: ["cachyos", "arch", "garuda"], reason: "you want to fine-tune your gaming setup with full control" };
      if (hasNv) return { leaf: ["bazzite", "nobara", "popos"], reason: "you want reliable gaming with solid NVIDIA support" };
      return { leaf: ["bazzite", "popos", "nobara"], reason: "you want a reliable, well-supported gaming setup" };
    }

    default:
      return { leaf: ["ubuntu", "mint", "fedora"], reason: "these are excellent all-around choices" };
  }
}

/* ═══════════════════════════════════════════════
   DISPLAY SCORING + TREE WALKER
   ═══════════════════════════════════════════════ */

function computeDisplayScores(rankedIds, answers) {
  const dims = {};
  const purpose = answers.purpose;
  if (purpose === "server") Object.assign(dims, { server: 5, stable: 3 });
  else if (purpose === "gaming") Object.assign(dims, { gaming: 5, latest: 2 });
  else if (purpose === "development") Object.assign(dims, { dev: 5, latest: 2 });
  else if (purpose === "security") Object.assign(dims, { privacy: 4, dev: 3 });
  else Object.assign(dims, { beginner: 3, stable: 2 });
  const p = answers.priority;
  if (p === "stability") dims.stable = (dims.stable || 0) + 3;
  if (p === "latest") dims.latest = (dims.latest || 0) + 3;
  if (p === "customization") dims.custom = (dims.custom || 0) + 3;
  if (p === "privacy") dims.privacy = (dims.privacy || 0) + 3;
  if (answers.hardware === "lowspec") dims.light = (dims.light || 0) + 3;

  const all = Object.entries(DISTROS).map(([id, d]) => {
    let score = 0, total = 0;
    Object.entries(dims).forEach(([k, w]) => { if (d.traits[k] !== undefined) { score += d.traits[k] * w; total += 10 * w; } });
    return { id, raw: total > 0 ? score / total : 0.5 };
  });

  const treeSet = new Set(rankedIds);
  const treeScores = all.filter(s => treeSet.has(s.id)).sort((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id));
  const otherScores = all.filter(s => !treeSet.has(s.id)).sort((a, b) => b.raw - a.raw);
  const results = [];
  [95, 87, 80, 74, 69].forEach((base, i) => { if (treeScores[i]) results.push({ id: treeScores[i].id, matchScore: Math.min(99, base) }); });
  if (otherScores.length > 0) {
    const maxR = otherScores[0].raw, minR = otherScores[otherScores.length - 1].raw, range = maxR - minR || 1;
    otherScores.forEach(s => results.push({ id: s.id, matchScore: Math.round(25 + ((s.raw - minR) / range) * 40) }));
  }
  return results;
}

function getNextStep(answers) {
  let nodeId = "root";
  while (true) {
    const node = TREE[nodeId];
    if (!node) break;
    const val = answers[node.id];
    if (val === undefined) return { type: "question", node };
    const opt = node.options.find(o => o.value === val);
    if (!opt) break;
    if (opt.next.startsWith("_")) {
      const r = resolveRoute(opt.next, answers);
      if (r.leaf) return { type: "leaf", distros: r.leaf, reason: r.reason };
      if (r.next) { nodeId = r.next; continue; }
    } else { nodeId = opt.next; }
  }
  return { type: "leaf", distros: ["ubuntu", "mint", "fedora"], reason: "these are excellent all-around choices" };
}

/* ═══════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════ */

function DifficultyMeter({ level }) {
  const label = level <= 1 ? "Easy" : level <= 2 ? "Moderate" : level <= 3 ? "Intermediate" : level <= 4 ? "Advanced" : "Expert";
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }} role="img" aria-label={`Difficulty: ${label}`}>
      {[1,2,3,4,5].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= level ? "var(--accent)" : "rgba(255,255,255,0.12)" }} />)}
      <span style={{ marginLeft: 6, fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.04em" }}>{label}</span>
    </div>
  );
}

function DistroCard({ id, distro, rank, matchScore, expanded, onToggle }) {
  const isTop = rank <= 3 && rank > 0;
  return (
    <div role="button" tabIndex={0} onClick={onToggle}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); }}}
      aria-expanded={expanded} className="distro-card"
      style={{
        background: expanded ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isTop && rank === 1 ? "var(--accent)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: "18px 22px", cursor: "pointer",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)", position: "relative", overflow: "hidden", outline: "none",
      }}>
      {rank === 1 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${distro.color}, transparent)` }} />}
      <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: expanded ? 14 : 0, gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: "1 1 auto" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: `${distro.color}18`, border: `1px solid ${distro.color}30`, flexShrink: 0 }} aria-hidden="true">{distro.icon}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-heading)" }}>{distro.name}</h3>
              {isTop && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: rank === 1 ? "var(--accent)" : "rgba(255,255,255,0.08)", color: rank === 1 ? "#000" : "var(--text-dim)", fontWeight: 600, whiteSpace: "nowrap" }}>#{rank} PICK</span>}
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-dim)", fontStyle: "italic" }}>{distro.tagline}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {matchScore != null && <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: distro.color, fontFamily: "var(--font-mono)" }}>{matchScore}%</div>
            <div style={{ fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>match</div>
          </div>}
          <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", fontSize: 12, color: "var(--text-dim)", transition: "transform 0.3s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }} aria-hidden="true">{"\u25BE"}</div>
        </div>
      </div>
      {expanded && (
        <div className="card-expand-anim">
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-mid)", margin: "0 0 14px" }}>{distro.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 14 }}>
            <IB label="Package Manager" value={distro.packageManager} />
            <IB label="Desktop" value={distro.desktop.join(", ")} />
            <IB label="Release Model" value={distro.releaseModel} />
            <IB label="Difficulty" value={<DifficultyMeter level={distro.difficulty} />} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 14 }}>
            <div>
              <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4ade80", margin: "0 0 6px", fontFamily: "var(--font-mono)" }}>{"\u2713"} Strengths</h4>
              {distro.pros.map((p, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-mid)", padding: "2px 0", lineHeight: 1.5 }}>{p}</div>)}
            </div>
            <div>
              <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#f87171", margin: "0 0 6px", fontFamily: "var(--font-mono)" }}>{"\u2717"} Trade-offs</h4>
              {distro.cons.map((c, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-mid)", padding: "2px 0", lineHeight: 1.5 }}>{c}</div>)}
            </div>
          </div>
          {distro.immutable && <div style={{ display: "inline-block", fontSize: 11, padding: "3px 10px", borderRadius: 12, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", marginBottom: 12, fontFamily: "var(--font-mono)" }}>Immutable OS</div>}
          <div><a href={distro.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, background: `${distro.color}20`, border: `1px solid ${distro.color}40`, color: distro.color, fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}>
            Visit {distro.name} {"\u2192"}
          </a></div>
        </div>
      )}
    </div>
  );
}

function IB({ label, value }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "9px 12px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 3, fontFamily: "var(--font-mono)" }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--text)" }}>{value}</div>
    </div>
  );
}

function ComparisonChart({ top3 }) {
  const cats = [
    { key: "beginner", label: "Beginner-Friendly" }, { key: "stable", label: "Stability" },
    { key: "custom", label: "Customization" }, { key: "gaming", label: "Gaming" },
    { key: "dev", label: "Development" }, { key: "privacy", label: "Privacy" },
    { key: "light", label: "Lightweight" }, { key: "server", label: "Server" }, { key: "latest", label: "Latest Software" },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 22, border: "1px solid rgba(255,255,255,0.06)" }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, fontFamily: "var(--font-heading)", color: "var(--text)" }}>Head-to-Head Comparison</h3>
      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {top3.map(id => DISTROS[id] && <div key={id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: DISTROS[id].color }}><span aria-hidden="true">{DISTROS[id].icon}</span> {DISTROS[id].name}</div>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cats.map(cat => (
          <div key={cat.key}>
            <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4, letterSpacing: "0.04em", fontFamily: "var(--font-mono)" }}>{cat.label}</div>
            {top3.map(id => { if (!DISTROS[id]) return null; const v = DISTROS[id].traits[cat.key] || 0; return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <div style={{ width: 18, fontSize: 10, textAlign: "center" }} aria-hidden="true">{DISTROS[id].icon}</div>
                <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${v*10}%`, height: "100%", background: DISTROS[id].color, borderRadius: 3, transition: "width 0.8s cubic-bezier(.4,0,.2,1)", opacity: 0.8 }} />
                </div>
                <div style={{ width: 20, fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)", textAlign: "right" }}>{v}</div>
              </div>
            );})}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGES
   ═══════════════════════════════════════════════ */

function HeroSection({ onStart, onBrowse }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 24px 40px", position: "relative" }}>
      <div className="hero-glow hero-glow-1" /><div className="hero-glow hero-glow-2" />
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: 24, fontWeight: 500 }}>Linux Distribution Finder</div>
      <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.1, fontFamily: "var(--font-heading)", color: "var(--text)", maxWidth: 700 }}>
        Find Your<span style={{ display: "block", background: "linear-gradient(135deg, var(--accent), var(--accent-bright), #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Perfect Linux Distro</span>
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-mid)", maxWidth: 520, margin: "0 0 40px" }}>{DISTRO_COUNT} distributions analyzed. The quiz adapts to your answers, asking only what matters for your path.</p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={onStart} className="btn-primary" style={btnP}>Take the Quiz <span style={{ marginLeft: 6 }}>{"\u2192"}</span></button>
        <button onClick={onBrowse} className="btn-secondary" style={btnS}>Browse All {DISTRO_COUNT} Distros</button>
      </div>
      <div style={{ marginTop: 64, display: "flex", gap: "clamp(20px,5vw,40px)", flexWrap: "wrap", justifyContent: "center" }}>
        {[{ n: String(DISTRO_COUNT), l: "Distros Analyzed" }, { n: "3\u20135", l: "Adaptive Questions" }, { n: "~30s", l: "Average Completion" }, { n: "100%", l: "Free, No Signup" }].map(s =>
          <div key={s.l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{s.n}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.06em" }}>{s.l}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuizSection({ answers, onAnswer, onBack, onReset, questionHistory }) {
  const step = getNextStep(answers);
  if (step.type === "leaf") return null;
  const node = step.node;
  const currentAnswer = answers[node.id] || null;
  const qNum = questionHistory.length + 1;
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 24px 40px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ width: `${Math.min(qNum * 18, 95)}%`, height: "100%", background: "linear-gradient(90deg, var(--accent), var(--accent-bright))", borderRadius: 2, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }} aria-live="polite">QUESTION {qNum}</span>
        <button onClick={onReset} className="btn-ghost" style={{ ...btnG, fontSize: 12 }}>Start Over</button>
      </div>
      <h2 id="quiz-q" style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", fontFamily: "var(--font-heading)", color: "var(--text)" }}>{node.question}</h2>
      <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "0 0 32px" }}>{node.subtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }} role="radiogroup" aria-labelledby="quiz-q">
        {node.options.map(opt => {
          const sel = currentAnswer === opt.value;
          return (
            <button key={opt.value} role="radio" aria-checked={sel} onClick={() => onAnswer(node.id, opt.value)} className="quiz-option"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "16px 20px", borderRadius: 12,
                border: sel ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.08)",
                background: sel ? "rgba(200,240,101,0.08)" : "rgba(255,255,255,0.02)",
                cursor: "pointer", transition: "all 0.25s", textAlign: "left", width: "100%", color: "var(--text)", fontFamily: "inherit", outline: "none" }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{opt.label}</span>
              <span style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{opt.sublabel}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        {questionHistory.length > 0 ? <button onClick={onBack} className="btn-ghost" style={btnG}>{"\u2190"} Back</button> : <div />}
      </div>
    </div>
  );
}

function LoadingScreen() {
  const [d, setD] = useState("");
  useEffect(() => { const t = setInterval(() => setD(p => p.length >= 3 ? "" : p + "."), 400); return () => clearInterval(t); }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20, padding: 40 }} role="status" aria-live="polite">
      <div className="loading-spinner" />
      <div style={{ fontSize: 18, fontFamily: "var(--font-heading)", color: "var(--text)" }}>Finding your perfect match{d}</div>
      <div style={{ fontSize: 13, color: "var(--text-dim)" }}>Scoring across {DISTRO_COUNT} distributions</div>
    </div>
  );
}

function ResultsPage({ distroIds, reason, allScores, answers, onReset, onBrowse, onEditQuestion, questionHistory }) {
  const [expandedId, setExpandedId] = useState(distroIds[0]);
  const ranked = [...allScores].sort((a, b) => b.matchScore - a.matchScore);
  const qL = { experience: "Experience", purpose: "Use case", priority: "Priority", gpu: "GPU", hardware: "Hardware", migration: "Coming from" };
  const vL = { beginner: "Complete beginner", dabbler: "Tried briefly", intermediate: "Comfortable user", advanced: "Power user", desktop: "Daily desktop", development: "Software development", gaming: "Gaming", server: "Server / Self-hosting", security: "Security / Pentesting", stability: "Stability", latest: "Latest software", privacy: "Privacy & security", customization: "Customization", nvidia: "NVIDIA GPU", amd_intel: "AMD / Intel", gpu_unknown: "Not sure", powerful: "Modern & powerful", midrange: "Mid-range", lowspec: "Old / Low-spec", windows: "Windows", macos: "macOS", other_os: "ChromeOS / Other" };
  if (!allScores || !allScores.length) return (<div style={{ padding: "120px 24px", textAlign: "center" }}><p style={{ fontSize: 18, color: "var(--text-mid)" }}>Something went wrong.</p><button onClick={onReset} className="btn-primary" style={{ ...btnP, marginTop: 20 }}>Try Again</button></div>);
  return (
    <div style={{ padding: "80px 24px 80px", maxWidth: 780, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Your Results</div>
        <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--text)" }}>Your Top Match: {DISTROS[distroIds[0]]?.name}</h2>
        <p style={{ fontSize: 15, color: "var(--text-mid)", maxWidth: 560, margin: "0 auto 8px", lineHeight: 1.6 }}>Recommended because {reason}</p>
        <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8 }}>Answered {questionHistory.length} adaptive questions {"\u2014"} scored across {DISTRO_COUNT} distributions.</p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 22, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontFamily: "var(--font-heading)", color: "var(--text)" }}>Your Answers</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {questionHistory.map((qId, i) => (<div key={qId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div><div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{qL[qId] || qId}</div><div style={{ fontSize: 13, color: "var(--text)", marginTop: 2 }}>{vL[answers[qId]] || answers[qId]}</div></div>
            <button onClick={() => onEditQuestion(i)} className="btn-change" style={{ fontSize: 11, color: "var(--accent)", background: "transparent", border: "1px solid rgba(200,240,101,0.2)", padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", outline: "none" }}>Change</button>
          </div>))}
        </div>
      </div>
      <ComparisonChart top3={distroIds.slice(0, 3)} />
      <h3 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-dim)", margin: "36px 0 14px", fontFamily: "var(--font-mono)" }}>All {ranked.length} Distributions Ranked</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ranked.map((s, i) => DISTROS[s.id] && <DistroCard key={s.id} id={s.id} distro={DISTROS[s.id]} rank={i+1} matchScore={s.matchScore} expanded={expandedId === s.id} onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)} />)}
      </div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
        <button onClick={onReset} className="btn-primary" style={btnP}>Retake Quiz</button>
        <button onClick={onBrowse} className="btn-secondary" style={btnS}>Browse All Distros</button>
      </div>
    </div>
  );
}

function BrowsePage({ onReset }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const filters = [
    { label: "All", value: "all" }, { label: "Beginner", value: "beginner" }, { label: "Developer", value: "dev" },
    { label: "Gaming", value: "gaming" }, { label: "Server", value: "server" }, { label: "Privacy", value: "privacy" },
    { label: "Lightweight", value: "light" }, { label: "Latest", value: "latest" }, { label: "Stability", value: "stable" }, { label: "Customization", value: "custom" },
  ];
  const entries = Object.entries(DISTROS);
  const sorted = filter === "all" ? entries : [...entries].sort((a, b) => (b[1].traits[filter] || 0) - (a[1].traits[filter] || 0));
  return (
    <div style={{ padding: "80px 24px 80px", maxWidth: 780, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--text)" }}>All Distributions</h2>
        <p style={{ fontSize: 15, color: "var(--text-mid)" }}>Browse all {entries.length} distributions or sort by strength.</p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }} role="tablist">
        {filters.map(f => (<button key={f.value} role="tab" aria-selected={filter === f.value} onClick={() => setFilter(f.value)} className="filter-btn"
          style={{ padding: "5px 14px", borderRadius: 20, border: filter === f.value ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.1)", background: filter === f.value ? "rgba(200,240,101,0.1)" : "transparent", color: filter === f.value ? "var(--accent)" : "var(--text-dim)", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500, outline: "none" }}>{f.label}</button>))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map(([id, d]) => <DistroCard key={id} id={id} distro={d} rank={99} matchScore={filter === "all" ? null : d.traits[filter] * 10} expanded={expandedId === id} onToggle={() => setExpandedId(expandedId === id ? null : id)} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}><button onClick={onReset} className="btn-primary" style={btnP}>Take the Quiz Instead {"\u2192"}</button></div>
    </div>
  );
}

const btnP = { padding: "14px 32px", borderRadius: 10, border: "none", background: "var(--accent)", color: "#0a0a0f", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", transition: "all 0.25s", outline: "none" };
const btnS = { padding: "14px 32px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "var(--text)", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", transition: "all 0.25s", outline: "none" };
const btnG = { padding: "6px 12px", border: "none", background: "transparent", color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, outline: "none" };

export default function App() {
  const [page, setPage] = useState("home");
  const [answers, setAnswers] = useState({});
  const [questionHistory, setQuestionHistory] = useState([]);
  const [resultData, setResultData] = useState(null);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [page]);
  const handleStart = () => { setAnswers({}); setQuestionHistory([]); setResultData(null); setPage("quiz"); };
  const handleAnswer = (qId, val) => {
    const na = { ...answers, [qId]: val };
    const nh = questionHistory.includes(qId) ? questionHistory : [...questionHistory, qId];
    setAnswers(na); setQuestionHistory(nh);
    const step = getNextStep(na);
    if (step.type === "leaf") { setPage("loading"); setTimeout(() => { setResultData({ distros: step.distros, reason: step.reason, scores: computeDisplayScores(step.distros, na) }); setPage("results"); }, 1000); }
  };
  const handleBack = () => { if (questionHistory.length < 1) return; const nh = [...questionHistory]; const rm = nh.pop(); const na = { ...answers }; delete na[rm]; setAnswers(na); setQuestionHistory(nh); };
  const handleEdit = (i) => { const nh = questionHistory.slice(0, i); const na = {}; nh.forEach(q => { na[q] = answers[q]; }); setAnswers(na); setQuestionHistory(nh); setResultData(null); setPage("quiz"); };
  return (
    <div lang="en">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
        :root { --bg: #0a0a0f; --bg-elevated: #16161e; --accent: #c8f065; --accent-bright: #e0ff8a; --text: #eaeaf0; --text-mid: #a8a8b8; --text-dim: #808094; --font-heading: 'Instrument Serif', Georgia, serif; --font-body: 'DM Sans', system-ui, sans-serif; --font-mono: 'JetBrains Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; min-height: 100vh; }
        .skip-link { position: absolute; top: -100px; left: 16px; padding: 8px 16px; background: var(--accent); color: #000; border-radius: 0 0 8px 8px; z-index: 200; font-weight: 600; font-size: 14px; text-decoration: none; transition: top 0.2s; }
        .skip-link:focus { top: 0; }
        *:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        button:focus:not(:focus-visible), [role="button"]:focus:not(:focus-visible) { outline: none; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .card-expand-anim { animation: fadeSlideIn 0.35s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
        .btn-primary:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-secondary:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.2); transform: translateY(-1px); }
        .btn-secondary:active { transform: translateY(0); }
        .btn-ghost:hover { color: var(--text); }
        .btn-change:hover { background: rgba(200,240,101,0.08) !important; border-color: rgba(200,240,101,0.4) !important; }
        .quiz-option:hover { border-color: rgba(255,255,255,0.2) !important; background: rgba(255,255,255,0.04) !important; }
        .filter-btn:hover { border-color: rgba(255,255,255,0.2) !important; color: var(--text) !important; }
        .distro-card:hover { background: rgba(255,255,255,0.04) !important; border-color: rgba(255,255,255,0.12) !important; }
        .hero-glow { position: absolute; pointer-events: none; border-radius: 50%; }
        .hero-glow-1 { top: 15%; left: 10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(200,240,101,0.04), transparent 70%); }
        .hero-glow-2 { bottom: 20%; right: 8%; width: 250px; height: 250px; background: radial-gradient(circle, rgba(59,130,246,0.04), transparent 70%); }
        ::selection { background: var(--accent); color: #000; }
        a:hover { filter: brightness(1.2); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } .loading-spinner { animation: none; opacity: 0.7; } }
      `}</style>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(180deg, var(--bg), transparent)", backdropFilter: "blur(12px)" }} aria-label="Main navigation">
        <div onClick={() => setPage("home")} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setPage("home"); }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, outline: "none" }} aria-label="PickMyDistro home">
          <span style={{ fontSize: 20 }} aria-hidden="true">{"\uD83D\uDC27"}</span>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>PickMyDistro</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleStart} className="btn-ghost" style={{ ...btnG, color: "var(--text-mid)" }}>Quiz</button>
          <button onClick={() => setPage("browse")} className="btn-ghost" style={{ ...btnG, color: "var(--text-mid)" }}>Browse</button>
        </div>
      </nav>
      <main id="main-content">
        {page === "home" && <HeroSection onStart={handleStart} onBrowse={() => setPage("browse")} />}
        {page === "quiz" && <QuizSection answers={answers} onAnswer={handleAnswer} onBack={handleBack} onReset={handleStart} questionHistory={questionHistory} />}
        {page === "loading" && <LoadingScreen />}
        {page === "results" && resultData && <ResultsPage distroIds={resultData.distros} reason={resultData.reason} allScores={resultData.scores} answers={answers} onReset={handleStart} onBrowse={() => setPage("browse")} onEditQuestion={handleEdit} questionHistory={questionHistory} />}
        {page === "browse" && <BrowsePage onReset={handleStart} />}
      </main>
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8 }}>
        <p>PickMyDistro {"\u2014"} Helping users find their perfect Linux distribution.</p>
        <p style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 11 }}>Decision tree engine {"\u2022"} {DISTRO_COUNT} distros {"\u2022"} Data last updated: March 2026</p>
      </footer>
    </div>
  );
}

