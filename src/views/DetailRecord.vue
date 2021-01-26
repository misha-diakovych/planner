<template>
    <div>
        <loader v-if="loading"/>

        <div v-else-if="record">
            <div class="breadcrumb-wrap">
                <router-link to="/history" class="breadcrumb">Історія</router-link>
                <a @click.prevent class="breadcrumb" >
                    {{ record.type === 'income' ? 'Дохід' : 'Витрати' }}
                </a>
            </div>
            <div class="row">
                <div class="col s12 m6">
                    <div class="card" :class="{
                    'red': record.type === 'outcome',
                    'green': record.type === 'income'
                    }">
                        <div class="card-content white-text">
                            <p>Опис: {{ record.description }}</p>
                            <p>Сума: {{  record.amount |currency }}</p>
                            <p>Категорія: {{ record.categoryName }}</p>

                            <small>{{ record.data | date('datetime') }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="center" v-else >Запис з id={{ $route.params.id }} не знайдена</p>
    </div>
</template>

<script>
    export default {
        name: 'detailRecord',
        data: () => ({
            record: null,
            loading: true
        }),
        async mounted () {
            const id = this.$route.params.id;
            const record = await this.$store.dispatch('fetchRecordById', id);
            const category = await this.$store.dispatch('fetchCategoryById', record.categoryId);
            this.loading = false;

            this.record = {
                ...record,
                categoryName: category.title
            }
        }
    }
</script>
