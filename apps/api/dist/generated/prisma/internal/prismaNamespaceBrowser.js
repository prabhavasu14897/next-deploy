import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    Platform: 'Platform',
    CredentialField: 'CredentialField'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    Serializable: 'Serializable'
});
export const PlatformScalarFieldEnum = {
    id: 'id',
    name: 'name',
    summary: 'summary',
    accountNoun: 'accountNoun',
    accountNounPlural: 'accountNounPlural',
    apiBaseUrl: 'apiBaseUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CredentialFieldScalarFieldEnum = {
    id: 'id',
    platformId: 'platformId',
    key: 'key',
    label: 'label',
    secret: 'secret',
    value: 'value',
    position: 'position'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map