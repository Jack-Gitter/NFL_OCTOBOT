import { Column, Entity } from "typeorm";

@Entity()
export class PlayId {
    @Column({ primary: true, type: 'int' })
    playId: number
}
