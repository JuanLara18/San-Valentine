/**
 * Level data structure for defining platformer levels.
 * All positions are in game coordinates (400x600 canvas).
 */

export interface PlatformData {
  x: number;
  y: number;
  type: 'normal' | 'small' | 'moving';
  /** For moving platforms */
  moveX?: number;
  moveY?: number;
  moveSpeed?: number;
  /** Disappearing platform (level 3) */
  disappearing?: boolean;
}

export interface HeartData {
  x: number;
  y: number;
  isGold?: boolean;
}

export interface EnemyData {
  x: number;
  y: number;
  patrolDistance?: number;
  speed?: number;
  direction?: 'horizontal' | 'vertical';
}

export interface LevelData {
  name: string;
  platforms: PlatformData[];
  hearts: HeartData[];
  enemies: EnemyData[];
  playerStart: { x: number; y: number };
  /** Number of hearts required to complete the level (0 = just reach the end) */
  requiredHearts: number;
  /** Y position of the goal/finish line */
  goalY: number;
  /** Background style */
  bgStyle: 'sunset' | 'storm' | 'night';
  /** Level-specific scroll height (how tall the level is) */
  scrollHeight: number;
}

/**
 * Level Design Notes:
 * - Jump velocity: -420, Gravity: 800 → Max jump height: ~110px
 * - Safe vertical gaps: 60-70px (L1), 65-80px (L2), 70-90px (L3)
 * - Platform widths: normal=64px, small=40px, moving=56px
 * - Player sprite: 32px wide
 * - Max horizontal reach during jump: ~140px (same height), ~120px (jumping up 80px)
 * - Canvas: 400x600
 */
export const levels: LevelData[] = [
  // ===========================
  // Level 1: "El Primer Latido"
  // Tutorial level - gentle introduction, no enemies
  // Gaps: 55-70px vertical, short horizontal hops
  // ===========================
  {
    name: 'level1',
    bgStyle: 'sunset',
    scrollHeight: 1400,
    playerStart: { x: 100, y: 1300 },
    goalY: 80,
    requiredHearts: 5,
    platforms: [
      // Wide ground - room to learn movement
      { x: 50, y: 1350, type: 'normal' },
      { x: 140, y: 1350, type: 'normal' },
      { x: 230, y: 1350, type: 'normal' },
      { x: 320, y: 1350, type: 'normal' },

      // First steps - very gentle (55px gaps, short horizontal)
      { x: 100, y: 1290, type: 'normal' },    // 60px up
      { x: 250, y: 1290, type: 'normal' },    // same height, easy hop right
      { x: 300, y: 1230, type: 'normal' },    // 60px up, short hop
      { x: 160, y: 1170, type: 'normal' },    // 60px up, hop left

      // Getting comfortable (65px gaps)
      { x: 60, y: 1110, type: 'normal' },     // 60px up
      { x: 200, y: 1045, type: 'normal' },    // 65px up
      { x: 330, y: 985, type: 'normal' },     // 60px up
      { x: 180, y: 920, type: 'normal' },     // 65px up

      // Mid section (65-70px gaps)
      { x: 60, y: 855, type: 'normal' },      // 65px up
      { x: 220, y: 790, type: 'normal' },     // 65px up
      { x: 340, y: 730, type: 'normal' },     // 60px up
      { x: 150, y: 665, type: 'normal' },     // 65px up

      // Upper section
      { x: 50, y: 600, type: 'normal' },      // 65px up
      { x: 200, y: 535, type: 'normal' },     // 65px up
      { x: 330, y: 470, type: 'normal' },     // 65px up
      { x: 160, y: 405, type: 'normal' },     // 65px up

      // Final stretch
      { x: 60, y: 340, type: 'normal' },      // 65px up
      { x: 220, y: 275, type: 'normal' },     // 65px up
      { x: 120, y: 210, type: 'normal' },     // 65px up
      { x: 250, y: 145, type: 'normal' },     // 65px up
      { x: 200, y: 80, type: 'normal' },      // 65px up - GOAL
    ],
    hearts: [
      // Hearts placed right on the path, easy to collect
      { x: 250, y: 1260 },
      { x: 160, y: 1140 },
      { x: 330, y: 955 },
      { x: 60, y: 825 },
      { x: 340, y: 700 },
      { x: 50, y: 570 },
      { x: 330, y: 440 },
      { x: 220, y: 245 },
      { x: 250, y: 115 },  // Between last two platforms, before goal zone
    ],
    enemies: [],
  },

  // ===========================
  // Level 2: "Cruzando Tormentas"
  // Moving platforms + enemies introduced
  // Gaps: 65-80px vertical
  // ===========================
  {
    name: 'level2',
    bgStyle: 'storm',
    scrollHeight: 1600,
    playerStart: { x: 80, y: 1500 },
    goalY: 80,
    requiredHearts: 7,
    platforms: [
      // Ground
      { x: 60, y: 1550, type: 'normal' },
      { x: 150, y: 1550, type: 'normal' },
      { x: 240, y: 1550, type: 'normal' },

      // First steps with a moving platform intro
      { x: 100, y: 1485, type: 'normal' },     // 65px up
      { x: 280, y: 1420, type: 'normal' },     // 65px up
      { x: 120, y: 1350, type: 'moving', moveX: 80, moveSpeed: 2500 },  // 70px up, slow moving
      { x: 300, y: 1285, type: 'normal' },     // 65px up

      // Getting harder - enemies appear
      { x: 120, y: 1215, type: 'normal' },     // 70px up
      { x: 280, y: 1145, type: 'small' },      // 70px up, smaller target
      { x: 100, y: 1075, type: 'moving', moveX: 100, moveSpeed: 2200 }, // 70px up
      { x: 300, y: 1005, type: 'normal' },     // 70px up

      // Mid section - mixing mechanics
      { x: 140, y: 935, type: 'normal' },      // 70px up
      { x: 300, y: 860, type: 'moving', moveX: -80, moveSpeed: 2000 },  // 75px up
      { x: 80, y: 790, type: 'normal' },       // 70px up
      { x: 250, y: 720, type: 'small' },       // 70px up

      // Upper section
      { x: 80, y: 650, type: 'moving', moveX: 100, moveSpeed: 2000 },   // 70px up
      { x: 300, y: 580, type: 'normal' },      // 70px up
      { x: 140, y: 510, type: 'normal' },      // 70px up
      { x: 300, y: 435, type: 'moving', moveX: -70, moveSpeed: 1800 },  // 75px up

      // Final
      { x: 100, y: 360, type: 'normal' },      // 75px up
      { x: 260, y: 290, type: 'normal' },      // 70px up
      { x: 120, y: 220, type: 'small' },       // 70px up
      { x: 260, y: 150, type: 'normal' },      // 70px up
      { x: 200, y: 80, type: 'normal' },       // 70px up - GOAL
    ],
    hearts: [
      { x: 280, y: 1390 },
      { x: 160, y: 1320 },
      { x: 120, y: 1185 },
      { x: 300, y: 975 },
      { x: 140, y: 905 },
      { x: 80, y: 760 },
      { x: 250, y: 690 },
      { x: 300, y: 550 },
      { x: 140, y: 480 },
      { x: 100, y: 330 },
      { x: 260, y: 260 },
      { x: 200, y: 50 },
    ],
    enemies: [
      // Enemies on wider platforms, easier to dodge at first
      { x: 280, y: 1410, patrolDistance: 40, speed: 40 },
      { x: 120, y: 1205, patrolDistance: 50, speed: 45 },
      { x: 140, y: 925, patrolDistance: 40, speed: 50 },
      { x: 80, y: 780, patrolDistance: 30, speed: 50 },
      { x: 300, y: 570, patrolDistance: 40, speed: 55 },
      { x: 100, y: 350, patrolDistance: 35, speed: 55 },
    ],
  },

  // ===========================
  // Level 3: "El Gran Gesto"
  // All mechanics: moving, disappearing, enemies
  // Gaps: 70-85px vertical
  // ===========================
  {
    name: 'level3',
    bgStyle: 'night',
    scrollHeight: 1800,
    playerStart: { x: 80, y: 1700 },
    goalY: 80,
    requiredHearts: 8,
    platforms: [
      // Ground
      { x: 60, y: 1750, type: 'normal' },
      { x: 150, y: 1750, type: 'normal' },
      { x: 240, y: 1750, type: 'normal' },

      // Warm up with all mechanics gently
      { x: 100, y: 1680, type: 'normal' },     // 70px up
      { x: 280, y: 1610, type: 'normal' },     // 70px up
      { x: 100, y: 1540, type: 'moving', moveX: 80, moveSpeed: 2200 },  // 70px up
      { x: 300, y: 1470, type: 'normal' },     // 70px up
      { x: 130, y: 1400, type: 'small', disappearing: true },           // 70px up
      { x: 280, y: 1400, type: 'normal' },     // safety alternative same height

      // Mid section - tighter
      { x: 100, y: 1325, type: 'normal' },     // 75px up
      { x: 280, y: 1250, type: 'moving', moveX: -70, moveSpeed: 2000 }, // 75px up
      { x: 100, y: 1175, type: 'normal' },     // 75px up
      { x: 300, y: 1100, type: 'small' },      // 75px up
      { x: 120, y: 1025, type: 'normal' },     // 75px up
      { x: 300, y: 950, type: 'small', disappearing: true },            // 75px up
      { x: 160, y: 950, type: 'normal' },      // safety alternative

      // Upper section - challenging but fair
      { x: 80, y: 875, type: 'moving', moveX: 100, moveSpeed: 1800 },   // 75px up
      { x: 300, y: 800, type: 'normal' },      // 75px up
      { x: 120, y: 720, type: 'small', disappearing: true },            // 80px up
      { x: 280, y: 720, type: 'small' },       // safety alternative
      { x: 200, y: 645, type: 'moving', moveX: -60, moveSpeed: 1800 },  // 75px up
      { x: 80, y: 570, type: 'normal' },       // 75px up
      { x: 280, y: 495, type: 'normal' },      // 75px up

      // Final stretch
      { x: 100, y: 420, type: 'moving', moveX: 80, moveSpeed: 1600 },   // 75px up
      { x: 300, y: 345, type: 'small' },       // 75px up
      { x: 140, y: 270, type: 'normal' },      // 75px up
      { x: 280, y: 195, type: 'small', disappearing: true },            // 75px up
      { x: 140, y: 195, type: 'normal' },      // safety
      { x: 200, y: 120, type: 'normal' },      // 75px up
      { x: 200, y: 80, type: 'normal' },       // 40px up - GOAL with gold heart
    ],
    hearts: [
      { x: 280, y: 1580 },
      { x: 150, y: 1510 },
      { x: 300, y: 1440 },
      { x: 100, y: 1295 },
      { x: 100, y: 1145 },
      { x: 120, y: 995 },
      { x: 300, y: 770 },
      { x: 200, y: 615 },
      { x: 80, y: 540 },
      { x: 300, y: 465 },
      { x: 140, y: 240 },
      { x: 200, y: 165 },
      { x: 200, y: 50, isGold: true },
    ],
    enemies: [
      { x: 100, y: 1670, patrolDistance: 40, speed: 45 },
      { x: 300, y: 1460, patrolDistance: 35, speed: 50 },
      { x: 100, y: 1315, patrolDistance: 40, speed: 50 },
      { x: 120, y: 1015, patrolDistance: 35, speed: 55 },
      { x: 300, y: 790, patrolDistance: 40, speed: 55 },
      { x: 80, y: 560, patrolDistance: 35, speed: 60 },
      { x: 280, y: 485, patrolDistance: 30, speed: 60 },
      { x: 140, y: 260, patrolDistance: 30, speed: 55 },
    ],
  },
];
