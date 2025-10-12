import { Column, Entity } from "typeorm";

@Entity()
export class AllTimeDonationCount {

    constructor(id: number, money: number) {
        this.id = id
        this.money = money
    }

    @Column({primary: true})
    id: number

    @Column({type: 'float'})
    money: number

    @Column()
    topDonatorName: string

    @Column({type: 'float'})
    topDonatorAmount: number

}
