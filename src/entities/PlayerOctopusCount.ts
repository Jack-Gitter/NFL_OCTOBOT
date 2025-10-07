import { Column, Entity } from "typeorm"

@Entity()
export class PlayerOctopusCount {

    constructor(id: number, octopusCount: number = 0) {
        this.id = id
        this.octopusCount = octopusCount
    }

    @Column({primary: true, type: 'bigint'})
    public id: number

    @Column({type: 'int', default: 0})
    public octopusCount: number

}
