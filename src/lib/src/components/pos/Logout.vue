<template>
    <v-btn icon @click="$store.dispatch('logout')">
        <v-icon>exit_to_app</v-icon>
    </v-btn>
</template>

<script>
    export default {
        name: 'logout',
    }
</script>
