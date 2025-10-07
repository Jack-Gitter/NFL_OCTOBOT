import { Column, Entity } from "typeorm";

@Entity()
export class OctopusCount {

    @Column({primary: true, type: 'bigint'})
    count: number

}
