<script>
    import Form from "./Form.svelte";
    import {deleteFlower, waterFlower} from "./firebase";
    export let flowers = [];

</script>

<main>
    {#each flowers as flower (flower.id)}
        <section>
            <header>
                <h1>{flower.name}</h1>
                <button class="remove" on:click={deleteFlower(flower.id)}>❌</button>
            </header>
            <img alt = "flower" src={flower.url} />
            <div>
                Interval (sec)
                    {flower.interval}


                <div>{flower.lastWatered}</div>
                <div>{flower.nextWatering}</div>
                <button on:click={waterFlower(flower.id, flower.interval)}>💦</button>
            </div>
        </section>
    {/each}
</main>

<style>

    main {
        display: grid;
        grid-template-columns: repeat(auto-fit, 200px);
        gap: 20px;
    }

    header {
        display: flex;
        justify-content: space-between;
    }

    header h1 {
        width: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 16px;
        font-weight: 400;

    }
    img {
        width: 200px;
        height: 200px;
        object-fit: cover;

    }
</style>