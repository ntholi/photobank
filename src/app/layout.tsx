import Providers from './providers';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
