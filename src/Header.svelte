<script>
    import {login, user, logout, getMessagingToken} from "./firebase";
</script>

<header>
    <h1>❤️️ Flowers</h1>

    <button on:click={getMessagingToken}>Subscribe to notifications</button>
    <div class="login">
        {#if $user}
            {$user?.displayName}
            <button on:click={logout}>logout</button>
        {:else}
            <button on:click={login}>login</button>
        {/if}
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>