<script lang="ts">
    import { onMount } from "svelte";
    import { type User, init } from "@instantdb/core";
    import { db } from "$lib/data";
    import type { PageData } from "./$types";

    export let data : PageData;
  
    let user: User | null = null;
    let loading = true;
    let authError = "";
    let email = "";
    let showMagicCodeInput = false;
  
    let googAuthURI = "";
  
    onMount(() => {
      db.subscribeAuth((auth) => {
        if (auth.error) {
          authError = auth.error.message;
        } else if (auth.user) {
          user = auth.user;
        } else {
          user = null;
        }
        loading = false;
      });
  
      // Set up Google Auth URI
      googAuthURI = db.auth.createAuthorizationURL({
        clientName: "google-web",
        redirectURL: window.location.href,
      });
    });
  
    async function sendMagicCode() {
      try {
        await db.auth.sendMagicCode({ email });
        showMagicCodeInput = true;
      } catch (e: any) {
        alert(`Uh oh! ${e.body?.message}`);
      }
    }
  
    async function verifyMagicCode(code: string) {
      try {
        await db.auth.signInWithMagicCode({ email, code });
      } catch (e: any) {
        alert(`Uh oh! ${e.body?.message}`);
      }
    }
  
    function signOut() {
      db.auth.signOut();
    }
  </script>
  User: {data.user}<br>
  Auth Error: {data.authError}
  {#if loading}
    <div>Loading...</div>
  {:else if authError}
    <div>Uh oh! {authError}</div>
  {:else if user}
    <div>
      <h1>Welcome, {user.email}!</h1>
      <button on:click={signOut}>Sign out</button>
    </div>
  {:else}
    <div>
      <h3>First and foremost, you can log in with a magic code:</h3>
      <form on:submit|preventDefault={sendMagicCode}>
        <p>
          Enter your email, and we'll send you a verification code. We'll create an account for you too if you don't
          already have one :
        </p>
        <input type="email" bind:value={email} placeholder="Email" />
        <button type="submit">Send code</button>
      </form>
      {#if showMagicCodeInput}
        <form on:submit|preventDefault={(e) => verifyMagicCode(e.target?.code.value)}>
          <h3>Check your email</h3>
          <p>
            We've sent a magic code to {email}. Enter it below to sign in.
          </p>
          <input type="text" name="code" placeholder="Magic Code" />
          <button type="submit">Verify code</button>
        </form>
      {/if}
      <hr />
      <div>
        <h3>You can use Google too</h3>
        <p>Just click <a href={googAuthURI}>Sign in with Google</a> to get you started</p>
      </div>
    </div>
  {/if}
  
  <style>
    /* Add any styles here */
  </style>
  