import { SpinnerIcon } from "./icons";

/** What a view renders while its store is hydrating (reading localStorage,
 *  then fetching from the API) — a visible spinner rather than a bare empty
 *  div, so a slow/unreachable API doesn't look like the page is broken. */
export function PageLoading() {
  return (
    <div className="flex min-h-full items-center justify-center bg-background">
      {/* SpinnerIcon's own default className is fully overridden (not merged)
          by a passed className, so animate-spin has to be repeated here —
          same convention every other SpinnerIcon call site in the app follows. */}
      <SpinnerIcon className="h-6 w-6 animate-spin text-on-surface-variant" />
    </div>
  );
}
