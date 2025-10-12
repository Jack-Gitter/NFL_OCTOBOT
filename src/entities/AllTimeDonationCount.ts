import { Column, Entity } from "typeorm";

@Entity()
export class AllTimeDonationCount {

    constructor(
        id: number, 
        money: number, 
        topDonatorName: string, 
        topDonatorAmount: number
    ) {
        this.id = id
        this.money = money
        this.topDonatorName = topDonatorName
        this.topDonatorAmount = topDonatorAmount
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
