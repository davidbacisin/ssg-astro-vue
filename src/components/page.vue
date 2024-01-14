<template>
    <main v-html="_page?.content"></main>
    <ul>
        <li><RouterLink :to="{name: 'page', params: { id: 'intro' } }">Introduction</RouterLink></li>
        <li><RouterLink :to="{name: 'page', params: { id: 'key-concepts' } }">Key Concepts</RouterLink></li>
    </ul>
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
        if (import.meta.env.SSR) {
            let { readFileSync } = await import('fs');
            let raw = readFileSync(`./public/pages/${this.id}.json`);
            this._page = JSON.parse(raw);
        }
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