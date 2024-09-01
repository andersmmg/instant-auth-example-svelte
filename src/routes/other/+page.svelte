<script lang="ts">
    import { auth } from "$lib/data";
</script>
{#if $auth.user}
Hi there, {$auth.user?.email}
{:else}
You are not logged in!
{/if}
<br>
<a href="/">Go Back</a>