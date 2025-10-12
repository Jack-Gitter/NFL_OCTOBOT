import { Column, Entity } from "typeorm";

@Entity()
export class Donation {

    constructor(
        id: number, 
        money: number, 
        donatorName: string, 
        donatorAmount: number
    ) {
        this.id = id
        this.money = money
        this.donatorName = donatorName
        this.donatorAmount = donatorAmount
    }

    @Column({primary: true})
    id: number

    @Column({type: 'float'})
    money: number

    @Column()
    donatorName: string

    @Column({type: 'float'})
    donatorAmount: number

    @Column()
    month: Date

}
