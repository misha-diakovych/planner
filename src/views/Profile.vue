<template>
    <div>
        <div class="page-title">
            <h3>{{ 'ProfileTitle' | localize }}</h3>
        </div>

        <form class="form" @submit.prevent="submitHandler">
            <div class="input-field">
                <input
                        id="bill"
                        type="text"
                        v-model="bill"
                        :class="{ invalid: $v.bill.$dirty && !$v.bill.required }"
                >
                <label for="description">{{ 'Menu_Bill' | localize }}</label>
                <small class="helper-text invalid" v-if="$v.bill.$dirty && !$v.bill.numeric">{{ 'Message_EnterBill' | localize}}</small>
            </div>

            <div class="input-field">
                <input
                        id="description"
                        type="text"
                        v-model="name"
                        :class="{ invalid: $v.name.$dirty && !$v.name.required }"
                >
                <label for="description">{{ 'Full name' | localize }}</label>
                <small class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required">{{ 'Message_EnterName' | localize}}</small>
            </div>

            <div class="input-field">
                <input
                        id="email"
                        type="text"
                        v-model.trim="email"
                        :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
                >
                <label for="email">{{ 'Email' | localize }}</label>
                <small class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.required">Field email not be empty</small>
                <small class="helper-text invalid" v-else-if="!$v.email.$dirty && !$v.email.email">Please enter correctly email</small>
            </div>



            <div class="switch">
                <label>
                    English
                    <input type="checkbox" v-model="isUaLocale">
                    <span class="lever"></span>
                    Ukraine
                </label>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                {{ 'Update' | localize}}
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
    import { email, required, numeric } from 'vuelidate/lib/validators'
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'Profile',
        metaInfo () {
            return {
                title: this.$title('Menu_Profile'),
            }
        },
        data: () => ({
            email: '',
            name: '',
            bill: '',
            isUaLocale: true
        }),
        validations: {
            bill: { required, numeric },
            name: { required },
            email: { email, required},
        },
        computed: {
            ...mapGetters(['info'])
        },
        mounted () {
            setTimeout(() =>{
                M.updateTextFields()
            }, 0);
            this.name = this.info.name;
            this.email = this.info.email;
            this.bill = this.info.bill;
            this.isUaLocale = this.info.locale === 'uk-UA'
        },
        methods: {
            ...mapActions(['updateInfo']),
            async submitHandler () {
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return
                }
                try {
                    await this.updateInfo({
                        name: this.name,
                        email: this.email,
                        bill: this.bill,
                        locale: this.isUaLocale ? 'uk-UA' : 'en-Us'
                    })
                } catch (e) {

                }
            }
        }
    }
</script>

<style scoped>
   .switch {
       margin-bottom: 2rem;
   }
</style>

