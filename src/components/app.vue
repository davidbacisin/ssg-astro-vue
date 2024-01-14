<template>
    <RouterView :route="ssrRoute" v-bind="ssrParams" />
</template>

<script lang="ts">
import { type RouteLocationNormalizedLoaded } from 'vue-router';
import { getCurrentInstance } from 'vue';
import { initRouter, initHead } from '@/router';

export default {
    props: {
        route: {
            type: String,
            required: true,
        },
        params: Object,
    },
    data() {
        return {
            _isMounted: false,
        }
    },
    mounted() {
        this._isMounted = true;
    },
    computed: {
        ssrRoute(): RouteLocationNormalizedLoaded {
            /* If we've rehydrated in the browser, then use $route so that 
            router links can actually change the router view component.
            If we're rendering on the server, then we should stick to the initial,
            server-provided route. */
            return this._isMounted ? this.$route : this.initialRoute;
        },
        ssrParams(): any {
            /* Prevent a re-render flash by only returning the current route 
            params if they are different from the SSR'd params */
            if (this._isMounted && this.$route.params != this.params) {
                return this.$route.params;
            }
            return this.params;
        }
    },
    setup(props) {
        const app = getCurrentInstance()!.appContext.app;
        initHead(app);
        const router = initRouter(app);
        let initialRoute = router.resolve({
            name: props.route,
            params: props.params!,
        }) as RouteLocationNormalizedLoaded;

        return {
            initialRoute,
        }
    }
}
</script>