module.exports = function({
    content = "",
    env = "development",
    assets = {}
}) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Vivek Kumar Bansal, frontend developer and designer</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${'.css' in assets ? assets['.css'].map(({asset}) => (
                `<link rel="stylesheet" href="/${asset}" />`
            )).join('/n') : ''}
            ${'.js' in assets ? assets['.js'].map(({asset}) => (
                `<script src="/${asset}" defer ></script>`
            )).join('/n') : ''}
            <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro|Roboto" rel="stylesheet" type="text/css" />
        </head>
        <body>
            <div id='root'>
            ${content}
            </div>
            ${typeof env !== 'undefined' && env === 'production' ? `
            <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
            <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

                ga('create', 'UA-54521168-1', 'auto');
                ga('send', 'pageview');
            </script>` : ''}
        </body>
    </html>
    `;
}
