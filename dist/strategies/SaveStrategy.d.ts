import { StateFileContainer } from "../StateFileContainer";
export declare class SaveStrategy<DataUnit> {
    private sfc;
    constructor(sfc: StateFileContainer<DataUnit>);
    seal(newCrackData?: Array<DataUnit>): void;
    split(): void;
    save(): void;
    saveCrack(index: number): void;
}
