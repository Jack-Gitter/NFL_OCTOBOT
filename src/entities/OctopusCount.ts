import { Column, Entity } from "typeorm";

@Entity()
export class OctopusCount {

    constructor(count: number) {
        this.count = count
    }

    @Column({primary: true, type: 'bigint'})
    count: number

}
