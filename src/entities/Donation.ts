import { Column, Entity } from "typeorm";

@Entity('donations')
export class Donation {

    constructor(
        id: number, 
        money: number, 
        donatorName: string, 
        unixTimestamp: number,
        donatorId: number
    ) {
        this.id = id
        this.money = money
        this.donatorName = donatorName
        this.timestamp = new Date(unixTimestamp * 1000)
        this.donatorId = donatorId
    }

    @Column({primary: true, type: 'bigint'})
    id: number

    @Column({type: 'float'})
    money: number

    @Column({name: 'donator_name'})
    donatorName: string

    @Column()
    timestamp: Date

    @Column()
    donatorId: number

}
