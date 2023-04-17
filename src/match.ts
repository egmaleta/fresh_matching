import { Handler, Handlers } from "./deps.ts";
import { StringMatcher } from "./types.ts";
import { mapObjectValues } from "./utils.ts";

// deno-lint-ignore no-explicit-any
export const matchRouteParams = <T = any, State = Record<string, unknown>>(
  handlers: Handler<T, State> | Handlers<T, State>,
  paramMatchers: Record<string, StringMatcher>
): typeof handlers => {
  // turn `RegExp` matchers into `string` => `boolean` function matchers
  const matchers = mapObjectValues(paramMatchers, (pm) => {
    return pm instanceof RegExp
      ? (paramValue: string) => pm.test(paramValue)
      : pm;
  });

  // function to wrap any `Handler` function
  const wrap = (handler: Handler<T, State>): typeof handler => {
    return async (req, ctx) => {
      // search for the first param that doesn't match and stop
      const matches = Object.entries(ctx.params).find((entry) => {
        const [paramName, param] = entry;
        const matcher = matchers[paramName];

        // if `param` doesn't match, return `true`, `false` otherwise
        return matcher !== undefined ? !matcher(param) : false;
      });

      if (matches === undefined) {
        // all params matched, handle request as normal
        return handler(req, ctx);
      }
      // some not, therefore 404

      let response: Response;
      // render 404 page if it exists
      try {
        response = await ctx.renderNotFound();
      } catch (_) {
        response = new Response(null, { status: 404 });
      }

      return response;
    };
  };

  if (typeof handlers === "function") {
    return wrap(handlers);
  }

  // `handlers` is a `Record<http methods, Handler>`
  return mapObjectValues(handlers, (h) => wrap(h!));
};
