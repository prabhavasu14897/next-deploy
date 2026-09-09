import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client/runtime/client").DbNullClass;
export declare const JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
export declare const AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
export declare const ModelName: {
    readonly Platform: "Platform";
    readonly CredentialField: "CredentialField";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const PlatformScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly summary: "summary";
    readonly accountNoun: "accountNoun";
    readonly accountNounPlural: "accountNounPlural";
    readonly apiBaseUrl: "apiBaseUrl";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PlatformScalarFieldEnum = (typeof PlatformScalarFieldEnum)[keyof typeof PlatformScalarFieldEnum];
export declare const CredentialFieldScalarFieldEnum: {
    readonly id: "id";
    readonly platformId: "platformId";
    readonly key: "key";
    readonly label: "label";
    readonly secret: "secret";
    readonly value: "value";
    readonly position: "position";
};
export type CredentialFieldScalarFieldEnum = (typeof CredentialFieldScalarFieldEnum)[keyof typeof CredentialFieldScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
