<script lang="ts">
  import { onMount } from "svelte";
  import { type User, init } from "@instantdb/core";

  const APP_ID = "3d4e043e-83f3-4581-9277-7b933d50ba9f";
  const db = init({
    appId: APP_ID,
  });

  let loading = true;
  let error: string | null = null;
  let user: User | null = null;
  let email = "";
  let magicCode = "";
  let sentEmail = "";

  function signOut() {
    db.auth.signOut();
  }

  function sendMagicCode(e: Event) {
    e.preventDefault();
    sentEmail = email;
    db.auth.sendMagicCode({ email }).catch((e: any) => {
      alert(`Uh oh! ${e.body?.message}`);
    });
  }

  function verifyMagicCode(e: Event) {
    e.preventDefault();
    db.auth.signInWithMagicCode({ email, code: magicCode }).catch((e: any) => {
      alert(`Uh oh! ${e.body?.message}`);
    });
  }

  onMount(() => {
    db.subscribeAuth((auth) => {
      loading = false;
      if (auth.error) {
        error = auth.error.message;
      } else if (auth.user) {
        user = auth.user;
      }
    });
  });
</script>

{#if loading}
  <div>Loading...</div>
{:else if error}
  <div>Uh oh! {error}</div>
{:else if user}
  <div>
    <h1>Welcome, {user.email}!</h1>
    <button on:click={signOut}>Sign out</button>
  </div>
{:else}
  <div>
    {#if !sentEmail}
      <h3>First and foremost, you can log in with a magic code:</h3>
      <form on:submit={sendMagicCode}>
        <p>
          Enter your email, and we’ll send you a verification code. We'll create
          an account for you too if you don't already have one :)
        </p>
        <input type="email" bind:value={email} placeholder="Email" autofocus />
        <button type="submit">Send code</button>
      </form>
    {/if}

    {#if sentEmail}
      <div>
        <h3>Check your email</h3>
        <p>
          We've sent a magic code to {email}. Enter it below to sign in.
        </p>
        <form on:submit={verifyMagicCode}>
          <input type="text" bind:value={magicCode} placeholder="Magic Code" />
          <button type="submit">Verify code</button>
        </form>
      </div>
    {/if}
  </div>
{/if}
