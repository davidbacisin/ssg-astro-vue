<script lang="ts">
import { Static, defineAsyncComponent, getCurrentInstance, h, ssrUtils } from 'vue';
import { type RouteLocationNormalizedLoaded } from 'vue-router';
import { renderSSRHead } from '@unhead/ssr';
import { useHead } from '@unhead/vue';
import { initHead, initRouter } from '@/router';

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
            headTags: ''
        }
    },
    setup(props) {
        const app = getCurrentInstance()!.appContext.app;
        const head = initHead(app);
        const router = initRouter(app);
        const matchedRoute = router.resolve({
            name: props.route,
            params: props.params,
        }) as RouteLocationNormalizedLoaded;

        const matchedComponent = matchedRoute.matched[0]?.components?.default;

        return () => { 
            let tmp = h(matchedComponent, props.params)
            
            let { createComponentInstance, setupComponent } = ssrUtils;
            let instance = createComponentInstance(tmp, tmp.ctx, null);
            
            let c = defineAsyncComponent(async () => {
                let res = setupComponent(instance, true);
                let prefetches = instance.sp;
                let p = await Promise.all(
                    prefetches.map((prefetch: Function) => prefetch.call(instance.proxy)),
                ).then(() => {
                    useHead(instance.type.head.call(instance.proxy))
                    return renderSSRHead(head)
                });

                return h(Static, p.headTags);
            })

            return h(c)
        }
    },
}
</script>