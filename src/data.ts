/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoreLayer {
  name: string;
  percentage: number;
  desc: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  category: "Star" | "Rocky" | "Home" | "Gas Giant" | "Ice Giant" | "Satellite" | "Dwarf Planet";
  image: string;
  description: string;
  details: string;
  diameter: string;
  diameterVal: number; // in km for math comparison
  mass: string;
  massVal: number; // relative weight helper or raw ex
  gravity: string;
  gravityVal: number; // in m/s^2 for comparison
  distance: string;
  distanceVal: number; // float in AU relative
  temperature: string;
  tempVal: number; // middle temp in C for comparison
  moons: number;
  tags: string[];
  coreComposition: CoreLayer[];
  atmosphere: string[];
  funFact: string;
}

export interface SpaceMission {
  id: string;
  name: string;
  target: string;
  launchYear: string;
  status: "Active" | "Completed" | "Decommissioned";
  type: "Orbiter" | "Lander" | "Flyby" | "Observatory";
  description: string;
  icon: string;
  telemetry: string;
  coordinates: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of correct option
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  xpReward: number;
  level: "Novice" | "Commander" | "Galactic Admiral";
  questions: QuizQuestion[];
  icon: string;
}

export const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: "sun",
    name: "The Sun",
    category: "Star",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD001LTG_iGn_jmWJOFk8iO5HEyKWjUuOHhe824p3tz0mlZGC2S2GswuqcPPqoKsvCjdOf6zHyPOv0rVV5mD1h-A6OFymzdy1Gp5uThpZ6WynX5pU_1zTt-Kq0tPayVEqsGS-zZiqLeINMkNuIUIVYM4G0ybwUyQesaZsiKBC0G0niiqDZjAYL2ZejbSKNHowLet82glLWKn27CobEFrX19N3L7SU0SzZG8l6d4_6qe1p4I-8XHlLNOFBJp6mGGKB1B1g588hoYq4w6",
    description: "The heart of our Solar System. A colossal, glowing sphere of hydrogen and helium powered by nuclear fusion, comprising 99.8% of the system's total mass.",
    details: "The Sun has been shining for about 4.6 billion years and has enough fuel to continue for another 5 billion. Its intense magnetic field creates sunspots, massive solar flares, and coronal mass ejections that trigger auroras across Earth's polar skies.",
    diameter: "1,392,700 km",
    diameterVal: 1392700,
    mass: "1.989 × 10³⁰ kg",
    massVal: 333000, // Earth-masses equivalent helper
    gravity: "274 m/s²",
    gravityVal: 274,
    distance: "0 km (Center)",
    distanceVal: 0,
    temperature: "5,500 °C (surface) | 15,000,000 °C (core)",
    tempVal: 5500,
    moons: 0,
    tags: ["HOTTEST", "CENTER", "HEAVYEST"],
    atmosphere: ["Hydrogen (73%)", "Helium (25%)", "Oxygen, Carbon, Neon, Iron"],
    funFact: "One million Earths could easily fit inside the Sun. Light from its surface takes exactly 8 minutes and 20 seconds to reach our eyes on Earth.",
    coreComposition: [
      { name: "Super-Hot Fusion Core", percentage: 40, desc: "Intense pressure compresses hydrogen atoms into helium, generating light and life-giving energy." },
      { name: "Radiative Transfer Zone", percentage: 45, desc: "Photon energy bounces erratically inside dense plasma, taking up to 100,000 years to travel outwards." },
      { name: "Convective Currents Shell", percentage: 15, desc: "Bubbling columns of hot ionized gas carry volcanic-like thermal currents up to the glowing Photosphere grid." }
    ]
  },
  {
    id: "mercury",
    name: "Mercury",
    category: "Rocky",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnRa6rbHitaGlA-OhgfZJREN_jHT0NOJHNL7aw-vl0vErYFM28jxMGpAICvdFHY5dBqjaKO98rsYXtFns62c334_S6m2sNq4ULcImmE78Wd4qSSFq2WIKVpw98QKi-fbG1ZqIE6d6MvRiX8aFnBIFER8vFjGO-xMzbOnm8L8Zwm2FazArJku_hbQZUMDvBeajLoZlSWHcS3gLABSGPtRfUcaGiW5idI0zCcSmTSkUofGQ23sBJfRtig_SZvjykIWkjxYnRlJ7ukTIN",
    description: "The smallest planet in our solar system and the closest to the Sun. A heavily cratered, airless world that experiences extreme fluctuations in climate.",
    details: "Since it has virtually no atmosphere to trap heat, Mercury is a land of extremes. During the day, temperatures boil high enough to melt lead, but in the shadow of the cold night, temperatures collapse into deep freeze.",
    diameter: "4,879 km",
    diameterVal: 4879,
    mass: "3.285 × 10²³ kg",
    massVal: 0.055,
    gravity: "3.70 m/s²",
    gravityVal: 3.70,
    distance: "57.9M km",
    distanceVal: 0.39,
    temperature: "-180 °C to 430 °C",
    tempVal: 167,
    moons: 0,
    tags: ["FASTEST", "CRATERED"],
    atmosphere: ["Traces of Helium", "Sodium", "Hydrogen", "Oxygen"],
    funFact: "Despite being closest to the Sun, it is not the hottest planet — Venus is! Mercury is also shrinking over time as its giant metal core slowly cools and contracts.",
    coreComposition: [
      { name: "Giant Molten Iron Core", percentage: 70, desc: "A colossal iron-rich core occupies most of the planet's diameter, generating a surprising global magnetic field." },
      { name: "Rocky Silicate Mantle", percentage: 22, desc: "A thin, solid layer of minerals surrounding the massive core." },
      { name: "Cracked Basaltic Crust", percentage: 8, desc: "Ancient volcanic plains heavily impacted by billions of years of asteroid collisions." }
    ]
  },
  {
    id: "earth",
    name: "Earth",
    category: "Home",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlmkhOeP_BxF7lKZbtIsa2C9Mx13PTP87b56kaTM-BW-cYytp_MkQITJ77hd7DraErwLY7mOYZbraiCPlW5vNqsUZLNfUlDydJlvEtOxdiIqwDL1cczq7kqTzJeUbVejzQj2vnZ49Uhlowyefpqeq7AyTxTSKVSVeEO51yCb_Pe_SSBYEVPV6toqIqw9HXTzrab6L82f03dbjqA4IHMmzjunSuNQguN1L3nX7XuZMNKQgZdmHvQTC9MnKDWCVq4Sf8I2OLKlCvmDEc",
    description: "Our blue oasis in the cosmic desert. It is the only known planet in the universe with liquid surface water, a rich oxygen atmosphere, and thriving biodiversity.",
    details: "Earth sits perfectly inside the Sun's habitable Zone, where temperatures allow water to remain liquid. Powered by a churning iron core, Earth's magnetic envelope deflects cosmic radiation, working hand-in-hand with our atmosphere to foster complex civilizational life over billions of years.",
    diameter: "12,742 km",
    diameterVal: 12742,
    mass: "5.972 × 10²⁴ kg",
    massVal: 1.0,
    gravity: "9.81 m/s²",
    gravityVal: 9.81,
    distance: "149.6M km (1 AU)",
    distanceVal: 1.0,
    temperature: "-89 °C to 58 °C",
    tempVal: 15,
    moons: 1,
    tags: ["HABITABLE", "WATER", "LIFE-GIVING"],
    atmosphere: ["Nitrogen (78%)", "Oxygen (21%)", "Argon (0.93%)", "Carbon-Dioxide (0.04%)"],
    funFact: "Earth's atmosphere shields us from 100+ tons of sand-sized meteorites daily, which safely burn up as glittering shooting stars.",
    coreComposition: [
      { name: "Solid Iron Inner Core", percentage: 10, desc: "Superheated solid crystalline alloy under pressures equal to 3.5 million times Earth's atmosphere." },
      { name: "Fluid Metallic Outer Core", percentage: 22, desc: "Churning liquid iron and nickel currents act as a planetary dynamo, creating our invisible magnetic deflector shield." },
      { name: "Silicate Mantle & Crust", percentage: 68, desc: "Semi-viscous volcanic convective rock driving continental plates and creating spectacular ocean trenches." }
    ]
  },
  {
    id: "mars",
    name: "Mars",
    category: "Rocky",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoJFf0As3RHQUiGcMJaycrDzcT0_7nteib87sTP5WRuL7WmQbWMr60fkOYgWUoMqmlOMj71qEXYcWcZtyIs7hxe2qcbuoGUCtzt5YuYvwn77VErqRiLyiyCRbG3dbV2Q46L4Ox4NAU7_XABE0sbPCW3Ob4Hmrt15PNtYjf_-k-7xiLDB5Kr54mAB4w_TK5yaRmJw70y3MbIgs_FTjdhs1--PVxoxG9Qdd4CsKq-YoFPN2UMbzwEFooi17dZC42quR2sg2XYN1hLdRS",
    description: "The Red Planet, a cold, dusty world with a thin CO₂ atmosphere. Home to towering volcanoes, sprawling canyons, and frozen polar ice caps.",
    details: "Mars is a prime candidate for future human colonization. Liquid water existed on its surface billions of years ago; today, rovers like Curiosity and Perseverance actively search for ancient microbial biosignatures preserved in dried lakebeds.",
    diameter: "6,779 km",
    diameterVal: 6779,
    mass: "6.39 × 10²³ kg",
    massVal: 0.107,
    gravity: "3.71 m/s²",
    gravityVal: 3.71,
    distance: "227.9M km",
    distanceVal: 1.52,
    temperature: "-153 °C to 20 °C",
    tempVal: -63,
    moons: 2,
    tags: ["RED PLANET", "VOLCANOES"],
    atmosphere: ["Carbon Dioxide (95%)", "Nitrogen (2.8%)", "Argon (2%)", "Traces of Oxygen"],
    funFact: "Mars is home to Olympus Mons, the largest volcano in the Solar System. It is three times taller than Mount Everest and as wide as the state of Arizona!",
    coreComposition: [
      { name: "Sulfur-Infused Iron Core", percentage: 25, desc: "A partially liquid metal core rich in sulfur, which prevents solid crystal lock." },
      { name: "Quiet Silicate Mantle", percentage: 70, desc: "A thick rocky wrapping. Lacks mantle convection, rendering plate tectonics completely quiet." },
      { name: "Rusty Iron-Oxide Crust", percentage: 5, desc: "A rugged silicate shell coated in fine pulverized iron dust that literally rusted under prehistoric breezes." }
    ]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    category: "Gas Giant",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQE0IwFeOC4EWxBUcLLbgtTmbVkHSB9USK3uj19StHb0yEVQGQY7euoJyHmyIjG8Xw2Fk7QxtJxZ0Au8UxEen_ZZUL2gVJ2AWDFa4np8I01uKd3Ft_Wzukf7_Ub0zNvoYFFPJWZdIGH1IZ-0yVh61gjP7lwlAbuh0IxdhA37VP1fKL6OEhny0tk7IWb3pDEMPKM7mPNjfMnY1ML5Y2nqFr2w3CoxWuq4XywCTFIfr-zIa2qMp4XR1u12igZlYLp7U86yC75Bza8mfk",
    description: "The absolute titan of our planetary system. A massive gas giant consisting mostly of hydrogen and helium, famous for its swirling striped storm bands.",
    details: "Jupiter boasts a magnetic field 14 times stronger than Earth's, trapping lethal radiation belts. It acts as the solar system's shield, vacuuming up passing space debris that would otherwise careen dangerously towards inner rocky worlds.",
    diameter: "139,820 km",
    diameterVal: 139820,
    mass: "1.898 × 10²⁷ kg",
    massVal: 317.8,
    gravity: "24.79 m/s²",
    gravityVal: 24.79,
    distance: "778.5M km",
    distanceVal: 5.2,
    temperature: "-110 °C",
    tempVal: -110,
    moons: 95,
    tags: ["LARGEST", "GIANT STORM"],
    atmosphere: ["Hydrogen (90%)", "Helium (10%)", "Ammonia", "Methane", "Water"],
    funFact: "Jupiter's famous 'Great Red Spot' is a massive anticylonic hurricane wider than Earth, which has raged continuously for at least 350 years.",
    coreComposition: [
      { name: "Super-Compressed Rocky Core", percentage: 12, desc: "A dense, high-temperature core composed of raw rock, heavy metals, and exotic water-ices." },
      { name: "Fluid Metallic Hydrogen", percentage: 68, desc: "Deep interior hydrogen compressed so tightly it transforms into a highly conductive liquid metallic stream." },
      { name: "Molecular Hydrogen Outer Cloud", percentage: 20, desc: "Gaseous bands of colored ammonia clouds spinning at up to 600 kilometers per hour." }
    ]
  },
  {
    id: "saturn",
    name: "Saturn",
    category: "Gas Giant",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbpBucc19XrXl8Ts4jnnt38IokC-Esqp2k7SpH87WkvrlIOH-9ef-2zRteg4mdEtRe44r7OrFQr-zVteyGCuleBA0hCDTN1s0TRxlEVHtL05jy1p4wS8xlLcFuIii_wO7mpFWlVDpiWtqeFSRz9dTzofWZiOyRz7bbKqcOChhWP78byy7oab3mwMaQeEgHaLX74Qh1XwLVz0Jo3krdSrbpo0Ed2keOxcUouJPMchkgaNaHdovCJ7xhcUddCd1LGWEhrF6Y54dtUzCf",
    description: "The jewel of the sky. A gas giant recognized everywhere for its magnificent, sprawling ring system made of billions of icy particles, rocks, and space dust.",
    details: "Saturn has the lowest density of any planet; it is actually lighter than water. Its complex moon system includes Titan, a giant moon featuring rain clouds, liquid methane lakes, and a dense nitrogen atmosphere.",
    diameter: "116,460 km",
    diameterVal: 116460,
    mass: "5.683 × 10²⁶ kg",
    massVal: 95.2,
    gravity: "10.44 m/s²",
    gravityVal: 10.44,
    distance: "1.43B km",
    distanceVal: 9.58,
    temperature: "-140 °C",
    tempVal: -140,
    moons: 146,
    tags: ["RINGED", "ICY RINGS", "FLOATS"],
    atmosphere: ["Hydrogen (96%)", "Helium (3%)", "Methane", "Ammonia"],
    funFact: "Saturn's rings look solid but are actually razor-thin collections of sparkling water ice-chunks, ranging from tiny dust grains to mountain-sized blocks.",
    coreComposition: [
      { name: "Heavy Rock & Ice Core", percentage: 15, desc: "A hot, dense central core made of metallic alloys and high-pressure silicate compounds." },
      { name: "Liquid Metallic Hydrogen", percentage: 55, desc: "Conductive liquid hydrogen layer creating a powerful global radio-wave field." },
      { name: "Gaseous Hydrogen & Helium Outer", percentage: 30, desc: "Slowly transitioning into the spectacular ring canopy system." }
    ]
  },
  {
    id: "neptune",
    name: "Neptune",
    category: "Ice Giant",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgcyHl4RWvwzunv0K4gcZYPwWEITXsvMSs0Ml0MMKgVcgKuA1GCZ-Ipkig8leP22MQz869udVxtEAoZA-xdjmYVbbtP7ljBWrC9yqCAl1pY_Px2pgIBHl6VJupSZp4r1zYS3td-XVy6SY4nq4zDseXzRF-jaXgfK0jkEJRtII8Te2KspMqmxh3BPqPZbi4VRQUjCF9MA1a783K1xF6-tDGRW9ww84TadPqzrrj-BHvuYa_V416Obl2eYPswC9n3uX_i1FR4PpiPUis",
    description: "The most distant planet from our Sun. A frozen, deep-blue ice giant shaped by the fastest winds in the Solar System, whipping up storms at supersonic speeds.",
    details: "First discovered using mathematical calculations rather than a telescope, Neptune's deep cobalt hue originates from trace methane gas. Active geological structures are hidden below its clouds, generating internal heat fields.",
    diameter: "49,244 km",
    diameterVal: 49244,
    mass: "1.024 × 10²⁶ kg",
    massVal: 17.1,
    gravity: "11.15 m/s²",
    gravityVal: 11.15,
    distance: "4.50B km",
    distanceVal: 30.07,
    temperature: "-200 °C",
    tempVal: -200,
    moons: 16,
    tags: ["WINDIEST", "ICE WORLD"],
    atmosphere: ["Hydrogen (80%)", "Helium (19%)", "Methane (1%)", "Ammonia"],
    funFact: "Neptune's winds blow backwards against its rotation, reaching up to 2,100 km/h — fast enough to easily shatter supersonic flight barriers on Earth!",
    coreComposition: [
      { name: "Iron & Nickel Solid Core", percentage: 20, desc: "A compact metallic heart, generating heat that drives Neptune's turbulent atmosphere." },
      { name: "Pressurized Ionic Ice Slush", percentage: 60, desc: "An exotic ocean mantle composed of liquid and ice crystal water, compressed ammonia, and methane." },
      { name: "Methane-Rich Gas Troposphere", percentage: 20, desc: "A dense gaseous envelope that filters out red sunlight, bouncing back a breathtaking azure blue." }
    ]
  },
  {
    id: "moon",
    name: "The Moon",
    category: "Satellite",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZnAqf-JoE12fxx421gAt5vlBouV9Za5El2VJWU9Ant2aHRvLtZ_rPzW6xN_5qWPeVST3mlon3WIo7g4-_RQiBikfQIzrSXCpaE_O-wOZSSeQ00S8DEQmTnrsOKEcoU5p11-9LTowwYqFNYgTMeGrp55l5B9b2uDu11z303XH9X0fRLE6_inIqJgpZbREn60dilowbxVR_VQhP0qz0XTRuY7Nw-95-9gwkcptx9bzbWDuLepMU8nqcPlK7vaNswF5vo5GE6U_fGSSa",
    description: "Earth's loyal companion. A dusty, vacuum-sealed rocky satellite that stabilizes our planet's tilt and choreographs the rhythmic rise and fall of ocean tides.",
    details: "Formed 4.5 billion years ago when a Mars-sized planet collided with early Earth, the Moon is tidal-locked, always showing us the same face. Its crater-pocked expanses preserve an undisturbed diary of high-intensity cosmic impacts.",
    diameter: "3,474 km",
    diameterVal: 3474,
    mass: "7.342 × 10²² kg",
    massVal: 0.012,
    gravity: "1.62 m/s²",
    gravityVal: 1.62,
    distance: "384,400 km from Earth",
    distanceVal: 0.0026,
    temperature: "-130 °C to 120 °C",
    tempVal: -15,
    moons: 0,
    tags: ["TIDAL LOCK", "CRATER FIELDS", "HUMAN LAUNCHED"],
    atmosphere: ["Exosphere (traces)", "Helium", "Neon", "Argon"],
    funFact: "The Moon is slowly drifting away from us at a speed of 3.8 centimeters per year. Footprints left by Apollo astronauts will remain perfectly intact for millions of years!",
    coreComposition: [
      { name: "Small Iron Inner Core", percentage: 10, desc: "A solid, metallic center that is largely cooled and no longer drives a magnetic dynamo." },
      { name: "Semi-Rocky Lunar Mantle", percentage: 70, desc: "Composed mostly of pyroxene and olivine rocks under silent thermal pressure." },
      { name: "Hardened Anorthosite Crust", percentage: 20, desc: "A dusty outermost veneer rich in oxygen, silicon, magnesium, iron, and calcium." }
    ]
  },
  {
    id: "pluto",
    name: "Pluto",
    category: "Dwarf Planet",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl5-x7-rIYKAuetr1Mnq_Cf7l-rVp1GxeDbtITOhEi95kWBtIklXr-eds2pwEpcXdBcd9yITd2gsaPF1qc_oh_ikm0dZUhcbdAf5WeKEDerzP3tS7RBdQBTRszbY9T8tQPotM8_V3076jX34gr7TsjQlA4EZ0DYJfyp7dRFscmzg-2UufbiHO0qPBa3t_5UIouNSvuDtKfDOy6WqJKLTiYSGj06sAUivxtmBMoNm63C99jSNzwfPtuT-Qsk4nsrcjIjwmj1tlmPM_P",
    description: "The beloved dwarf planet in the icy Kuiper Belt. A frigid rocky world showing a famous heart-shaped glacier of frozen nitrogen.",
    details: "Reclassified as a 'dwarf planet' in 2006, Pluto is smaller than Earth's Moon but boasts an incredibly complex geological map. High resolution photos from the New Horizons flyby revealed mountains of pure water-ice and flowing glaciers.",
    diameter: "2,376 km",
    diameterVal: 2376,
    mass: "1.303 × 10²² kg",
    massVal: 0.0021,
    gravity: "0.62 m/s²",
    gravityVal: 0.62,
    distance: "5.91B km",
    distanceVal: 39.48,
    temperature: "-230 °C",
    tempVal: -230,
    moons: 5,
    tags: ["HEART GLACIER", "KUIPER BELT"],
    atmosphere: ["Nitrogen (99%)", "Methane", "Carbon Monoxide"],
    funFact: "A single year on Pluto lasts 248 Earth years! Its largest moon, Charon, is so big that the two actually orbit each other like a double-planet.",
    coreComposition: [
      { name: "Silicate Rock Core", percentage: 65, desc: "A cold mass of rock and heavy metals acting as the dwarf's density anchor." },
      { name: "Water-Ice Frozen Mantle", percentage: 30, desc: "Hard-frozen crystalline ice sheets that prevent volcanic movement." },
      { name: "Nitrogen & Methane Crust", percentage: 5, desc: "Deep frozen snow fields forming glaciers that reflect bright peach hues." }
    ]
  },
  {
    id: "uranus",
    name: "Uranus",
    category: "Ice Giant",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyvvU5pAcvuxlR2uIQvp47cYEsGSiUo0jHrMsa2CIgzPJq5cdiRP3P4J1wD0d-Uz8dMn1kcjlDNK5SUwJUHV8p1j5cNM4g9Wvw2TBIY_LIAGrSoHdBTn3FbDKxw12gQrt9mfOehJ5mWEgZQ_uezS42YKlVyncRYgg2hRrx4Y--AbGx8lQBXVvgIpOyVKDAJQMgA5ZVHjfS0tXOeMWOC-QOOSvPFfBJ6hnEJLmTUThw06beCaiKtmwvMR8UmiqpzGo3Goy4nYg7aQES",
    description: "The unique pale-cyan ice giant that spins sideways on its orbital plane. It has a cold, quiet gaseous atmosphere wrapped in thin black rings.",
    details: "Its wild 98-degree axial tilt has led scientists to believe that Uranus collided with an Earth-sized protoplanet during solar formation. This causes bizarre, 21-year-long winters and summers that envelope its polar centers.",
    diameter: "50,724 km",
    diameterVal: 50724,
    mass: "8.681 × 10²⁵ kg",
    massVal: 14.5,
    gravity: "8.69 m/s²",
    gravityVal: 8.69,
    distance: "2.87B km",
    distanceVal: 19.18,
    temperature: "-224 °C",
    tempVal: -224,
    moons: 28,
    tags: ["TILTED", "SIDE-SPIN", "COLDEST"],
    atmosphere: ["Hydrogen (82%)", "Helium (15%)", "Methane (2.3%)"],
    funFact: "Uranus is the coldest planet in our system, even colder than distant Neptune! It features 13 distinct, micro-thin charcoal-dark rings.",
    coreComposition: [
      { name: "Iron & Silicate Core", percentage: 20, desc: "An icy metallic heart containing minimal thermal heat signatures." },
      { name: "Water/Ammonia/Methane Slush", percentage: 60, desc: "Superheated, electrical-conductive liquid mantle of water-ice currents." },
      { name: "Methane-Rich hydrogen Outer", percentage: 20, desc: "A calm cyan mist forming the smoothest cloud layer in deep space." }
    ]
  }
];

export const SPACE_MISSIONS: SpaceMission[] = [
  {
    id: "voyager1",
    name: "Voyager 1",
    target: "Outer Solar System",
    launchYear: "1977",
    status: "Active",
    type: "Flyby",
    description: "The furthest human-made object. Voyager 1 revolutionized planetary science by capturing magnificent detailed photos of Jupiter's storms and Saturn's rings, and became the first craft to enter interstellar space in 2012.",
    icon: "📡",
    telemetry: "Speed: 61,146 km/h | 24.1 Billion km from Earth",
    coordinates: "RA 17h, Dec +12°"
  },
  {
    id: "perseverance",
    name: "Perseverance Rover",
    target: "Mars",
    launchYear: "2020",
    status: "Active",
    type: "Lander",
    description: "Equipped with ground-penetrating radar, micro-cameras, and the Ingenuity drone, Perseverance is analyzing the sands of Jezero Crater for ancient lakebed biosignatures and caching geological core samples.",
    icon: "🚜",
    telemetry: "Active in Jezero Crater | Rover Speed: 0.12 km/h",
    coordinates: "18.38° N, 77.58° E"
  },
  {
    id: "james_webb",
    name: "James Webb Telescope",
    target: "Lagrange Point L2",
    launchYear: "2021",
    status: "Active",
    type: "Observatory",
    description: "Peering back in time to observe the very first galaxies formed after the Big Bang. Webb conducts high-resolution infrared searches of exoplanet atmospheres to spot oxygen, water vapor, and methane.",
    icon: "🔭",
    telemetry: "Orbiting Lagrange Point L2 | Temp: -233 °C",
    coordinates: "1.5 Million km from Earth"
  },
  {
    id: "cassini",
    name: "Cassini-Huygens",
    target: "Saturn",
    launchYear: "1997",
    status: "Completed",
    type: "Orbiter",
    description: "Spent 13 spectacular years orbiting Saturn, discovering giant geysers on moon Enceladus, landing a probe on Titan, and intentionally diving into Saturn's atmosphere in 2017 to protect its moons from contamination.",
    icon: "🛰️",
    telemetry: "Concluded with a dramatic atmospheric dive into Saturn in 2017",
    coordinates: "Vaporized in Saturn Atmosphere"
  }
];

export const QUIZZES: Quiz[] = [
  {
    id: "quiz_01",
    title: "Giant Planets",
    subtitle: "Rings, storm vortexes, and cosmic gravity of our colossal outer worlds.",
    badge: "Saturn Ring-Master",
    xpReward: 600,
    level: "Novice",
    icon: "🪐",
    questions: [
      {
        id: 1,
        question: "Which gas giant is the absolute heaviest and largest planet in our solar system?",
        options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
        answer: 1,
        explanation: "Jupiter is the colossal titan, weighing more than double all other planets, moons, asteroids, and comets combined!"
      },
      {
        id: 2,
        question: "What is Saturn's magnificent ring system primarily made of?",
        options: ["Frozen nitrogen snow", "Pure glowing gold dust", "Water ice chunks, rocks, and dust particles", "Volcanic sulfuric ash"],
        answer: 2,
        explanation: "Saturn's rings are millions of individual ice chunks and rocks reflecting sunlight high above the equator."
      },
      {
        id: 3,
        question: "Which icy giant is unique because it spins completely sideways on its axis?",
        options: ["Uranus", "Neptune", "Mars", "Pluto"],
        answer: 0,
        explanation: "Uranus spins at a extreme 98-degree tilt, likely due to a violent collision with a giant protoplanet long ago."
      },
      {
        id: 4,
        question: "How long has Jupiter's Great Red Spot storm vortex been actively observed?",
        options: ["Exactly 20 years", "Since 1997", "Over 350 years", "Only 2 weeks"],
        answer: 2,
        explanation: "This massive swirling atmospheric hurricane is wider than Earth and has rolled since at least the late 1600s."
      },
      {
        id: 5,
        question: "Which of these outer worlds features supersonic winds blowing backwards against its orbital spin?",
        options: ["Saturn", "Uranus", "Neptune", "Sun"],
        answer: 2,
        explanation: "Neptune features winds whipping at up to 2,100 km/h, creating backwards-charging storms!"
      }
    ]
  },
  {
    id: "quiz_02",
    title: "The Hot Zone",
    subtitle: "Explore the blistering inner rocky worlds and our glowing core star.",
    badge: "Solar Flare Cadet",
    xpReward: 640,
    level: "Commander",
    icon: "☀️",
    questions: [
      {
        id: 1,
        question: "What fuel source powers the core of the Sun to generate heat and light?",
        options: ["Burning volcanic coal", "Nuclear fusion compressing hydrogen into helium", "Electrical lightning feedback", "Cosmic friction"],
        answer: 1,
        explanation: "Nuclear fusion in the high-pressure core fuses hydrogen atoms into helium, releasing huge bursts of thermal photon energy."
      },
      {
        id: 2,
        question: "How long does light emitted from the Sun take to reach our eyes on Earth?",
        options: ["Exactly 1 second", "8 minutes and 20 seconds", "21 years", "Instantly"],
        answer: 1,
        explanation: "Because light travels at 300,000 km/s and Earth is 150 Million km away, the solar journey takes 8 minutes 20 seconds!"
      },
      {
        id: 3,
        question: "Why does Mars look rusty-red from deep space telescopes?",
        options: ["Its surface is covered in burning hot lava flows", "Red alien flora forests", "Its surface is coated in iron-oxide rust dust", "Glass reflections"],
        answer: 2,
        explanation: " Mars is covered in fine iron-silicate dust that rusted under atmospheric conditions, bouncing red light back."
      },
      {
        id: 4,
        question: "Which is the smallest rocky planet, containing a giant iron core occupying 70% of its body?",
        options: ["Moon", "Mercury", "Venus", "Mars"],
        answer: 1,
        explanation: "Mercury is the smallest planet. It contains a massive liquid metal core that leaves it with only a thin rocky wrapper."
      },
      {
        id: 5,
        question: "What volcanic canyon on Mars is the largest valley in the solar system, dwarfing the Grand Canyon?",
        options: ["Olympus Mons", "Valles Marineris", "Jezero Crater", "Mariana Trench"],
        answer: 1,
        explanation: "Valles Marineris ranges over 4,000 km long and 7 km deep — easily stretching across the continental United States!"
      }
    ]
  },
  {
    id: "quiz_03",
    title: "Cosmic Mysteries",
    subtitle: "Flyby telemetries, Lagrange alignments, and dwarf worlds of the Kuiper Belt.",
    badge: "Nebula Admiral",
    xpReward: 800,
    level: "Galactic Admiral",
    icon: "🛰️",
    questions: [
      {
        id: 1,
        question: "What famous heart-shaped glacier was discovered on Pluto's frost surface?",
        options: ["Tombaugh Regio", "Olympus Basin", "Valles Slush", "Jezero Ice Shelf"],
        answer: 0,
        explanation: "Tombaugh Regio is Pluto's massive nitrogen-rich ice glacier that bears an uncanny resemblance to a glowing heart."
      },
      {
        id: 2,
        question: "Where is the James Webb Space Telescope positioned to peer at pristine ancient galaxies?",
        options: ["Low Earth Orbit next to Hubble", "On the surface of the Moon", "At Lagrange Point L2, 1.5M km from Earth", "Orbiting Saturn's rings"],
        answer: 2,
        explanation: "Webb orbits Lagrange Point L2, keeping it shielded from Earth's heat and aligned for cold infrared exploration."
      },
      {
        id: 3,
        question: "What was Voyager 1's historic achievement in the year 2012?",
        options: ["It landed on Pluto's heart glacier", "It became the first human-made craft to cross into interstellar space", "It collided with a comet", "It returned safely to Florida"],
        answer: 1,
        explanation: "Voyager 1 left our Sun's wind envelope in 2012 and stepped into the untamed cosmic rays of Interstellar space."
      },
      {
        id: 4,
        question: "Which asteroid-rich band sits directly between the orbits of Mars and Jupiter?",
        options: ["The Kuiper Belt", "The Oort Cloud", "The Main Asteroid Belt", "The Saturn ring zone"],
        answer: 2,
        explanation: "The Main Asteroid Belt contains millions of silicate rocks acting as the border line between inner and outer planets."
      },
      {
        id: 5,
        question: "How is deep space telemetry from Voyager 1 transmitted back across billions of kilometers?",
        options: ["Super-powered lasers", "Long wave radio pulses collected by the Deep Space Network", "Exotic particle entanglement", "Satellite reflection drones"],
        answer: 1,
        explanation: "NASA uses the majestic giant tracking dish structures of the Deep Space Network on three continents to fetch Voyager's faint radio hums."
      }
    ]
  }
];
