import { Column, Entity } from "typeorm";

@Entity()
export class PlayId {

    @Column()
    id: number
}
