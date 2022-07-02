<script lang="ts">
  import { nanoid } from "nanoid"

  import Room from "./Room.svelte"
  import url from "./lib/url"
  import NavBar from "./NavBar.svelte"

  $: roomFragment = $url.hash.split(["#/rooms/"])[1]
  $: roomId = roomFragment?.split("/")[0]
  $: createRoom = roomFragment?.split("/")[1] == "create"

  function createNewRoom() {
    const newRoomId = nanoid().slice(0, 6).toUpperCase()
    window.location.hash = `#/rooms/${newRoomId}/create`
  }

  function joinRoom() {
    if (!roomId) {
      return alert("Invalid room ID")
    }
    window.location.hash = `#/rooms/${roomId}`
  }
</script>

{#if $url.hash.indexOf("#/rooms/") === 0 || $url.hash === "#/"}
  <Room {roomId} {createRoom} />
{:else}
  <main class="grid h-screen place-items-center">
    <NavBar />

    <div class="flex flex-col gap-4">
      <h1 class="text-6xl font-bold text-blue-500 font-ubuntu">
        แว้นบอย สก๊อยพิมพ์
      </h1>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2">
          <input
            type="text"
            class="w-full border text-center border-blue-500 focus:ring ring-blue-500 ring-offset-2 p-1 font-prompt rounded-lg shadow-md outline-none duration-200"
            placeholder="พิฒภ์ ROOM ID ลงนั๊บ์ป์ยณิ๊เร่ษ์ย"
            bind:value={roomId}
          />
          <button
            class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 font-bold font-ubuntu text-white tracking-widest active:scale-90 duration-200"
            on:click={joinRoom}>JOIN ห๊อง</button
          >
        </div>
        <span class="text-center"> หรือซภ์ </span>
        <button
          class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold font-ubuntu px-4 py-2 tracking-widest active:scale-90 duration-200"
          on:click={createNewRoom}>ษร๊๊งห๊องใหฒ่</button
        >
      </div>
    </div>
  </main>
{/if}
