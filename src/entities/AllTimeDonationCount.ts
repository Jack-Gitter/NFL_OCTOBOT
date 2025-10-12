import { Column, Entity } from "typeorm";

@Entity()
export class AllTimeDonationCount {

    @Column({primary: true})
    id: number

    @Column({type: 'float'})
    money: number

}
