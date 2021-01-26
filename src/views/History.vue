<template>
    <div>
        <div class="page-title">
            <h3>Історія записів</h3>
        </div>

        <div class="history-chart">
            <canvas ref="canvas"></canvas>
        </div>

        <loader v-if="loading"/>

        <p class="center" v-else-if="!records.length">Записів ще немає</p>

        <section v-else>
            <HistoryTable :records="items"/>

            <paginate
                    v-model="page"
                    :page-count="pageCount"
                    :click-handler="pageChangeHandler"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :container-class="'pagination'"
                    :page-class="'waves-effect'">
            </paginate>
        </section>
    </div>
</template>

<script>
    import HistoryTable from '../components/HistoryTable'
    import paginationMixin from '../mixins/pagination.mixin'
    import { Pie } from 'vue-chartjs'

    export default {
        name: 'history',
        metaInfo () {
            return {
                title: this.$title('Menu_History'),
            }
        },
        extends: Pie,
        data: () => ({
            loading: true,
            records: []
        }),
        async mounted () {
            this.records = await this.$store.dispatch('fetchRecords');
            const categories = await this.$store.dispatch('fetchCategories');
            this.setup(categories);

            this.loading = false
        },
        mixins: [
            paginationMixin
        ],
        components: {
            HistoryTable
        },
        methods: {
            setup (categories) {
                this.setupPagination(this.records.map(record => {
                    return {
                        ...record,
                        categoryName: categories.find(cat => cat.id === record.categoryId).title,
                        typeClass: record.type === 'income' ? 'green' : 'red',
                        typeText: record.type === 'income' ? 'Дохід' : 'Витрати',
                    }
                }));

                this.renderChart({
                        labels: categories.map(cat => cat.title),
                        datasets: [{
                            label: 'Витрати по категоріях',
                            data: categories.map(cat => {
                                return this.records.reduce((total, rec ) => {
                                    if (rec.categoryId === cat.id && rec.type === 'outcome') {
                                        total += +rec.amount
                                    }
                                    return total
                                }, 0)
                            }),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    })
            },

        }
    }
</script>
