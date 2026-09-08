import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PlatformModel = runtime.Types.Result.DefaultSelection<Prisma.$PlatformPayload>;
export type AggregatePlatform = {
    _count: PlatformCountAggregateOutputType | null;
    _min: PlatformMinAggregateOutputType | null;
    _max: PlatformMaxAggregateOutputType | null;
};
export type PlatformMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    summary: string | null;
    accountNoun: string | null;
    accountNounPlural: string | null;
    apiBaseUrl: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlatformMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    summary: string | null;
    accountNoun: string | null;
    accountNounPlural: string | null;
    apiBaseUrl: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlatformCountAggregateOutputType = {
    id: number;
    name: number;
    summary: number;
    accountNoun: number;
    accountNounPlural: number;
    apiBaseUrl: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PlatformMinAggregateInputType = {
    id?: true;
    name?: true;
    summary?: true;
    accountNoun?: true;
    accountNounPlural?: true;
    apiBaseUrl?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlatformMaxAggregateInputType = {
    id?: true;
    name?: true;
    summary?: true;
    accountNoun?: true;
    accountNounPlural?: true;
    apiBaseUrl?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlatformCountAggregateInputType = {
    id?: true;
    name?: true;
    summary?: true;
    accountNoun?: true;
    accountNounPlural?: true;
    apiBaseUrl?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PlatformAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlatformWhereInput;
    orderBy?: Prisma.PlatformOrderByWithRelationInput | Prisma.PlatformOrderByWithRelationInput[];
    cursor?: Prisma.PlatformWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlatformCountAggregateInputType;
    _min?: PlatformMinAggregateInputType;
    _max?: PlatformMaxAggregateInputType;
};
export type GetPlatformAggregateType<T extends PlatformAggregateArgs> = {
    [P in keyof T & keyof AggregatePlatform]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlatform[P]> : Prisma.GetScalarType<T[P], AggregatePlatform[P]>;
};
export type PlatformGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlatformWhereInput;
    orderBy?: Prisma.PlatformOrderByWithAggregationInput | Prisma.PlatformOrderByWithAggregationInput[];
    by: Prisma.PlatformScalarFieldEnum[] | Prisma.PlatformScalarFieldEnum;
    having?: Prisma.PlatformScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlatformCountAggregateInputType | true;
    _min?: PlatformMinAggregateInputType;
    _max?: PlatformMaxAggregateInputType;
};
export type PlatformGroupByOutputType = {
    id: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    createdAt: Date;
    updatedAt: Date;
    _count: PlatformCountAggregateOutputType | null;
    _min: PlatformMinAggregateOutputType | null;
    _max: PlatformMaxAggregateOutputType | null;
};
export type GetPlatformGroupByPayload<T extends PlatformGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlatformGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlatformGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlatformGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlatformGroupByOutputType[P]>;
}>>;
export type PlatformWhereInput = {
    AND?: Prisma.PlatformWhereInput | Prisma.PlatformWhereInput[];
    OR?: Prisma.PlatformWhereInput[];
    NOT?: Prisma.PlatformWhereInput | Prisma.PlatformWhereInput[];
    id?: Prisma.StringFilter<"Platform"> | string;
    name?: Prisma.StringFilter<"Platform"> | string;
    summary?: Prisma.StringFilter<"Platform"> | string;
    accountNoun?: Prisma.StringFilter<"Platform"> | string;
    accountNounPlural?: Prisma.StringFilter<"Platform"> | string;
    apiBaseUrl?: Prisma.StringFilter<"Platform"> | string;
    createdAt?: Prisma.DateTimeFilter<"Platform"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Platform"> | Date | string;
    credentialFields?: Prisma.CredentialFieldListRelationFilter;
};
export type PlatformOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    accountNoun?: Prisma.SortOrder;
    accountNounPlural?: Prisma.SortOrder;
    apiBaseUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    credentialFields?: Prisma.CredentialFieldOrderByRelationAggregateInput;
};
export type PlatformWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PlatformWhereInput | Prisma.PlatformWhereInput[];
    OR?: Prisma.PlatformWhereInput[];
    NOT?: Prisma.PlatformWhereInput | Prisma.PlatformWhereInput[];
    name?: Prisma.StringFilter<"Platform"> | string;
    summary?: Prisma.StringFilter<"Platform"> | string;
    accountNoun?: Prisma.StringFilter<"Platform"> | string;
    accountNounPlural?: Prisma.StringFilter<"Platform"> | string;
    apiBaseUrl?: Prisma.StringFilter<"Platform"> | string;
    createdAt?: Prisma.DateTimeFilter<"Platform"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Platform"> | Date | string;
    credentialFields?: Prisma.CredentialFieldListRelationFilter;
}, "id">;
export type PlatformOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    accountNoun?: Prisma.SortOrder;
    accountNounPlural?: Prisma.SortOrder;
    apiBaseUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PlatformCountOrderByAggregateInput;
    _max?: Prisma.PlatformMaxOrderByAggregateInput;
    _min?: Prisma.PlatformMinOrderByAggregateInput;
};
export type PlatformScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlatformScalarWhereWithAggregatesInput | Prisma.PlatformScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlatformScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlatformScalarWhereWithAggregatesInput | Prisma.PlatformScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Platform"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Platform"> | string;
    summary?: Prisma.StringWithAggregatesFilter<"Platform"> | string;
    accountNoun?: Prisma.StringWithAggregatesFilter<"Platform"> | string;
    accountNounPlural?: Prisma.StringWithAggregatesFilter<"Platform"> | string;
    apiBaseUrl?: Prisma.StringWithAggregatesFilter<"Platform"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Platform"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Platform"> | Date | string;
};
export type PlatformCreateInput = {
    id?: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    credentialFields?: Prisma.CredentialFieldCreateNestedManyWithoutPlatformInput;
};
export type PlatformUncheckedCreateInput = {
    id?: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    credentialFields?: Prisma.CredentialFieldUncheckedCreateNestedManyWithoutPlatformInput;
};
export type PlatformUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNoun?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNounPlural?: Prisma.StringFieldUpdateOperationsInput | string;
    apiBaseUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    credentialFields?: Prisma.CredentialFieldUpdateManyWithoutPlatformNestedInput;
};
export type PlatformUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNoun?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNounPlural?: Prisma.StringFieldUpdateOperationsInput | string;
    apiBaseUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    credentialFields?: Prisma.CredentialFieldUncheckedUpdateManyWithoutPlatformNestedInput;
};
export type PlatformCreateManyInput = {
    id?: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlatformUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNoun?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNounPlural?: Prisma.StringFieldUpdateOperationsInput | string;
    apiBaseUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNoun?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNounPlural?: Prisma.StringFieldUpdateOperationsInput | string;
    apiBaseUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    accountNoun?: Prisma.SortOrder;
    accountNounPlural?: Prisma.SortOrder;
    apiBaseUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlatformMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    accountNoun?: Prisma.SortOrder;
    accountNounPlural?: Prisma.SortOrder;
    apiBaseUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlatformMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    accountNoun?: Prisma.SortOrder;
    accountNounPlural?: Prisma.SortOrder;
    apiBaseUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlatformScalarRelationFilter = {
    is?: Prisma.PlatformWhereInput;
    isNot?: Prisma.PlatformWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type PlatformCreateNestedOneWithoutCredentialFieldsInput = {
    create?: Prisma.XOR<Prisma.PlatformCreateWithoutCredentialFieldsInput, Prisma.PlatformUncheckedCreateWithoutCredentialFieldsInput>;
    connectOrCreate?: Prisma.PlatformCreateOrConnectWithoutCredentialFieldsInput;
    connect?: Prisma.PlatformWhereUniqueInput;
};
export type PlatformUpdateOneRequiredWithoutCredentialFieldsNestedInput = {
    create?: Prisma.XOR<Prisma.PlatformCreateWithoutCredentialFieldsInput, Prisma.PlatformUncheckedCreateWithoutCredentialFieldsInput>;
    connectOrCreate?: Prisma.PlatformCreateOrConnectWithoutCredentialFieldsInput;
    upsert?: Prisma.PlatformUpsertWithoutCredentialFieldsInput;
    connect?: Prisma.PlatformWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlatformUpdateToOneWithWhereWithoutCredentialFieldsInput, Prisma.PlatformUpdateWithoutCredentialFieldsInput>, Prisma.PlatformUncheckedUpdateWithoutCredentialFieldsInput>;
};
export type PlatformCreateWithoutCredentialFieldsInput = {
    id?: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlatformUncheckedCreateWithoutCredentialFieldsInput = {
    id?: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlatformCreateOrConnectWithoutCredentialFieldsInput = {
    where: Prisma.PlatformWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlatformCreateWithoutCredentialFieldsInput, Prisma.PlatformUncheckedCreateWithoutCredentialFieldsInput>;
};
export type PlatformUpsertWithoutCredentialFieldsInput = {
    update: Prisma.XOR<Prisma.PlatformUpdateWithoutCredentialFieldsInput, Prisma.PlatformUncheckedUpdateWithoutCredentialFieldsInput>;
    create: Prisma.XOR<Prisma.PlatformCreateWithoutCredentialFieldsInput, Prisma.PlatformUncheckedCreateWithoutCredentialFieldsInput>;
    where?: Prisma.PlatformWhereInput;
};
export type PlatformUpdateToOneWithWhereWithoutCredentialFieldsInput = {
    where?: Prisma.PlatformWhereInput;
    data: Prisma.XOR<Prisma.PlatformUpdateWithoutCredentialFieldsInput, Prisma.PlatformUncheckedUpdateWithoutCredentialFieldsInput>;
};
export type PlatformUpdateWithoutCredentialFieldsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNoun?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNounPlural?: Prisma.StringFieldUpdateOperationsInput | string;
    apiBaseUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformUncheckedUpdateWithoutCredentialFieldsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNoun?: Prisma.StringFieldUpdateOperationsInput | string;
    accountNounPlural?: Prisma.StringFieldUpdateOperationsInput | string;
    apiBaseUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlatformCountOutputType = {
    credentialFields: number;
};
export type PlatformCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialFields?: boolean | PlatformCountOutputTypeCountCredentialFieldsArgs;
};
export type PlatformCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformCountOutputTypeSelect<ExtArgs> | null;
};
export type PlatformCountOutputTypeCountCredentialFieldsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialFieldWhereInput;
};
export type PlatformSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    summary?: boolean;
    accountNoun?: boolean;
    accountNounPlural?: boolean;
    apiBaseUrl?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    credentialFields?: boolean | Prisma.Platform$credentialFieldsArgs<ExtArgs>;
    _count?: boolean | Prisma.PlatformCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["platform"]>;
export type PlatformSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    summary?: boolean;
    accountNoun?: boolean;
    accountNounPlural?: boolean;
    apiBaseUrl?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["platform"]>;
export type PlatformSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    summary?: boolean;
    accountNoun?: boolean;
    accountNounPlural?: boolean;
    apiBaseUrl?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["platform"]>;
export type PlatformSelectScalar = {
    id?: boolean;
    name?: boolean;
    summary?: boolean;
    accountNoun?: boolean;
    accountNounPlural?: boolean;
    apiBaseUrl?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PlatformOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "summary" | "accountNoun" | "accountNounPlural" | "apiBaseUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["platform"]>;
export type PlatformInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialFields?: boolean | Prisma.Platform$credentialFieldsArgs<ExtArgs>;
    _count?: boolean | Prisma.PlatformCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PlatformIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PlatformIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PlatformPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Platform";
    objects: {
        credentialFields: Prisma.$CredentialFieldPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        summary: string;
        accountNoun: string;
        accountNounPlural: string;
        apiBaseUrl: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["platform"]>;
    composites: {};
};
export type PlatformGetPayload<S extends boolean | null | undefined | PlatformDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlatformPayload, S>;
export type PlatformCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlatformFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlatformCountAggregateInputType | true;
};
export interface PlatformDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Platform'];
        meta: {
            name: 'Platform';
        };
    };
    findUnique<T extends PlatformFindUniqueArgs>(args: Prisma.SelectSubset<T, PlatformFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlatformFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlatformFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlatformFindFirstArgs>(args?: Prisma.SelectSubset<T, PlatformFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlatformFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlatformFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlatformFindManyArgs>(args?: Prisma.SelectSubset<T, PlatformFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlatformCreateArgs>(args: Prisma.SelectSubset<T, PlatformCreateArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlatformCreateManyArgs>(args?: Prisma.SelectSubset<T, PlatformCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlatformCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlatformCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlatformDeleteArgs>(args: Prisma.SelectSubset<T, PlatformDeleteArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlatformUpdateArgs>(args: Prisma.SelectSubset<T, PlatformUpdateArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlatformDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlatformDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlatformUpdateManyArgs>(args: Prisma.SelectSubset<T, PlatformUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlatformUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlatformUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlatformUpsertArgs>(args: Prisma.SelectSubset<T, PlatformUpsertArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlatformCountArgs>(args?: Prisma.Subset<T, PlatformCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlatformCountAggregateOutputType> : number>;
    aggregate<T extends PlatformAggregateArgs>(args: Prisma.Subset<T, PlatformAggregateArgs>): Prisma.PrismaPromise<GetPlatformAggregateType<T>>;
    groupBy<T extends PlatformGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlatformGroupByArgs['orderBy'];
    } : {
        orderBy?: PlatformGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlatformGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlatformGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlatformFieldRefs;
}
export interface Prisma__PlatformClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    credentialFields<T extends Prisma.Platform$credentialFieldsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Platform$credentialFieldsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlatformFieldRefs {
    readonly id: Prisma.FieldRef<"Platform", 'String'>;
    readonly name: Prisma.FieldRef<"Platform", 'String'>;
    readonly summary: Prisma.FieldRef<"Platform", 'String'>;
    readonly accountNoun: Prisma.FieldRef<"Platform", 'String'>;
    readonly accountNounPlural: Prisma.FieldRef<"Platform", 'String'>;
    readonly apiBaseUrl: Prisma.FieldRef<"Platform", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Platform", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Platform", 'DateTime'>;
}
export type PlatformFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    where: Prisma.PlatformWhereUniqueInput;
};
export type PlatformFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    where: Prisma.PlatformWhereUniqueInput;
};
export type PlatformFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    where?: Prisma.PlatformWhereInput;
    orderBy?: Prisma.PlatformOrderByWithRelationInput | Prisma.PlatformOrderByWithRelationInput[];
    cursor?: Prisma.PlatformWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlatformScalarFieldEnum | Prisma.PlatformScalarFieldEnum[];
};
export type PlatformFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    where?: Prisma.PlatformWhereInput;
    orderBy?: Prisma.PlatformOrderByWithRelationInput | Prisma.PlatformOrderByWithRelationInput[];
    cursor?: Prisma.PlatformWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlatformScalarFieldEnum | Prisma.PlatformScalarFieldEnum[];
};
export type PlatformFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    where?: Prisma.PlatformWhereInput;
    orderBy?: Prisma.PlatformOrderByWithRelationInput | Prisma.PlatformOrderByWithRelationInput[];
    cursor?: Prisma.PlatformWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlatformScalarFieldEnum | Prisma.PlatformScalarFieldEnum[];
};
export type PlatformCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlatformCreateInput, Prisma.PlatformUncheckedCreateInput>;
};
export type PlatformCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlatformCreateManyInput | Prisma.PlatformCreateManyInput[];
};
export type PlatformCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    data: Prisma.PlatformCreateManyInput | Prisma.PlatformCreateManyInput[];
};
export type PlatformUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlatformUpdateInput, Prisma.PlatformUncheckedUpdateInput>;
    where: Prisma.PlatformWhereUniqueInput;
};
export type PlatformUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlatformUpdateManyMutationInput, Prisma.PlatformUncheckedUpdateManyInput>;
    where?: Prisma.PlatformWhereInput;
    limit?: number;
};
export type PlatformUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlatformUpdateManyMutationInput, Prisma.PlatformUncheckedUpdateManyInput>;
    where?: Prisma.PlatformWhereInput;
    limit?: number;
};
export type PlatformUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    where: Prisma.PlatformWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlatformCreateInput, Prisma.PlatformUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlatformUpdateInput, Prisma.PlatformUncheckedUpdateInput>;
};
export type PlatformDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
    where: Prisma.PlatformWhereUniqueInput;
};
export type PlatformDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlatformWhereInput;
    limit?: number;
};
export type Platform$credentialFieldsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
    where?: Prisma.CredentialFieldWhereInput;
    orderBy?: Prisma.CredentialFieldOrderByWithRelationInput | Prisma.CredentialFieldOrderByWithRelationInput[];
    cursor?: Prisma.CredentialFieldWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialFieldScalarFieldEnum | Prisma.CredentialFieldScalarFieldEnum[];
};
export type PlatformDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlatformSelect<ExtArgs> | null;
    omit?: Prisma.PlatformOmit<ExtArgs> | null;
    include?: Prisma.PlatformInclude<ExtArgs> | null;
};
