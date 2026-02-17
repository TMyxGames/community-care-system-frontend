import MarkdownIt from 'markdown-it';
import mark from 'markdown-it-mark';
import ins from 'markdown-it-ins';
import markdownItTaskLists from 'markdown-it-task-lists';
import container from 'markdown-it-container';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
        try {
            // 使用 highlight.js 染色
            return '<pre class="hljs"><code>' +
                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                '</code></pre>';
        } catch (__) {}
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },

});

md.use(mark);
md.use(ins);
md.use(markdownItTaskLists);
md.use(container, 'dropcap', { 
    marker: '↓' ,
    render: function (tokens, idx) { 
        if (tokens[idx].nesting === 1) { 
            return '<div class="bd-dropcap">';
        } else { 
            return '</div>\n';
        }
    }

});

md.renderer.rules.strong_open = () => '<strong><span>';
md.renderer.rules.strong_close = () => '</span></strong>';

md.renderer.rules.ins_open = () => '<u><span>';
md.renderer.rules.ins_close = () => '</span></u>';

export default md;