<template>
    <div class="da-container">
        <slot></slot>
    </div>
</template>

<script>

    export default {
        name: 'da-container',
    }
</script>

<style lang="scss">
    .da-container {
       padding: 10px;
    }

    @media all and (max-width: 600px) {
        .da-container {
            padding-left: 4px;
            padding-right: 4px;
        }
    }
</style>
