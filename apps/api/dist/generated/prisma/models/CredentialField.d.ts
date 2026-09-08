import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CredentialFieldModel = runtime.Types.Result.DefaultSelection<Prisma.$CredentialFieldPayload>;
export type AggregateCredentialField = {
    _count: CredentialFieldCountAggregateOutputType | null;
    _avg: CredentialFieldAvgAggregateOutputType | null;
    _sum: CredentialFieldSumAggregateOutputType | null;
    _min: CredentialFieldMinAggregateOutputType | null;
    _max: CredentialFieldMaxAggregateOutputType | null;
};
export type CredentialFieldAvgAggregateOutputType = {
    position: number | null;
};
export type CredentialFieldSumAggregateOutputType = {
    position: number | null;
};
export type CredentialFieldMinAggregateOutputType = {
    id: string | null;
    platformId: string | null;
    key: string | null;
    label: string | null;
    secret: boolean | null;
    value: string | null;
    position: number | null;
};
export type CredentialFieldMaxAggregateOutputType = {
    id: string | null;
    platformId: string | null;
    key: string | null;
    label: string | null;
    secret: boolean | null;
    value: string | null;
    position: number | null;
};
export type CredentialFieldCountAggregateOutputType = {
    id: number;
    platformId: number;
    key: number;
    label: number;
    secret: number;
    value: number;
    position: number;
    _all: number;
};
export type CredentialFieldAvgAggregateInputType = {
    position?: true;
};
export type CredentialFieldSumAggregateInputType = {
    position?: true;
};
export type CredentialFieldMinAggregateInputType = {
    id?: true;
    platformId?: true;
    key?: true;
    label?: true;
    secret?: true;
    value?: true;
    position?: true;
};
export type CredentialFieldMaxAggregateInputType = {
    id?: true;
    platformId?: true;
    key?: true;
    label?: true;
    secret?: true;
    value?: true;
    position?: true;
};
export type CredentialFieldCountAggregateInputType = {
    id?: true;
    platformId?: true;
    key?: true;
    label?: true;
    secret?: true;
    value?: true;
    position?: true;
    _all?: true;
};
export type CredentialFieldAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialFieldWhereInput;
    orderBy?: Prisma.CredentialFieldOrderByWithRelationInput | Prisma.CredentialFieldOrderByWithRelationInput[];
    cursor?: Prisma.CredentialFieldWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CredentialFieldCountAggregateInputType;
    _avg?: CredentialFieldAvgAggregateInputType;
    _sum?: CredentialFieldSumAggregateInputType;
    _min?: CredentialFieldMinAggregateInputType;
    _max?: CredentialFieldMaxAggregateInputType;
};
export type GetCredentialFieldAggregateType<T extends CredentialFieldAggregateArgs> = {
    [P in keyof T & keyof AggregateCredentialField]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCredentialField[P]> : Prisma.GetScalarType<T[P], AggregateCredentialField[P]>;
};
export type CredentialFieldGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialFieldWhereInput;
    orderBy?: Prisma.CredentialFieldOrderByWithAggregationInput | Prisma.CredentialFieldOrderByWithAggregationInput[];
    by: Prisma.CredentialFieldScalarFieldEnum[] | Prisma.CredentialFieldScalarFieldEnum;
    having?: Prisma.CredentialFieldScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CredentialFieldCountAggregateInputType | true;
    _avg?: CredentialFieldAvgAggregateInputType;
    _sum?: CredentialFieldSumAggregateInputType;
    _min?: CredentialFieldMinAggregateInputType;
    _max?: CredentialFieldMaxAggregateInputType;
};
export type CredentialFieldGroupByOutputType = {
    id: string;
    platformId: string;
    key: string;
    label: string;
    secret: boolean;
    value: string;
    position: number;
    _count: CredentialFieldCountAggregateOutputType | null;
    _avg: CredentialFieldAvgAggregateOutputType | null;
    _sum: CredentialFieldSumAggregateOutputType | null;
    _min: CredentialFieldMinAggregateOutputType | null;
    _max: CredentialFieldMaxAggregateOutputType | null;
};
export type GetCredentialFieldGroupByPayload<T extends CredentialFieldGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CredentialFieldGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CredentialFieldGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CredentialFieldGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CredentialFieldGroupByOutputType[P]>;
}>>;
export type CredentialFieldWhereInput = {
    AND?: Prisma.CredentialFieldWhereInput | Prisma.CredentialFieldWhereInput[];
    OR?: Prisma.CredentialFieldWhereInput[];
    NOT?: Prisma.CredentialFieldWhereInput | Prisma.CredentialFieldWhereInput[];
    id?: Prisma.StringFilter<"CredentialField"> | string;
    platformId?: Prisma.StringFilter<"CredentialField"> | string;
    key?: Prisma.StringFilter<"CredentialField"> | string;
    label?: Prisma.StringFilter<"CredentialField"> | string;
    secret?: Prisma.BoolFilter<"CredentialField"> | boolean;
    value?: Prisma.StringFilter<"CredentialField"> | string;
    position?: Prisma.IntFilter<"CredentialField"> | number;
    platform?: Prisma.XOR<Prisma.PlatformScalarRelationFilter, Prisma.PlatformWhereInput>;
};
export type CredentialFieldOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    platformId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    secret?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    platform?: Prisma.PlatformOrderByWithRelationInput;
};
export type CredentialFieldWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    platformId_key?: Prisma.CredentialFieldPlatformIdKeyCompoundUniqueInput;
    AND?: Prisma.CredentialFieldWhereInput | Prisma.CredentialFieldWhereInput[];
    OR?: Prisma.CredentialFieldWhereInput[];
    NOT?: Prisma.CredentialFieldWhereInput | Prisma.CredentialFieldWhereInput[];
    platformId?: Prisma.StringFilter<"CredentialField"> | string;
    key?: Prisma.StringFilter<"CredentialField"> | string;
    label?: Prisma.StringFilter<"CredentialField"> | string;
    secret?: Prisma.BoolFilter<"CredentialField"> | boolean;
    value?: Prisma.StringFilter<"CredentialField"> | string;
    position?: Prisma.IntFilter<"CredentialField"> | number;
    platform?: Prisma.XOR<Prisma.PlatformScalarRelationFilter, Prisma.PlatformWhereInput>;
}, "id" | "platformId_key">;
export type CredentialFieldOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    platformId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    secret?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    _count?: Prisma.CredentialFieldCountOrderByAggregateInput;
    _avg?: Prisma.CredentialFieldAvgOrderByAggregateInput;
    _max?: Prisma.CredentialFieldMaxOrderByAggregateInput;
    _min?: Prisma.CredentialFieldMinOrderByAggregateInput;
    _sum?: Prisma.CredentialFieldSumOrderByAggregateInput;
};
export type CredentialFieldScalarWhereWithAggregatesInput = {
    AND?: Prisma.CredentialFieldScalarWhereWithAggregatesInput | Prisma.CredentialFieldScalarWhereWithAggregatesInput[];
    OR?: Prisma.CredentialFieldScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CredentialFieldScalarWhereWithAggregatesInput | Prisma.CredentialFieldScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CredentialField"> | string;
    platformId?: Prisma.StringWithAggregatesFilter<"CredentialField"> | string;
    key?: Prisma.StringWithAggregatesFilter<"CredentialField"> | string;
    label?: Prisma.StringWithAggregatesFilter<"CredentialField"> | string;
    secret?: Prisma.BoolWithAggregatesFilter<"CredentialField"> | boolean;
    value?: Prisma.StringWithAggregatesFilter<"CredentialField"> | string;
    position?: Prisma.IntWithAggregatesFilter<"CredentialField"> | number;
};
export type CredentialFieldCreateInput = {
    id?: string;
    key: string;
    label: string;
    secret?: boolean;
    value: string;
    position?: number;
    platform: Prisma.PlatformCreateNestedOneWithoutCredentialFieldsInput;
};
export type CredentialFieldUncheckedCreateInput = {
    id?: string;
    platformId: string;
    key: string;
    label: string;
    secret?: boolean;
    value: string;
    position?: number;
};
export type CredentialFieldUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    secret?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    platform?: Prisma.PlatformUpdateOneRequiredWithoutCredentialFieldsNestedInput;
};
export type CredentialFieldUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platformId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    secret?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialFieldCreateManyInput = {
    id?: string;
    platformId: string;
    key: string;
    label: string;
    secret?: boolean;
    value: string;
    position?: number;
};
export type CredentialFieldUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    secret?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialFieldUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platformId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    secret?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialFieldListRelationFilter = {
    every?: Prisma.CredentialFieldWhereInput;
    some?: Prisma.CredentialFieldWhereInput;
    none?: Prisma.CredentialFieldWhereInput;
};
export type CredentialFieldOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CredentialFieldPlatformIdKeyCompoundUniqueInput = {
    platformId: string;
    key: string;
};
export type CredentialFieldCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platformId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    secret?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type CredentialFieldAvgOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type CredentialFieldMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platformId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    secret?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type CredentialFieldMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platformId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    secret?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type CredentialFieldSumOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type CredentialFieldCreateNestedManyWithoutPlatformInput = {
    create?: Prisma.XOR<Prisma.CredentialFieldCreateWithoutPlatformInput, Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput> | Prisma.CredentialFieldCreateWithoutPlatformInput[] | Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput[];
    connectOrCreate?: Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput | Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput[];
    createMany?: Prisma.CredentialFieldCreateManyPlatformInputEnvelope;
    connect?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
};
export type CredentialFieldUncheckedCreateNestedManyWithoutPlatformInput = {
    create?: Prisma.XOR<Prisma.CredentialFieldCreateWithoutPlatformInput, Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput> | Prisma.CredentialFieldCreateWithoutPlatformInput[] | Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput[];
    connectOrCreate?: Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput | Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput[];
    createMany?: Prisma.CredentialFieldCreateManyPlatformInputEnvelope;
    connect?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
};
export type CredentialFieldUpdateManyWithoutPlatformNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialFieldCreateWithoutPlatformInput, Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput> | Prisma.CredentialFieldCreateWithoutPlatformInput[] | Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput[];
    connectOrCreate?: Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput | Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput[];
    upsert?: Prisma.CredentialFieldUpsertWithWhereUniqueWithoutPlatformInput | Prisma.CredentialFieldUpsertWithWhereUniqueWithoutPlatformInput[];
    createMany?: Prisma.CredentialFieldCreateManyPlatformInputEnvelope;
    set?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    disconnect?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    delete?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    connect?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    update?: Prisma.CredentialFieldUpdateWithWhereUniqueWithoutPlatformInput | Prisma.CredentialFieldUpdateWithWhereUniqueWithoutPlatformInput[];
    updateMany?: Prisma.CredentialFieldUpdateManyWithWhereWithoutPlatformInput | Prisma.CredentialFieldUpdateManyWithWhereWithoutPlatformInput[];
    deleteMany?: Prisma.CredentialFieldScalarWhereInput | Prisma.CredentialFieldScalarWhereInput[];
};
export type CredentialFieldUncheckedUpdateManyWithoutPlatformNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialFieldCreateWithoutPlatformInput, Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput> | Prisma.CredentialFieldCreateWithoutPlatformInput[] | Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput[];
    connectOrCreate?: Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput | Prisma.CredentialFieldCreateOrConnectWithoutPlatformInput[];
    upsert?: Prisma.CredentialFieldUpsertWithWhereUniqueWithoutPlatformInput | Prisma.CredentialFieldUpsertWithWhereUniqueWithoutPlatformInput[];
    createMany?: Prisma.CredentialFieldCreateManyPlatformInputEnvelope;
    set?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    disconnect?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    delete?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    connect?: Prisma.CredentialFieldWhereUniqueInput | Prisma.CredentialFieldWhereUniqueInput[];
    update?: Prisma.CredentialFieldUpdateWithWhereUniqueWithoutPlatformInput | Prisma.CredentialFieldUpdateWithWhereUniqueWithoutPlatformInput[];
    updateMany?: Prisma.CredentialFieldUpdateManyWithWhereWithoutPlatformInput | Prisma.CredentialFieldUpdateManyWithWhereWithoutPlatformInput[];
    deleteMany?: Prisma.CredentialFieldScalarWhereInput | Prisma.CredentialFieldScalarWhereInput[];
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type CredentialFieldCreateWithoutPlatformInput = {
    id?: string;
    key: string;
    label: string;
    secret?: boolean;
    value: string;
    position?: number;
};
export type CredentialFieldUncheckedCreateWithoutPlatformInput = {
    id?: string;
    key: string;
    label: string;
    secret?: boolean;
    value: string;
    position?: number;
};
export type CredentialFieldCreateOrConnectWithoutPlatformInput = {
    where: Prisma.CredentialFieldWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialFieldCreateWithoutPlatformInput, Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput>;
};
export type CredentialFieldCreateManyPlatformInputEnvelope = {
    data: Prisma.CredentialFieldCreateManyPlatformInput | Prisma.CredentialFieldCreateManyPlatformInput[];
};
export type CredentialFieldUpsertWithWhereUniqueWithoutPlatformInput = {
    where: Prisma.CredentialFieldWhereUniqueInput;
    update: Prisma.XOR<Prisma.CredentialFieldUpdateWithoutPlatformInput, Prisma.CredentialFieldUncheckedUpdateWithoutPlatformInput>;
    create: Prisma.XOR<Prisma.CredentialFieldCreateWithoutPlatformInput, Prisma.CredentialFieldUncheckedCreateWithoutPlatformInput>;
};
export type CredentialFieldUpdateWithWhereUniqueWithoutPlatformInput = {
    where: Prisma.CredentialFieldWhereUniqueInput;
    data: Prisma.XOR<Prisma.CredentialFieldUpdateWithoutPlatformInput, Prisma.CredentialFieldUncheckedUpdateWithoutPlatformInput>;
};
export type CredentialFieldUpdateManyWithWhereWithoutPlatformInput = {
    where: Prisma.CredentialFieldScalarWhereInput;
    data: Prisma.XOR<Prisma.CredentialFieldUpdateManyMutationInput, Prisma.CredentialFieldUncheckedUpdateManyWithoutPlatformInput>;
};
export type CredentialFieldScalarWhereInput = {
    AND?: Prisma.CredentialFieldScalarWhereInput | Prisma.CredentialFieldScalarWhereInput[];
    OR?: Prisma.CredentialFieldScalarWhereInput[];
    NOT?: Prisma.CredentialFieldScalarWhereInput | Prisma.CredentialFieldScalarWhereInput[];
    id?: Prisma.StringFilter<"CredentialField"> | string;
    platformId?: Prisma.StringFilter<"CredentialField"> | string;
    key?: Prisma.StringFilter<"CredentialField"> | string;
    label?: Prisma.StringFilter<"CredentialField"> | string;
    secret?: Prisma.BoolFilter<"CredentialField"> | boolean;
    value?: Prisma.StringFilter<"CredentialField"> | string;
    position?: Prisma.IntFilter<"CredentialField"> | number;
};
export type CredentialFieldCreateManyPlatformInput = {
    id?: string;
    key: string;
    label: string;
    secret?: boolean;
    value: string;
    position?: number;
};
export type CredentialFieldUpdateWithoutPlatformInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    secret?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialFieldUncheckedUpdateWithoutPlatformInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    secret?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialFieldUncheckedUpdateManyWithoutPlatformInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    secret?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialFieldSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platformId?: boolean;
    key?: boolean;
    label?: boolean;
    secret?: boolean;
    value?: boolean;
    position?: boolean;
    platform?: boolean | Prisma.PlatformDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["credentialField"]>;
export type CredentialFieldSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platformId?: boolean;
    key?: boolean;
    label?: boolean;
    secret?: boolean;
    value?: boolean;
    position?: boolean;
    platform?: boolean | Prisma.PlatformDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["credentialField"]>;
export type CredentialFieldSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platformId?: boolean;
    key?: boolean;
    label?: boolean;
    secret?: boolean;
    value?: boolean;
    position?: boolean;
    platform?: boolean | Prisma.PlatformDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["credentialField"]>;
export type CredentialFieldSelectScalar = {
    id?: boolean;
    platformId?: boolean;
    key?: boolean;
    label?: boolean;
    secret?: boolean;
    value?: boolean;
    position?: boolean;
};
export type CredentialFieldOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "platformId" | "key" | "label" | "secret" | "value" | "position", ExtArgs["result"]["credentialField"]>;
export type CredentialFieldInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    platform?: boolean | Prisma.PlatformDefaultArgs<ExtArgs>;
};
export type CredentialFieldIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    platform?: boolean | Prisma.PlatformDefaultArgs<ExtArgs>;
};
export type CredentialFieldIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    platform?: boolean | Prisma.PlatformDefaultArgs<ExtArgs>;
};
export type $CredentialFieldPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CredentialField";
    objects: {
        platform: Prisma.$PlatformPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        platformId: string;
        key: string;
        label: string;
        secret: boolean;
        value: string;
        position: number;
    }, ExtArgs["result"]["credentialField"]>;
    composites: {};
};
export type CredentialFieldGetPayload<S extends boolean | null | undefined | CredentialFieldDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload, S>;
export type CredentialFieldCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CredentialFieldFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CredentialFieldCountAggregateInputType | true;
};
export interface CredentialFieldDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CredentialField'];
        meta: {
            name: 'CredentialField';
        };
    };
    findUnique<T extends CredentialFieldFindUniqueArgs>(args: Prisma.SelectSubset<T, CredentialFieldFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CredentialFieldFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CredentialFieldFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CredentialFieldFindFirstArgs>(args?: Prisma.SelectSubset<T, CredentialFieldFindFirstArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CredentialFieldFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CredentialFieldFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CredentialFieldFindManyArgs>(args?: Prisma.SelectSubset<T, CredentialFieldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CredentialFieldCreateArgs>(args: Prisma.SelectSubset<T, CredentialFieldCreateArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CredentialFieldCreateManyArgs>(args?: Prisma.SelectSubset<T, CredentialFieldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CredentialFieldCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CredentialFieldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CredentialFieldDeleteArgs>(args: Prisma.SelectSubset<T, CredentialFieldDeleteArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CredentialFieldUpdateArgs>(args: Prisma.SelectSubset<T, CredentialFieldUpdateArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CredentialFieldDeleteManyArgs>(args?: Prisma.SelectSubset<T, CredentialFieldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CredentialFieldUpdateManyArgs>(args: Prisma.SelectSubset<T, CredentialFieldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CredentialFieldUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CredentialFieldUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CredentialFieldUpsertArgs>(args: Prisma.SelectSubset<T, CredentialFieldUpsertArgs<ExtArgs>>): Prisma.Prisma__CredentialFieldClient<runtime.Types.Result.GetResult<Prisma.$CredentialFieldPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CredentialFieldCountArgs>(args?: Prisma.Subset<T, CredentialFieldCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CredentialFieldCountAggregateOutputType> : number>;
    aggregate<T extends CredentialFieldAggregateArgs>(args: Prisma.Subset<T, CredentialFieldAggregateArgs>): Prisma.PrismaPromise<GetCredentialFieldAggregateType<T>>;
    groupBy<T extends CredentialFieldGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CredentialFieldGroupByArgs['orderBy'];
    } : {
        orderBy?: CredentialFieldGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CredentialFieldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredentialFieldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CredentialFieldFieldRefs;
}
export interface Prisma__CredentialFieldClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    platform<T extends Prisma.PlatformDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlatformDefaultArgs<ExtArgs>>): Prisma.Prisma__PlatformClient<runtime.Types.Result.GetResult<Prisma.$PlatformPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CredentialFieldFieldRefs {
    readonly id: Prisma.FieldRef<"CredentialField", 'String'>;
    readonly platformId: Prisma.FieldRef<"CredentialField", 'String'>;
    readonly key: Prisma.FieldRef<"CredentialField", 'String'>;
    readonly label: Prisma.FieldRef<"CredentialField", 'String'>;
    readonly secret: Prisma.FieldRef<"CredentialField", 'Boolean'>;
    readonly value: Prisma.FieldRef<"CredentialField", 'String'>;
    readonly position: Prisma.FieldRef<"CredentialField", 'Int'>;
}
export type CredentialFieldFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
    where: Prisma.CredentialFieldWhereUniqueInput;
};
export type CredentialFieldFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
    where: Prisma.CredentialFieldWhereUniqueInput;
};
export type CredentialFieldFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CredentialFieldFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CredentialFieldFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CredentialFieldCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialFieldCreateInput, Prisma.CredentialFieldUncheckedCreateInput>;
};
export type CredentialFieldCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CredentialFieldCreateManyInput | Prisma.CredentialFieldCreateManyInput[];
};
export type CredentialFieldCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    data: Prisma.CredentialFieldCreateManyInput | Prisma.CredentialFieldCreateManyInput[];
    include?: Prisma.CredentialFieldIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CredentialFieldUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialFieldUpdateInput, Prisma.CredentialFieldUncheckedUpdateInput>;
    where: Prisma.CredentialFieldWhereUniqueInput;
};
export type CredentialFieldUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CredentialFieldUpdateManyMutationInput, Prisma.CredentialFieldUncheckedUpdateManyInput>;
    where?: Prisma.CredentialFieldWhereInput;
    limit?: number;
};
export type CredentialFieldUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialFieldUpdateManyMutationInput, Prisma.CredentialFieldUncheckedUpdateManyInput>;
    where?: Prisma.CredentialFieldWhereInput;
    limit?: number;
    include?: Prisma.CredentialFieldIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CredentialFieldUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
    where: Prisma.CredentialFieldWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialFieldCreateInput, Prisma.CredentialFieldUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CredentialFieldUpdateInput, Prisma.CredentialFieldUncheckedUpdateInput>;
};
export type CredentialFieldDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
    where: Prisma.CredentialFieldWhereUniqueInput;
};
export type CredentialFieldDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialFieldWhereInput;
    limit?: number;
};
export type CredentialFieldDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialFieldSelect<ExtArgs> | null;
    omit?: Prisma.CredentialFieldOmit<ExtArgs> | null;
    include?: Prisma.CredentialFieldInclude<ExtArgs> | null;
};
