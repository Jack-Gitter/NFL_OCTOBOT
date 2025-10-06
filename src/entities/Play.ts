import { Column, Entity } from "typeorm";

@Entity()
export class ScoringPlay {

    @Column({primary: true, type: 'bigint'})
    id: number
}
