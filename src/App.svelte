<script>
    import Header from "./Header.svelte";
    import Flowers from "./Flowers.svelte";
    import {allFlowers, myFlowers} from "./firebase";
    import Form from "./Form.svelte";

</script>

<Header></Header>
<h2>my flowers</h2>
<Flowers flowers={$myFlowers}></Flowers>
<h2>all flowers</h2>
<Flowers flowers={$allFlowers}></Flowers>
<Form/>
