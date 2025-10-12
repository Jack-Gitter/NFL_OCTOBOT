import { Column, Entity } from "typeorm"

@Entity()
export class PlayerOctopusCount {

    constructor(id: string, octopusCount: number = 0) {
        this.id = id
        this.octopusCount = octopusCount
    }

    @Column({primary: true})
    public id: string

    @Column({type: 'int', default: 0})
    public octopusCount: number

}
