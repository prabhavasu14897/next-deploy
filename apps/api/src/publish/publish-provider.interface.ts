export interface PublishInput {
  imageBase64: string;
  caption: string;
  /** The platform's Add Platform credential fields, decrypted, keyed by
   *  slugified field label — resolved server-side by PublishService from
   *  the Platforms database, never sent by the client. */
  credentials: Record<string, string>;
}

export interface PublishResult {
  externalPostId: string;
}

/** One real publish integration. `key` matches a platform's catalog name,
 *  lowercased (e.g. "linkedin") — adding support for another platform is
 *  a new class implementing this interface plus one line registering it
 *  in `publish.module.ts`, not a new endpoint. */
export interface PublishProvider {
  readonly key: string;
  publish(input: PublishInput): Promise<PublishResult>;
}

export const PUBLISH_PROVIDERS = Symbol('PUBLISH_PROVIDERS');
