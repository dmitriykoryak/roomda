<template>
    <div class="da-input">
        <input
                v-model="localValue"
                :name="name"
                :type="type"
                :class="inputClass"
                :placeholder="placeholder"
        >
        <div
                v-if="valueIsset"
                class="close-icon-wrap"
                :style="iconStyle"
                @click="localValue = ''"
        >
            <i class="close-icon fas fa-times"></i>
        </div>
    </div>
</template>

<script>
    /**
     * Input
     */
    import '@fortawesome/fontawesome-free/css/all.css';

    export default {
        name: "DaInput",

        props: {
            value: [String, Number],
            name: String,
            type: String,
            placeholder: String,
            inputClass: String,
            iconStyle: Object,
        },

        computed: {
            localValue: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            },
            valueIsset() {
                return !!this.localValue;
            }
        }
    }
</script>

<style scoped lang="scss">
    .da-input{
        position: relative;
        display: flex;
        align-items: center;

        .close-icon-wrap{
            position: absolute;
            right: 20px;
            z-index: 1;
            cursor: pointer;
            .close-icon{
                font-size: 18px;
                color: #111111;
            }
        }

    }
</style>