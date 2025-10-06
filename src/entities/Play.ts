import { Column, Entity } from "typeorm";

@Entity()
export class ScoringPlay {

    @Column({primary: true})
    id: number
}
