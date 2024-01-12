<script lang="ts">
import { Static, Suspense, defineAsyncComponent, getCurrentInstance, h } from 'vue';
import { renderSSRHead } from '@unhead/ssr';
import { VueHeadMixin, createHead, createServerHead, useHead } from '@unhead/vue';
import Page from './page.vue';
import { ssrUtils } from 'vue';
import { renderToString } from 'vue/server-renderer';

export default {
    data() {
        return {
            headTags: ''
        }
    },
    async serverPrefetch() {
        //let data = await this.headPromise;
        //this.headTags = data.headTags;
    },
    setup(props, { slots }) {
        const app = getCurrentInstance()!.appContext.app;
        const head = createHead();
        app.use(head);
        app.mixin(VueHeadMixin);

        return () => { 
            let tmp = h(Page, {
                id: 'intro'
            })
            
            let { createComponentInstance, setupComponent } = ssrUtils;
            let instance = createComponentInstance(tmp, tmp.ctx, null)
            
            let c = defineAsyncComponent(async () => {
                let res = setupComponent(instance, true);
                let prefetches = instance.sp
                let p = await Promise.all(
                    prefetches.map(prefetch => prefetch.call(instance.proxy)),
                ).then(() => {
                    useHead(instance.type.head.call(instance.proxy))
                    return renderSSRHead(head)
                })
                
                console.log(p)

                return h(Static, p.headTags)
            })

            return h(c)
        }
    },
}
</script>