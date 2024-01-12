<template>
    <main v-html="_page?.content"></main>
</template>

<script lang="ts">
interface Page {
    id: string;
    title: string;
    content: string;
}

export default {
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            _page: undefined as Page | undefined,
        };
    },
    head() {
        const title = this._page?.title || 'Loading…'
        return {
            title, 
            meta: [
                {
                    property: 'og:title',
                    content: title,
                },
            ],
        };
    },
    mounted() {
        this.$watch(
            () => this.id,
            () => this.fetchContent(),
            {
                immediate: true,
            }
        );
    },
    async serverPrefetch() {
        let raw = await import(/* @vite-ignore */`../../public/pages/${this.id}`, {
            assert: { type: 'json' }
        })
        this._page = raw.default;
    },
    methods: {
        fetchContent() {
            fetch(`/pages/${this.id}.json`)
                .then(raw => raw.json())
                .then(p => {
                    this._page = p
                })
                .catch(reason => {
                    console.error(reason)
                });
        }
    }
}
</script>