import { Column, Entity } from "typeorm";

@Entity()
export class Play {

    @Column()
    id: number
}
