import { Column } from "typeorm"

export class PlayerOctopusCount {

    constructor(id: number, octopusCount: number) {
        this.id = id
        this.octopusCount = octopusCount
    }

    @Column({primary: true, type: 'bigint'})
    public id: number

    @Column({type: 'bigint'})
    public octopusCount: number

}
