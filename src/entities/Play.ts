import { Column, Entity } from "typeorm";

@Entity()
export class ScoringPlay {

    constructor(id: number) {
        this.id = id
    }

    @Column({primary: true, type: 'bigint'})
    id: number
}
