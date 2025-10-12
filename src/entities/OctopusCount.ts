import { Column, Entity } from "typeorm";

@Entity()
export class OctopusCount {

    constructor(id: string, count: number) {
        this.id = id
        this.count = count
    }

    @Column({primary: true})
    id: string

    @Column({type: 'int'})
    count: number

}
