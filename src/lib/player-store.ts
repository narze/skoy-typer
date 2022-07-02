import { writable } from "svelte/store"
import randimals from "randimals"
import { nanoid } from "nanoid"

interface Player {
  id: string
  name: string
  // foo?: undefined
}

const defaultPlayer: Player = {
  id: nanoid(),
  name: randimals(),
}

const playerData: Player = {
  ...defaultPlayer,
  ...JSON.parse(localStorage.getItem("skoy-typer-player") || "{}"),
}

// delete playerData.foo

export const player = writable<Player>(playerData)

player.subscribe((value) =>
  localStorage.setItem("skoy-typer-player", JSON.stringify(value)),
)
