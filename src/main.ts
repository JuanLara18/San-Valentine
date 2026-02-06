import Phaser from 'phaser';
import { gameConfig } from './config/game.config';
import { initI18n, updateHtmlTranslations } from './i18n';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { NameScene } from './scenes/NameScene';
import { StoryScene } from './scenes/StoryScene';
import { GameScene } from './scenes/GameScene';
import { VictoryScene } from './scenes/VictoryScene';
import { REGISTRY } from './utils/constants';

async function launch() {
  await initI18n();
  updateHtmlTranslations();

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: gameConfig.width,
    height: gameConfig.height,
    backgroundColor: gameConfig.backgroundColor,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: gameConfig.physics.gravity },
        debug: false,
      },
    },
    scene: [BootScene, MenuScene, NameScene, StoryScene, GameScene, VictoryScene],
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
    input: {
      activePointers: 3,
    },
  };

  const game = new Phaser.Game(config);

  // Initialize registry with default values
  game.registry.set(REGISTRY.PLAYER_NAME, '');
  game.registry.set(REGISTRY.NICKNAME, '');
  game.registry.set(REGISTRY.CURRENT_LEVEL, 1);
  game.registry.set(REGISTRY.LIVES, 3);
  game.registry.set(REGISTRY.HEARTS_COLLECTED, 0);
}

launch();
