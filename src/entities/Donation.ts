import { Column, Entity } from "typeorm";

@Entity()
export class Donation {

    constructor(
        id: number, 
        money: number, 
        donatorName: string, 
        donatorAmount: number,
        timestamp: string
    ) {
        this.id = id
        this.money = money
        this.donatorName = donatorName
        this.donatorAmount = donatorAmount
        this.timestamp = new Date(timestamp)
    }

    @Column({primary: true, type: 'bigint'})
    id: number

    @Column({type: 'float'})
    money: number

    @Column()
    donatorName: string

    @Column({type: 'float'})
    donatorAmount: number

    @Column()
    timestamp: Date

}
