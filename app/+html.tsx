import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/* PWA */}
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#161718" media="(prefers-color-scheme: dark)" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="CG Cardless" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* Apply dark class before first paint to prevent flash */}
                <script dangerouslySetInnerHTML={{ __html:
                    '(function(){if(window.matchMedia("(prefers-color-scheme:dark)").matches)document.documentElement.classList.add("dark")})()'
                }} />
                <style dangerouslySetInnerHTML={{ __html: [
                    'html{background-color:#fff}',
                    'html.dark{background-color:#161718}',
                    'body{background-color:inherit}',
                    '#__loader{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background-color:inherit;z-index:9999}',
                    '#__loader .s{width:32px;height:32px;border:3px solid #ddd;border-top-color:#2196F3;border-radius:50%;animation:l .8s linear infinite}',
                    'html.dark #__loader .s{border-color:#333;border-top-color:#5BA8E8}',
                    '@keyframes l{to{transform:rotate(360deg)}}',
                ].join('') }} />

                <ScrollViewStyleReset />
            </head>
            <body>
                <div id="__loader"><div className="s" /></div>
                {children}
            </body>
        </html>
    );
}
