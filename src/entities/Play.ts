import { Column, Entity } from "typeorm";

@Entity()
export class Play {

    @Column({primary: true})
    id: number
}
