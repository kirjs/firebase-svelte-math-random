<script>
    import {createFlower, user} from "./firebase";

    let name = 'Flower'
    $: disabled = name === '' || files.length === 0;
    let files = [];
    let input;
    let interval = 1000;
</script>



{#if $user}
    <h2>Form</h2>
    <div><input name="flower" bind:value={name}></div>
    <div><input type="file" bind:this={input} bind:files={files}></div>
    <div><input type="number"  bind:value={interval}></div>

    <div>
        <button on:click={()=>{
        createFlower(name, files[0], interval);
        input.value = '';
        }} {disabled}>Create flower
        </button>
    </div>
{/if}


<style>
 button, input {
     width: 200px;
 }
 h2 {
     margin-top: 30px;
 }

</style>