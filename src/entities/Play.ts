import { Column, Entity } from "typeorm";

@Entity()
export class ScoringPlay {

    constructor(id: string) {
        this.id = id
    }

    @Column({primary: true})
    id: string
}
