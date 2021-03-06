<script>
import { mapState } from 'vuex'

export default {
    props: {
        scoreChoosen: {
            type: Boolean,
            required: true
        },
        initialScoreList: {
            type: Array,
            required: true
        },
        initialFoolNumber: {
            type: Number,
            required: true
        },
        limit: {
            type: Number,
            default: 0
        },
        canDragScore: {
            type: Boolean,
            default: true
        },
        isLocked: {
            type: Boolean,
            default: true
        },
        firstScoreRounded: {
            type: Boolean,
            default: false
        },
        firstScoreIpponGashi: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapState('configuration', ["FIGHT_NB_FOOL_GIVE_IPPON","FIGHT_FOOL_CODE","FIGHT_SCORE_REACHED_CODE"]),
        score_length() {
            return this.score_list.length
        },
        last_score_index() {
            return this.score_length - 1
        },
        limit_score_reached() {
            if (this.limit === 0)
                return false

            return this.score_length >= this.limit
        },
        limit_fool_reached() {
            return this.fool_count > 0 && this.fool_count % this.FIGHT_NB_FOOL_GIVE_IPPON === 0
        },
        can_drag_score() {
            return this.canDragScore && !this.limit_score_reached
        }
    },
    methods: {
        onAdd(ev) {
            if (ev.newIndex !== this.last_score_index)
                this.score_list.splice(this.last_score_index, 0, this.score_list.splice(ev.newIndex, 1)[0]);

            const last_item_added = this.score_list.splice(this.last_score_index, 1)[0]

            if (last_item_added.code === this.FIGHT_FOOL_CODE)
                this.addFool()
            else
                this.addScore(last_item_added)
        },
        addScore(score) {
            if (!this.can_drag_score)
                return

            this.score_list.push(score)

            this.$emit('on-score-add', score)

            if (this.limit_score_reached || score.code === this.FIGHT_SCORE_REACHED_CODE)
                this.$emit('on-score-reached')
        },
        removeScore(score) {
            const index = this.score_list.findIndex(s => s.code === score.code)
            const was_limit_score_reached = this.limit_score_reached

            this.score_list.splice(index, 1)

            this.$emit('on-score-remove', score)

            if (was_limit_score_reached || score.code === this.FIGHT_SCORE_REACHED_CODE)
                this.$emit('on-score-unreached')
        },
        removeFool() {
            const was_limit_fool_reached = this.limit_fool_reached

            this.fool_count--
            this.$emit('on-fool-update', this.fool_count)

            if (was_limit_fool_reached)
                this.$emit('on-fool-unreached')
        },
        addFool() {
            if (!this.can_drag_score)
                return

            this.fool_count++
            this.$emit('on-fool-update', this.fool_count)

            if (this.limit_fool_reached)
                this.$emit('on-fool-reached')
        },
        clean() {
            if (this.score_list.length)
                Array.from(this.score_list).forEach(score => this.removeScore(score))

            this.fool_count = 0
            this.$emit('on-fool-update', this.fool_count)
        },
        onModalRemoveConfirmation(item) {
            if (undefined === item)
                this.removeFool()
            else
                this.removeScore(item)
        },
        onButtonRemoveClick(item) {
            this.$refs.modalDeleteScore.show(item)
        }
    },
    data() {
        return {
            score_list: [],
            fool_count: 0,
        }
    },
    mounted() {
        this.score_list = Array.from(this.initialScoreList) // copy score_list because it can be vuex data
        this.fool_count = this.initialFoolNumber
    }
}
</script>

<template>
    <div class="card score-drag-container" :class="{ 'ripple-out': scoreChoosen && can_drag_score }">
        <draggable
            class="card-body"

            :list="score_list"
            :group="{ name: 'score', pull: false, put: true }"
            :sort="false"
            :disabled="!can_drag_score"
            
            @add="onAdd"
        >
            <span v-for="(score, index) in score_list" :key="index" :title="score.name" class="animated flipInX score-item" :class="{ 'score-item__rounded': firstScoreRounded && index === 0, 'score-item__ippon-gashi': firstScoreIpponGashi }">
                <button
                    title="Supprimer le score"
                    class="btn btn-danger btn-sm animated bounceIn faster"

                    v-if="!isLocked"

                    @click.prevent="onButtonRemoveClick(score)"
                >
                    <i class="zmdi zmdi-close"></i>
                </button>
                <span v-html="score.code"></span>
            </span>

        </draggable>

        <div class="fool-wrapper">
            <span v-for="fool_number in fool_count" :key="fool_number">
                <button
                    title="Supprimer la pénalité"
                    class="btn btn-danger btn-sm animated bounceIn faster"

                    v-if="!isLocked"

                    @click.prevent="onButtonRemoveClick()"
                >
                    <i class="zmdi zmdi-close"></i>
                </button>
                <span v-html="FIGHT_FOOL_CODE"></span>
            </span>
        </div>

        <modal-delete-confirmation
            ref="modalDeleteScore"
            @on-delete="onModalRemoveConfirmation"
        >
            <template slot="content">
                Attention, selon le score que vous enlevez, vous allez modifier l'ordre d'attribution des scores restants
            </template>
        </modal-delete-confirmation>
    </div>
</template>

<style lang="scss" scoped>
    .score-drag-container {
        position: relative;

        .card-body  {
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            
            > span {
                position: relative;
                margin: 15px;
                font-size: 5rem;
                font-weight: bold;
                text-align: center;
                width: 100px;
                transition: all 1s ease;

                &.score-item__rounded {
                    border-radius: 100%;
                    border: #fff solid 2px;
                }

                &.score-item__ippon-gashi {
                    &:after {
                        content: "1";
                        position: absolute;
                        bottom: 0;
                        right: -15px;
                        border-radius: 100%;
                        border: #fff solid 2px;
                        font-size: 1rem;
                        width: 23px;
                    }
                }
            }
        }

        .fool-wrapper {
            position: absolute;
            display: block;
            bottom: 45px;
            right: 45px;
            font-size: 4rem;
            z-index: 0;

            > span:nth-child(2n) {
                padding-right: 15px;
            }
        }

        .score-item, .fool-wrapper {
            &:hover {
                .btn {
                    display: block;
                }    
            }

            .btn {
                position: absolute;
                display: none;
                border-radius: 100%;
                z-index: 1;
                right: 0;
                top: 0;
            }
        }
    }
</style>