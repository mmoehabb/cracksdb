export type Type = {
    [key: string]: "string" | "number" | "boolean" | Type
}

export type Meta = {
    substate: string,
    crack: number,
    sealed?: boolean
}

export type SF = {
    meta: Meta,
    data: Array<object>,
    unittype: Type
}

export type Condition<DataUnit> = (obj: DataUnit) => boolean;