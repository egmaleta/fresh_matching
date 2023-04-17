# fresh_matching

Utilities to match/validate route params for Deno Fresh.

## Usage

Wrap your `handler` function with `matchRouteParams` to validate the current route's params.

```tsx
// route: /:groupId/:username/
// at routes/[groupId]/[username].tsx

import { HandlerContext } from "https://deno.land/x/fresh@1.1.5/server.ts";
import { matchRouteParams } from "https://deno.land/x/fresh_matching@0.0.3/mod.ts";

export const handler = matchRouteParams(
  (req: Request, ctx: HandlerContext): Response => {
    // handle request...
  },
  {
    groupId: /^([0-9a-zA-Z]{8})$/,
    username: (param) => {
      return ["shaquille.oatmeal", "averagestudent" /*...*/].includes(param);
    },
  }
);

// ...
```

`matchRouteParams` can wrap `Handlers` object as well, no need to wrap every single of its `Handler` functions.

## Contributing

You can open an issue or make a PR, I'll try to check and merge (if possible) quickly.

## License

Under [MIT](https://github.com/egmaleta/fresh_matching/blob/main/LICENSE) license.
