### You might have to kill the server

It seems there's a bug where playwright won't kill the processes it starts after finishing running the tests (could be pnpm related?).
See https://github.com/microsoft/playwright/issues/18865

```sh
kill -9 $(lsof -ti:3010) && pnpm --filter web-e2e-tests test:e2e
```
