<template>
    <ul class="sidenav app-sidenav" :class="{open: value}">
        <router-link
                tag="li"
                active-class="active"
                :to="link.url"
                v-for="link in links"
                :key="link.url"
                :exact="link.exact"
        >
            <div class="waves-effect waves-new-red sidenav-menu">
                <span class="material-icons red-text">{{link.icon}}</span>
                <a class="pointer black-text" style="margin-left: 12px; white-space: nowrap">{{ link.title }}</a>
            </div>

        </router-link>
    </ul>
</template>

<script>
    import localizeFilter from '@/filters/localize.filter'
    export default {
        name: "Sidebar",
        props: ['value'],
        data: () => ({
            links: [
                {
                    title: localizeFilter('Menu_Bill'),
                    icon: 'account_balance_wallet',
                    url: '/',
                    exact: true},
                {
                    title: localizeFilter('Menu_History'),
                    icon: 'history',
                    url: '/history'},
                {
                    title: localizeFilter('Menu_Planning'),
                    icon: 'book_online',
                    url: '/planning'},
                {
                    title: localizeFilter('Menu_NewRecord'),
                    icon: 'add_circle_outline',
                    url: '/record'},
                {
                    title: localizeFilter('Menu_Categories'),
                    icon: 'category',
                    url: '/categories'},
            ]
        }),

    }
</script>

<style lang="scss">
    /*
  When creating your CSS selector,
  change "brown" to something of your choosing
  */
    .waves-effect.waves-new-red .waves-ripple {
        /* The alpha value allows the text and background color
				of the button to still show through. */
        background-color: rgba(211, 31, 38, .65);
    }

    .material-icons.red-text {
        color: #D31F26 !important;
    }

    .sidenav-menu {
        display: flex !important;
        align-items: center !important;
        width: 100%;
        padding: 0 2rem;
    }
    .sidenav.app-sidenav.open {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
    }
</style>
