<script>
export default { // TODO shared parent component
    props: {
        value: Object
    },
    methods: {
        update() {
            this.$emit("input", {
                name: this.name,
                tree_configuration: this.config
            })
        }
    },
    watch: {
        config: {
            handler: function() { this.update() },
            deep: true,
            immediate: true
        },
        value: function () { if (undefined == this.value) this.update() }
    },
    data() {
        return {
            name: "Arbre éliminatoire",
            config: {
                repulse_favorite: false,
                repulse_club: false,
                third_place: false,
                locked: false
            }
        }
    },
    mounted() {
        if (undefined !== this.value) {
            this.config = this.value.tree_configuration
            this.update()
        }
    }
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/software/competition/create.json"></i18n>

<template>
    <div class="card">
        <div class="card-header">{{ $t("competition-create.formula.tree.card-title") }}</div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-12">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.repulse_favorite">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">{{ $t("competition-create.formula.repulse-favorite") }} (<i class="zmdi zmdi-star text-yellow"></i>)</span>
                    </label>
                </div>

                <div class="col-md-12">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.repulse_club">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">{{ $t("competition-create.formula.repulse-club") }}</span>
                    </label>
                </div>

                <div class="col-md-12">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.third_place">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">{{ $t("competition-create.formula.tree.third-place") }}</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>