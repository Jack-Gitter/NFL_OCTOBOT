import { Column, Entity } from "typeorm";

@Entity('Donations')
export class Donation {

    constructor(
        id: number, 
        money: number, 
        donatorName: string, 
        unixTimestamp: number
    ) {
        this.id = id
        this.money = money
        this.donatorName = donatorName
        this.timestamp = new Date(unixTimestamp)
    }

    @Column({primary: true, type: 'bigint'})
    id: number

    @Column({type: 'float'})
    money: number

    @Column()
    donatorName: string

    @Column()
    timestamp: Date

}
