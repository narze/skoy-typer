<script lang="ts">
  import type { GamePlayer, svelteStore } from "./lib/synced-store"
  import SVGIcon from "./lib/SVGIcon.svelte"
  import { player } from "./lib/player-store"
  import Words from "./lib/words"
  import Skoy from "skoy"
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"

  const MAX_ROUNDS = 20

  export let store: typeof svelteStore
  export let nextState: () => void
  let currentPlayerBeforeMove: GamePlayer
  let words = Words.words
  let input

  const playerId = $player.id
  $: players = $store.players
  $: currentPlayerIdx = $store.players.findIndex((p) => p.id == playerId)
  $: currentPlayerScore = players[currentPlayerIdx].score
  $: currentWordIdx = $store.gameData.currentWordIdx
  $: currentWord = words[currentWordIdx] || "xxxxxxxxxxxxxxxxx"
  // $: currentPlayerIdx = $store.gameData.currentPlayerIdx || 0
  // $: maxDistance = $store.gameData.maxDistance || 0
  // $: distance = $store.gameData.distance || 0
  // $: rolled = $store.gameData.rolled || false
  $: currentPlayerBeforeMove = $store.gameData.currentPlayerBeforeMove || {}
  $: gameEnded = $store.gameData.gameEnded || false
  $: alreadyGuessed = $store.gameData.alreadyGuessed || false
  // $: isMyTurn = players[currentPlayerIdx].id === playerId
  // $: currentPlayer = players[currentPlayerIdx]
  $: isRoomOwner = $store.players.find((p) => p.id == playerId)?.admin
  $: adminUpdatedAt = $store.gameData.adminUpdatedAt

  let roundCount = 1
  let wrong = false
  let right = false

  $: if (adminUpdatedAt) {
    if (input) {
      input.focus()
    }
    wrong = false
    right = false

    // wordInput = ""
  }

  // $: console.log(JSON.parse(JSON.stringify(players)))

  // let currentWord = words[~~(Math.random() * words.length)]
  // let solution = ""
  let wordInput = ""

  // $: console.log({ currentWord })
  $: if (roundCount > MAX_ROUNDS) {
    $store.gameData.gameEnded = true
  }

  onMount(() => {
    if (isRoomOwner) {
      $store.gameData.currentWordIdx = ~~(Math.random() * words.length)
    }
  })

  function showSolution() {
    // solution = currentWord
    $store.gameData.alreadyGuessed = true
  }

  function guess() {
    if (gameEnded) {
      return
    }
    // console.log({ wordInput, currentWord })

    if (wordInput === currentWord && !alreadyGuessed) {
      showSolution()
      players[currentPlayerIdx].score += 1
      wrong = false
      right = true
    } else {
      wrong = true
      right = false
    }

    wordInput = ""
  }

  function skip() {
    roundCount += 1
    $store.gameData.alreadyGuessed = false
    $store.gameData.roundCount++
    // solution = ""
    $store.gameData.currentWordIdx = ~~(Math.random() * words.length)
    // words = words.filter((w) => w !== currentWord)
    // currentWord = words[~~(Math.random() * words.length)]
    // wrong = false
    // right = false
    $store.gameData.adminUpdatedAt = new Date()
  }

  // const directions = {
  //   up: "🔼",
  //   right: "▶️",
  //   down: "🔽",
  //   left: "◀️",
  // }

  // const map: boolean[][] = $store.gameData.map

  // $: mapWithPlayers = map.map((row, y) =>
  //   row.map((hole, x) => ({
  //     x,
  //     y,
  //     hole,
  //     player: players.find(
  //       (player) => player.x === x && player.y === y && player.hp > 0,
  //     ),
  //   })),
  // )

  // $: attackable = isMyTurn && rolled && distance == maxDistance
  // $: canWalk = {
  //   up:
  //     isMyTurn &&
  //     rolled &&
  //     walkable(currentPlayer.x, currentPlayer.y - 1, "up"),
  //   down:
  //     isMyTurn &&
  //     rolled &&
  //     walkable(currentPlayer.x, currentPlayer.y + 1, "down"),
  //   left:
  //     isMyTurn &&
  //     rolled &&
  //     walkable(currentPlayer.x - 1, currentPlayer.y, "left"),
  //   right:
  //     isMyTurn &&
  //     rolled &&
  //     walkable(currentPlayer.x + 1, currentPlayer.y, "right"),
  // }

  // function onUp() {
  //   const player = players[currentPlayerIdx]
  //   if (!walkable(player.x, player.y - 1)) {
  //     return
  //   }
  //   $store.players[currentPlayerIdx].direction = "up"
  //   $store.players[currentPlayerIdx].y = player.y - 1
  //   $store.gameData.distance = distance + 1
  // }

  // function onLeft() {
  //   const player = players[currentPlayerIdx]
  //   if (!walkable(player.x - 1, player.y)) {
  //     return
  //   }
  //   $store.players[currentPlayerIdx].direction = "left"
  //   $store.players[currentPlayerIdx].x = player.x - 1
  //   $store.gameData.distance = distance + 1
  // }

  // function onRight() {
  //   const player = players[currentPlayerIdx]
  //   if (!walkable(player.x + 1, player.y)) {
  //     return
  //   }
  //   $store.players[currentPlayerIdx].direction = "right"
  //   $store.players[currentPlayerIdx].x = player.x + 1
  //   $store.gameData.distance = distance + 1
  // }

  // function onDown() {
  //   const player = players[currentPlayerIdx]
  //   if (!walkable(player.x, player.y + 1)) {
  //     return
  //   }
  //   $store.players[currentPlayerIdx].direction = "down"
  //   $store.players[currentPlayerIdx].y = player.y + 1
  //   $store.gameData.distance = distance + 1
  // }

  // function onAtk() {
  //   if (!attackable) {
  //     return
  //   }

  //   const player = players[currentPlayerIdx]
  //   let targetIdx

  //   switch (player.direction) {
  //     case "up":
  //       targetIdx = players.findIndex(
  //         (p) => p.hp > 0 && p.x === player.x && p.y === player.y - 1,
  //       )
  //       if (targetIdx != -1) {
  //         players[targetIdx].hp -= 1
  //         players[targetIdx].y -= 1
  //         checkPlayerInHole(targetIdx)
  //       }
  //       break
  //     case "right":
  //       targetIdx = players.findIndex(
  //         (p) => p.hp > 0 && p.x === player.x + 1 && p.y === player.y,
  //       )
  //       if (targetIdx != -1) {
  //         players[targetIdx].hp -= 1
  //         players[targetIdx].x += 1
  //         checkPlayerInHole(targetIdx)
  //       }
  //       break
  //     case "down":
  //       targetIdx = players.findIndex(
  //         (p) => p.hp > 0 && p.x === player.x && p.y === player.y + 1,
  //       )
  //       if (targetIdx != -1) {
  //         players[targetIdx].hp -= 1
  //         players[targetIdx].y += 1
  //         checkPlayerInHole(targetIdx)
  //       }
  //       break
  //     case "left":
  //       targetIdx = players.findIndex(
  //         (p) => p.hp > 0 && p.x === player.x - 1 && p.y === player.y,
  //       )
  //       if (targetIdx != -1) {
  //         players[targetIdx].hp -= 1
  //         players[targetIdx].x -= 1
  //         checkPlayerInHole(targetIdx)
  //       }
  //       break
  //   }

  //   endTurn()
  // }

  // function checkPlayerInHole(playerIdx) {
  //   const player = players[playerIdx]

  //   if (map[player.y]?.[player.x] == true) {
  //     $store.players[playerIdx].hp = 0
  //   }
  // }

  // function walkable(x, y, direction = "none") {
  //   const directionOpposite = {
  //     up: "down",
  //     down: "up",
  //     left: "right",
  //     right: "left",
  //   }

  //   if (distance >= maxDistance) return false
  //   if (distance > 0 && currentPlayer.direction == directionOpposite[direction])
  //     return false
  //   if (mapWithPlayers[y]?.[x].hole) return false
  //   if (mapWithPlayers[y]?.[x].player) return false

  //   return true
  // }

  // function rollDice() {
  //   $store.gameData.currentPlayerBeforeMove = { ...currentPlayer }
  //   $store.gameData.maxDistance = ~~(Math.random() * 6) + 1
  //   $store.gameData.rolled = true
  // }

  // function resetWalk() {
  //   $store.players[currentPlayerIdx].x = currentPlayerBeforeMove.x
  //   $store.players[currentPlayerIdx].y = currentPlayerBeforeMove.y
  //   $store.players[currentPlayerIdx].direction =
  //     currentPlayerBeforeMove.direction
  //   $store.gameData.distance = 0
  // }

  // // get next player that is not dead yet
  // function getNextLivingPlayerIdx() {
  //   for (let c = 1; c < players.length; c++) {
  //     const nextPlayerIdx = (currentPlayerIdx + c) % players.length

  //     if ($store.players[nextPlayerIdx].hp > 0) {
  //       return nextPlayerIdx
  //     }
  //   }

  //   return currentPlayerIdx
  // }

  // function endTurn() {
  //   checkWinner()

  //   $store.gameData.currentPlayerIdx = getNextLivingPlayerIdx()
  //   $store.gameData.rolled = false
  //   $store.gameData.distance = 0
  //   $store.gameData.maxDistance = 0
  // }

  // function restartGame() {
  //   $store.gameData.currentPlayerIdx = 0
  //   $store.gameData.rolled = false
  //   $store.gameData.distance = 0
  //   $store.gameData.maxDistance = 0
  //   $store.players.forEach((p) => {
  //     delete p.x
  //     delete p.y
  //     delete p.direction
  //     delete p.score
  //   })
  //   $store.gameData.gameEnded = false

  //   nextState()
  // }

  // function checkWinner() {
  //   if (players.filter((p) => p.hp > 0).length === 1) {
  //     const winner = players.filter((p) => p.hp > 0)[0]
  //     alert(`${winner.name} won!`)
  //     $store.gameData.gameEnded = true
  //   }
  // }
</script>

<div class="flex flex-col gap-12 justify-between w-full">
  <div class="flex flex-col gap-6 border-blue-500 container mx-auto">
    <div class="flex flex-col gap-2">
      {#each players as player, idx}
        <div class={`font-prompt ${player.color} px-2 py-1 rounded-lg`}>
          <p class="flex gap-2">
            <span
              >{player.name}
              {player.id === playerId ? "(You)" : ""}
            </span>
            <span class="flex-1 text-right">
              {player.score} ฆะเเนณร์
            </span>
          </p>
        </div>
      {/each}
    </div>
    <span class="text-6xl font-bold font-ubuntu text-blue-500 border-t-2" />
    <div class="flex flex-col gap-4">
      {#if isRoomOwner}
        {#if gameEnded}
          จบเกม!

          <div class="flex justify-center gap-2">
            <button class="btn btn-error" on:click={() => (location.href = "/")}
              >Back</button
            >
          </div>
        {:else}
          <div class="my-8" />

          ฆำที่ซ๋ว์: {roundCount} / {MAX_ROUNDS}
          <h1
            class="text-6xl border rounded-xl border-green-600 p-8"
            in:fly={{ y: 200, duration: 2000 }}
          >
            {Skoy.convert(currentWord)}
          </h1>

          {#if alreadyGuessed}
            <h1
              class="text-3xl text-green-600"
              in:fly={{ y: 200, duration: 2000 }}
            >
              {currentWord}
            </h1>
          {/if}

          <div class="my-8" />

          <button class="btn" on:click={showSolution}>Solution</button>
          <button class="btn" on:click={skip}>Skip</button>
        {/if}
      {:else}
        คะแณนฮ์ค๋องคุญ: {currentPlayerScore || 0}
        <form on:submit|preventDefault={guess} class="flex flex-col gap-3">
          <!-- svelte-ignore a11y-autofocus -->
          <input
            bind:this={input}
            type="text"
            class={`input input-xl text-4xl h-24 text-center ${
              wrong ? "bg-red-400" : ""
            }`}
            placeholder={right ? Skoy.convert("ถูกต้อง!") : ""}
            bind:value={wordInput}
            autofocus={true}
            disabled={alreadyGuessed}
          />

          <button type="submit" class="btn btn-lg" disabled={alreadyGuessed}
            >ฑายคำาม์</button
          >
        </form>
      {/if}
    </div>
  </div>
</div>
