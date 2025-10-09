import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    html: {
        title: 'Meta for Business - Page Appeal',
        favicon: './src/assets/img/icon-fb.png',
        meta: {
            description:
                'Meta Business Help Center: Help, Support & Troubleshooting'
        },
        tags: [
            // Open Graph Meta Tags
            { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
            {
                tag: 'meta',
                attrs: {
                    property: 'og:title',
                    content:
                        'Meta Business Help Center: Help, Support & Troubleshooting'
                }
            },
            {
                tag: 'meta',
                attrs: {
                    property: 'og:description',
                    content:
                        'Meta Business Help Center: Help, Support & Troubleshooting'
                }
            },
            {
                tag: 'meta',
                attrs: {
                    property: 'og:image',
                    content: './src/assets/img/thumb.jpg'
                }
            },
            {
                tag: 'meta',
                attrs: { name: 'twitter:card', content: 'summary_large_image' }
            },
            {
                tag: 'meta',
                attrs: {
                    name: 'twitter:title',
                    content:
                        'Meta Business Help Center: Help, Support & Troubleshooting'
                }
            },
            {
                tag: 'meta',
                attrs: {
                    name: 'twitter:description',
                    content:
                        'Meta Business Help Center: Help, Support & Troubleshooting'
                }
            },
            {
                tag: 'meta',
                attrs: {
                    name: 'twitter:image',
                    content: '/thumb.jpg'
                }
            }
        ]
    },
    tools: {
        lightningcssLoader: true
    },
    server: {
        host: '0.0.0.0',
        port: 3000
    }
});
