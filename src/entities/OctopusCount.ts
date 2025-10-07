import { Column, Entity } from "typeorm";

@Entity()
export class OctopusCount {

    constructor(id: number, count: number) {
        this.id = id
        this.count = count
    }

    @Column({primary: true})
    id: number

    @Column({type: 'bigint'})
    count: number

}
