<template>
    <div>
        <div class="page-title">
            <h3>Новий запис</h3>
        </div>

        <Loader v-if="loading"/>
        <p class="center" v-else-if="!categories.length">Категорій ще немає <router-link to="/categories">Створити нову категорію</router-link></p>

        <form class="form" v-else @submit.prevent="handleSubmit">
            <div class="input-field" >
                <select ref="select" v-model="category">
                    <option v-for="cat of categories" :key="cat.id" :value="cat.id" >{{cat.title}}</option>
                </select>
                <label>Виберіть категорію</label>
            </div>
            <p>
                <label class="red-button">
                    <input class="with-gap" name="type" type="radio" value="income" v-model="type"/>
                    <span>Дохід</span>
                </label>
            </p>

            <p>
                <label>
                    <input class="with-gap" name="type" type="radio" value="outcome" v-model="type"/>
                    <span>Витрати</span>
                </label>
            </p>

            <div class="input-field">
                <input
                        id="amount"
                        type="number"
                        v-model.number="amount"
                        :class="{ invalid: ($v.amount.$dirty && !$v.amount.minValue)}"
                >
                <label for="amount">Сума</label>
                <span class="helper-text invalid" v-if="$v.amount.$dirty && !$v.amount.minValue">Мінімальна величина {{ $v.amount.$params.minValue.min }} </span>
            </div>

            <div class="input-field">
                <input
                        id="description"
                        type="text"
                        v-model="description"
                        :class="{ invalid: ($v.description.$dirty && !$v.description.required)}"
                >
                <label for="description">Короткий опис</label>
                <span class="helper-text invalid" v-if="$v.description.$dirty && !$v.description.required">Введіть опис</span>
            </div>

            <button class="btn waves-effect waves-new-red" type="submit">
                Створити
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
    import { required, minValue } from 'vuelidate/lib/validators'
    import { mapGetters } from 'vuex'

    export default {
        name: 'record',
        metaInfo () {
            return {
                title: this.$title('Menu_NewRecord'),
            }
        },
        data: () => ({
            loading: true,
            categories: [],
            select: null,
            category: null,
            type: 'outcome',
            amount: 1,
            description: ''
        }),
        validations: {
            amount: { minValue: minValue(1) },
            description: { required }
        },
        computed: {
            ...mapGetters(['info']),
            canCreateRecord () {
                if (this.type === 'income') {
                    return true;
                }

                return this.info.bill >= this.amount
            }
        },
        async mounted () {
           this.categories = await this.$store.dispatch('fetchCategories');
           this.loading = false;

           if(this.categories.length) {
               this.category = this.categories[0].id
           }
           setTimeout(() => {
               M.updateTextFields();
               this.select = M.FormSelect.init(this.$refs.select);
           }, 0)

        },
        methods: {
            async handleSubmit() {
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return
                }

                if (this.canCreateRecord) {
                    try {
                        await this.$store.dispatch('createRecord', {
                            categoryId: this.category,
                            amount: this.amount,
                            description: this.description,
                            type: this.type,
                            data: new Date().toJSON()
                        });

                        const bill = this.type === 'income' ? this.info.bill + this.amount : this.info.bill - this.amount;

                        await this.$store.dispatch('updateInfo', {bill});

                        this.$message('Запис успішно створено');
                        this.$v.$reset();
                        this.amount = 1;
                        this.description = ''
                    } catch (e) {

                    }

                } else {
                    this.$message(`Недостатньо грошей на рахунку (${this.amount - this.info.bill})`)

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

<style scoped>
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
    .with-gap:checked+span:before {
        border: 2px solid rgba(211, 31, 38, 1) !important;
    }

    [type="radio"]:checked+span:after, [type="radio"].with-gap:checked+span:after {
        background-color: rgba(211, 31, 38, 1) !important;
        border: 2px solid rgba(211, 31, 38, 1) !important;
    }
</style>
