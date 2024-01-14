import { type App } from 'vue';
import {
    createRouter,
    createMemoryHistory,
    createWebHistory,
    type Router,
} from 'vue-router';
import { VueHeadMixin, createHead, type VueHeadClient, type MergeHead } from '@unhead/vue';
import Page from '@/components/page.vue';

const routes = [
    { name: 'page', path: '/:id', component: Page, props: true },
    { name: 'home', path: '/', component: Page, props: { id: 'intro' } },
];

const initRouter = (app: App<any>): Router => {
    const isBrowser = typeof window !== 'undefined';
    const router = createRouter({
        history: isBrowser ? createWebHistory() : createMemoryHistory(),
        routes,
    });
    app.use(router);
    return router;
}

const initHead = (app: App<any>): VueHeadClient<MergeHead> => {
    const head = createHead();
    app.use(head);
    app.mixin(VueHeadMixin);
    return head;
}

export { routes, initRouter, initHead };