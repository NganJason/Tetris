import React, { useState } from "react";

import bgm from "../music/tetris_bgm.mp3";
import boo from "../music/boo.mp3";
import laser from "../music/laser.mp3";

import Display from "./Display";
import Stage from "./Stage";
import StartButton from "./StartButton";
import {
  StyledTetris,
  StyledTetrisWrapper,
} from "../components/styles/StyledTetris";

import { createStage, checkCollision, hardDrop } from "../gameHelpers";
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useInterval } from "../hooks/useInterval";
import { useGameStatus } from "../hooks/useGameStatus";
import { useAudio } from "../hooks/useAudio";

const Tetris = () => {
  const [playBGM, resetBGM, BGM] = useAudio(bgm);
  const [playDrop, resetDrop, Drop] = useAudio(laser);
  const [playBoo, resetBoo, Boo] = useAudio(boo);
  BGM.volume = 0.2;
  Drop.volume = 0.7;

  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [pause, setPause] = useState(false);
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  const startGame = () => {
    // Reset everything
    setPause(false);
    setStage(createStage());
    resetPlayer();
    setDropTime(1000);
    setGameOver(false);
    setScore(0);
    setLevel(0);
    setRows(0);
    resetBGM(true);
  };

  const pauseGame = () => {
    let pause_copy = !pause;
    if (pause_copy) {
      setDropTime(null);
      playBGM(false);
    } else {
      setDropTime(1000 / (level + 1) + 200);
      playBGM(true);
    }
    setPause(pause_copy);
  };

  const resetGame = () => {
    setStage(createStage());
    setDropTime(null);
    setLevel(0);
    setRows(0);
    setScore(0);
    playBGM(false);
    playBoo(true);
  };

  const move = ({ keyCode }) => {
    if (!gameOver && !pause) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      } else if (keyCode === 32) {
        dropBtm();
      }
    }
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        console.log("GAME OVER!!!");
        setGameOver(true);
        playBGM(false);
        playBoo(true);
        setDropTime(false);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropBtm = () => {
    setDropTime(null);
    let dist = hardDrop(player, stage);
    updatePlayerPos({ x: 0, y: dist - 1, collided: true });
    playDrop(true);
  };

  const movePlayer = (dir) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const keyUp = (e) => {
    if (!gameOver && !pause) {
      if (e.keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      } else if (e.keyCode === 32) {
        setDropTime(1000 / (level + 1) + 200);
        e.preventDefault();
      }
    }
  };

  useInterval(() => {
    drop();
    if (gameOver) {
      setDropTime(null);
    }
  }, dropTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={(e) => move(e)}
      onKeyUp={(e) => keyUp(e)}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`SCORE: ${score}`} />
              <Display text={`ROWS: ${rows}`} />
              <Display text={`LEVEL: ${level}`} />
            </div>
          )}

          <StartButton callback={startGame} text="Start Game" />
          <StartButton
            callback={pauseGame}
            text={pause ? "Resume Game" : "Pause Game"}
          />
          <StartButton callback={resetGame} text="Give Up" />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
