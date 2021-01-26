<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>Редагувати</h4>
            </div>

            <form @submit.prevent="submitHandler">
                <div class="input-field" >
                    <select ref="select" v-model="current">
                        <option v-for="cat of categories" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                    </select>
                    <label>Виберіть категорію</label>
                </div>

                <div class="input-field">
                    <input
                            id="name"
                            type="text"
                            v-model="title"
                            :class="{ invalid: ($v.title.$dirty && !$v.title.required)}"
                    >
                    <label for="name">Назва</label>
                    <span class="helper-text invalid" v-if="$v.title.$dirty && !$v.title.required">Введіть назву </span>
                </div>
                <div class="input-field">
                    <input
                            id="limit"
                            type="number"
                            v-model.number="limit"
                            :class="{ invalid: ($v.limit.$dirty && !$v.limit.minValue)}"
                    >
                    <label for="limit">Лімiт</label>
                    <span class="helper-text invalid" v-if="$v.limit.$dirty && !$v.limit.minValue">Мінімальна величина {{ $v.limit.$params.minValue.min }}</span>
                </div>

                <button class="btn waves-effect waves-new-red" type="submit">
                    Обновити
                    <i class="material-icons right">send</i>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import { required, minValue } from 'vuelidate/lib/validators'

    export default {
        name: "CategoryEdit",
        data: () => ({
            select: null,
            title: '',
            limit: 100,
            current: null
        }),
        validations: {
            title: { required },
            limit: { minValue: minValue(100)}
        },
        props: {
          categories: {
              type: Array,
              required: true
          }
        },
        watch: {
            current (catId) {
               const {title, limit} = this.categories.find(cat => cat.id === catId)
                this.title = title;
                this.limit = limit
            }
        },
        created() {
            const {id, title, limit } = this.categories[0];
            this.current = id;
            this.title = title;
            this.limit = limit
        },
        mounted () {
            M.updateTextFields();
            this.select = M.FormSelect.init(this.$refs.select);
        },
        methods: {
            async submitHandler () {
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return
                }
                try {
                    const categoryData = {
                        id: this.current,
                        title: this.title,
                        limit: this.limit
                    };
                    await this.$store.dispatch('updateCategory', categoryData);
                    this.$message('Категорія успішно оновлена');
                    this.$emit('update', categoryData)
                } catch (e) {

                }
            }
        },
        destroyed() {
            if (this.select && this.select.destroy) {
                this.select.destroy()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .waves-effect.waves-new-red .waves-ripple {
        /* The alpha value allows the text and background color
				of the button to still show through. */
        background-color: rgba(211, 31, 38, .65);
    }
    .waves-effect.waves-new-red {
        /* The alpha value allows the text and background color
				of the button to still show through. */
        background-color: rgba(211, 31, 38, 1);
    }
</style>
