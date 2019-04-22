import { RenderArgs } from '../typings/common';
import { html } from '../scripts/html';

import { Header } from './partials/Header';
import { Footer } from './partials/Footer';
import data from './data.json';

export async function render(props: RenderArgs) {
    return (
        <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <title>{data.title}</title>
                <meta name="description" content={data.title} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {props.assets.css.map(asset => (
                    <link rel="stylesheet" href={asset} />
                ))}
            </head>
            <body>
                <Header {...props} />
                {props.content}
                <Footer />
                {props.isProduction
                    ? `
                    <!-- Google Analytics: change UA-XXXXX-X to be your site"s ID. -->
                    <script>
                        (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                        })(window,document,"script","//www.google-analytics.com/analytics.js","ga");

                        ga("create", "${data.ga.token}", "auto");
                        ga("send", "pageview");
                    </script>`
                    : ''}
                {props.isPost && props.attributes!.math
                    ? `
                    <script type="text/x-mathjax-config">
                        MathJax.Hub.Config({
                            tex2jax: {inlineMath: [["$","$"], ["\\(","\\)"]
                        });
                    </script>
                    <script type="text/javascript" async src="${data.scripts.mathjax}"></script>`
                    : ''}
                {props.isPost && props.isProduction && props.attributes
                    ? `
                    <script type="text/javascript">
                        var disqus_shortname = "${data.disqus.shortname}",
                            disqus_identifier = "${props.slug}",
                            disqus_title = "${props.attributes.title}";
                        (function() {
                            var dsq = document.createElement("script"); dsq.type = "text/javascript"; dsq.async = true;
                            dsq.src = "//" + disqus_shortname + ".disqus.com/embed.js";
                            (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);
                        })();
                    </script>
                    <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>`
                    : ''}
            </body>
        </html>
    );
}
